/*--------------------------------------------------
⭑ Description: This is a lambda function to send 
* push notifications to users of secondbrain & derivative 
* clients. How is this function tiggered, you ask? 
* Using an AWS Cloudwatch rule. Long live the monolith clouds
----------------------------------------------------*/
const AWS = require("aws-sdk");
const requestpromise = require("request-promise");

exports.handler = async function(event, context) {
  try {
    /*
     * Inside new API
     1. Get all items & corr. random entries from Airtable (i.e. per sheet)
     2. Get relevant push keys for sending
        * Get all keys for all apps
        * Select only those key’s whose current time in their timezone +-5 == 9am
     3. Send push notifications to the relevant push keys
     */

    // 1. Get random item from airtable
    let items = await _getEntriesFromAirtable();
    let item = items.currentItem;

    // 2. Read push key off dynamo db
    let pushTokens = await _getPushTokens();

    // 3. Call expo push api
    let result = await _sendPushNotifications(item, pushTokens);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error);
  }
};

/*--------------------------------------------------
⭑ Private functions
----------------------------------------------------*/

// 1. Read random entry off airtable
function _getEntriesFromAirtable() {
  // Prepare data for api call
  const requestOptions = {
    uri: "https://h9r2pkur9g.execute-api.us-east-1.amazonaws.com/Prod/items",
    method: "GET",
    json: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  return requestpromise(requestOptions);
}

// 2. Read push key off dynamo db
function _getPushTokens() {
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

// 3. Call expo push api
function _sendPushNotifications(randomEntry, pushTokens) {
  let { title, body } = _getPushTextForEntry(randomEntry);

  const pushTokensExcludingExpoClient = pushTokens.Items.filter(item => {
    return item.appType !== "expo" ? true : false; // Don't send pushes to apps launched from the expo client
  });

  const pushBodyForRecepients = pushTokensExcludingExpoClient.map(item => {
    return {
      to: item.token,
      title: title,
      body: body,
      data: { id: randomEntry.id }
    };
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

/*--------------------------------------------------
   ⭑ Helpers
----------------------------------------------------*/
function _getPushTextForEntry(item) {
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

  pushContent.title = _convertToSentenceCase(pushContent.title);
  pushContent.body = _convertToSentenceCase(pushContent.body);

  return pushContent;
}

function _convertToSentenceCase(string) {
  const sanitizedString = _sanitizeString(string);
  let markDownRegex = /([#*]{1,5}\s["“']*\w|[\.\!\?]\s*\w)/g;
  let plainTextRegex = /(^\s*\w|[\.\!\?]\s*\w)/g;

  const sentenceCaseString = _isTextInMarkdown(sanitizedString)
    ? sanitizedString.toLowerCase().replace(markDownRegex, function(c) {
        return c.toUpperCase(); // Detect for markdown
      })
    : sanitizedString.toLowerCase().replace(plainTextRegex, function(c) {
        return c.toUpperCase(); // Detect for plain text
      });

  return sentenceCaseString;
}

function _sanitizeString(string) {
  return string ? string : "";
}

function _isTextInMarkdown(text) {
  const firstSentence = text.split("\n")[0];
  const firstChar = firstSentence.trim().charAt(0);

  let isTextInMarkdown = false;
  const regex = /[#,*]/;
  if (regex.test(firstChar)) {
    isTextInMarkdown = true;
  }

  return isTextInMarkdown;
}
