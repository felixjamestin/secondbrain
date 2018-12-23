/*--------------------------------------------------
⭑ Description: This is a lambda function to send 
* push notifications to users of secondbrain & derivative 
* clients. How is this function tiggered, you ask? 
* Using an AWS Cloudwatch rule. Long live the monolith clouds
----------------------------------------------------*/
const AWS = require("aws-sdk");
var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var requestpromise = require("request-promise");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/*--------------------------------------------------
⭑ Handle GET
----------------------------------------------------*/
app.get("/pushnotifications", async function(req, res) {
  try {
    /*
     * Inside new API
     * Get all items & corr. random entries from Airtable (i.e. per sheet)
     * Get relevant push keys for sending
     * Get all keys for all apps
     * Select only those key’s whose current time in their timezone +-5 == 9am
     * Send push notifications to the relevant push keys
     * Delete old API from client & server
     */

    console.log("Felix: Starting...");

    // 1. Get random item from airtable
    let items = await _getEntriesFromAirtable();
    let item = items.currentItem;
    console.log(item);

    // 2. Read push key off dynamo db
    let pushTokens = await _getPushTokens();

    // 3. Call expo push api
    let result = await _sendPushNotifications(item, pushTokens);
    console.log("----\n" + result + "----");
    res.json({ success: "Get call succeed", url: req.url });
  } catch (error) {
    console.error(error);
    res.json({ error: "Something went wrong " + err });
  }
});

app.get("/pushnotifications/*", function(req, res) {
  res.json({ success: "get call succeed!", url: req.url });
});

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

// TODO: Re-use common logic used below as well as in the mobile clients
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

/*--------------------------------------------------
⭑ Start server
----------------------------------------------------*/
app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
