/*--------------------------------------------------
⭑ Description: This is a job that sends push
⭑ notifications to the secondbrain clients
----------------------------------------------------*/
const AWS = require("aws-sdk");
const request = require("request");
const requestpromise = require("request-promise");

exports.handler = async function(event, context) {
  try {
    // 1. Get random entry from airtable (restrict to once per day)
    let entries = await getEntriesFromAirtable();
    let randomEntry = getRandomItem(entries.records);
    console.log(randomEntry);

    // 2. Read push key off dynamo db
    let pushTokens = await getPushTokens();

    // 3. Call expo push api
    let result = await sendPushNotifications(randomEntry, pushTokens);
    console.log("----");
    console.log(result);
    console.log("----");
  } catch (error) {
    console.error(error);
  }
};

/*--------------------------------------------------
⭑ Component functions
----------------------------------------------------*/

// Read random entry off airtable
function getEntriesFromAirtable() {
  const token = "key34bOupUaggtKkP";
  const requestOptions = {
    uri:
      "https://api.airtable.com/v0/apptkZub52FJhrud6/secondbrain?maxRecords=500&view=Grid%20view",
    method: "GET",
    json: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  };

  return requestpromise(requestOptions);
}

function getRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

// Read push key off dynamo db
function getPushTokens() {
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1" //process.env.TABLE_REGION
  });

  const params = { TableName: "users", Limit: 100 };

  return new Promise((resolve, reject) => {
    dynamodb.scan(params, function(err, data) {
      err === null ? resolve(data) : reject(err);
    });
  });
}

// Call expo push api
function sendPushNotifications(randomEntry, pushTokens) {
  let { title, body } = getPushTextForEntry(randomEntry);

  const pushBodyForRecepients = pushTokens.Items.map(item => {
    return { to: item.token, title: title, body: body };
  });

  const requestOptions = {
    url: "https://exp.host/--/api/v2/push/send",
    method: "POST",
    json: true,
    body: pushBodyForRecepients,
    headers: {}
  };

  return requestpromise(requestOptions);
}

function getPushTextForEntry(item) {
  let pushContent = { title: "", body: "" };

  pushContent.title =
    item.fields.title !== undefined && item.fields.title !== "-"
      ? item.fields.title
      : item.fields.author !== undefined && item.fields.author !== "-"
        ? item.fields.author
        : item.fields.type;

  pushContent.body =
    item.fields.extract !== undefined && item.fields.extract !== "-"
      ? item.fields.extract
      : "Tap for details";

  pushContent.title = convertToSentenceCase(pushContent.title);
  pushContent.body = convertToSentenceCase(pushContent.body);

  return pushContent;
}

// TODO: Re-use common logic used below as well as in the mobile clients
function convertToSentenceCase(string) {
  const sanitizedString = sanitizeString(string);
  let markDownRegex = /([#*]{1,5}\s["“']*\w|[\.\!\?]\s*\w)/g;
  let plainTextRegex = /(^\s*\w|[\.\!\?]\s*\w)/g;

  const sentenceCaseString = isTextInMarkdown(sanitizedString)
    ? sanitizedString.toLowerCase().replace(markDownRegex, function(c) {
        return c.toUpperCase(); // Detect for markdown
      })
    : sanitizedString.toLowerCase().replace(plainTextRegex, function(c) {
        return c.toUpperCase(); // Detect for plain text
      });

  return sentenceCaseString;
}

function sanitizeString(string) {
  return string ? string : "";
}

function isTextInMarkdown(text) {
  const firstSentence = text.split("\n")[0];
  const firstChar = firstSentence.trim().charAt(0);

  let isTextInMarkdown = false;
  const regex = /[#,*]/;
  if (regex.test(firstChar)) {
    isTextInMarkdown = true;
  }

  return isTextInMarkdown;
}
