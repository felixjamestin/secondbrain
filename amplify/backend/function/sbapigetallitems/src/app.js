/*--------------------------------------------------
⭑ Description: This is a lambda function to return
* entries stored in Airtable
----------------------------------------------------*/
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
app.get("/items", async function(req, res) {
  try {
    let items = await _getEntriesFromAirtable();
    let sanitizedItems = items.records.filter(item => {
      return Object.keys(item.fields).length > 0;
    });

    let entryID = _getIDForCurrentItem(req.apiGateway.event);
    let currentItem = _getCurrentItem(sanitizedItems, entryID);

    res.json({ currentItem: currentItem, allItems: sanitizedItems });
  } catch (err) {
    res.json({ error: "Something went wrong " + err });
  }
});

app.get("/items/*", function(req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/*--------------------------------------------------
⭑ Private functions
----------------------------------------------------*/
async function _getEntriesFromAirtable() {
  const token = "key34bOupUaggtKkP";
  const uri =
    "https://api.airtable.com/v0/appfE7KsVoV5uiRhK/personal?maxRecords=1000&view=Grid%20view";

  const requestOptions = {
    uri: uri,
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

function _getCurrentItem(items, entryID) {
  let item;
  switch (entryID) {
    case "":
      // Return random item if no specific entryID is requested
      item = _getRandomItem(items);
      break;

    default:
      item = items.find(item => {
        return item.id === entryID;
      });

      if (item === undefined) {
        item = _getRandomItem(items);
      }

      break;
  }

  return item;
}

function _getRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

function _getIDForCurrentItem(event) {
  return event.queryStringParameters
    ? event.queryStringParameters.entryID
      ? event.queryStringParameters.entryID
      : ""
    : "";
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
