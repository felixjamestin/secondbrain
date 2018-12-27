/*--------------------------------------------------
⭑ Description: This is a lambda function to send 
* push notifications to users of secondbrain & derivative 
* clients. How is this function tiggered, you ask? 
* Using an AWS Cloudwatch rule. Long live the monolith clouds
----------------------------------------------------*/

const AWS = require("aws-sdk");
const requestpromise = require("request-promise");
const secondbrainApps = require("./config");

main();
// exports.handler = async function(event, context) //TODO:
async function main() {
  await Promise.all(
    secondbrainApps.map(async app => {
      try {
        // 1. Get random item from airtable
        let items = await _getEntriesFromAirtable(app);
        let item = items.currentItem;

        // 2. Get push key for relevant users based on their notification time preferance
        let pushTokens = await _getPushTokens();

        // 3. Call expo push api
        let result = await _sendPushNotifications(item, pushTokens);
        console.log(JSON.stringify(result));
      } catch (error) {
        console.error(error);
      }
    })
  );
}

/*--------------------------------------------------
⭑ Private functions
----------------------------------------------------*/

// 1. Read random entry off airtable
function _getEntriesFromAirtable(app) {
  // Prepare data for api call
  const requestOptions = {
    uri:
      "https://h9r2pkur9g.execute-api.us-east-1.amazonaws.com/Prod/items?appKey=" +
      app.key,
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
async function _getPushTokens() {
  let pushUsersAll = await _getAllPushUsers();
  return _getFilteredPushUsersBasedOnTime(pushUsersAll);
}

function _getAllPushUsers() {
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1" //process.env.TABLE_REGION
  });

  const params = { TableName: "users", Limit: 1000 };

  return new Promise((resolve, reject) => {
    dynamodb.scan(params, function(err, data) {
      err === null ? resolve(data) : reject(err);
    });
  });
}

function _getFilteredPushUsersBasedOnTime(pushUsers) {
  const pushUsersFiltered = pushUsers.Items.filter(item => {
    if (item.shouldSendNotifications === false) return false;
    if (_hasUserPreferredNotificationTimeArrived(item.timeZoneOffset) !== true)
      return false;
  });

  const pushUsersFilteredExcludingExpoClient = pushUsersFiltered.filter(
    item => {
      return item.appType !== "expo" ? true : false; // Don't send pushes to apps launched from the expo client
    }
  );

  return pushUsersFilteredExcludingExpoClient;
}

// 3. Call expo push api
function _sendPushNotifications(randomEntry, pushTokens) {
  let { title, body } = _getPushTextForEntry(randomEntry);

  const pushBodyForRecepients = pushTokens.map(item => {
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

function _hasUserPreferredNotificationTimeArrived(timeZoneOffset) {
  // 1. Get the current system time in the user's timezone
  let currentTimeForUser = _convertSystemTimeToDifferentTimezone(
    timeZoneOffset
  );
  console.log(currentTimeForUser.toLocaleString());

  // 2. Get the preferred time to receive notifcations as set by the user
  let preferredTimeForUser = _convertSystemTimeToDifferentTimezone(
    timeZoneOffset
  );
  preferredTimeForUser.setHours(9); // TODO: Make this user customizable?
  preferredTimeForUser.setMinutes(0);
  preferredTimeForUser.setSeconds(0);
  preferredTimeForUser.setMilliseconds(0);
  console.log(preferredTimeForUser.toLocaleString());

  // 3. Check if the user's preferred time has come (the system checks this every 5 minutes)
  let currentTimeForUserSecs = currentTimeForUser.getTime();
  let preferredTimeForUserSecs = preferredTimeForUser.getTime();
  console.log(currentTimeForUserSecs);
  console.log(preferredTimeForUserSecs);

  if (
    preferredTimeForUserSecs >= currentTimeForUserSecs &&
    preferredTimeForUserSecs < currentTimeForUserSecs + 5 * 60 * 1000
  ) {
    console.log("Wooot! It's time");
    return true;
  } else {
    console.log("Not yet");
    return false;
  }
}

function _convertSystemTimeToDifferentTimezone(offset) {
  // Get UTC time in msec for the current server location
  let date = new Date();
  let utc = date.getTime() + date.getTimezoneOffset() * 60000;

  // Create new date object for the supplied offset
  var newDate = new Date(utc + 3600000 * offset);

  // Return time
  return newDate;
}
