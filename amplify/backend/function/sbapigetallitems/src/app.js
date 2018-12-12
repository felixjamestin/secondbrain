/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

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

/**********************
 * Example get method *
 **********************/

app.get("/items", async function(req, res) {
  try {
    let items = await getEntriesFromAirtable();
    let sanitizedItems = items.records.filter(item => {
      return Object.keys(item.fields).length > 0;
    });

    let entryID = getIDForCurrentItem(req.apiGateway.event);
    let currentItem = getCurrentItem(sanitizedItems, entryID);

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
⭑ Component functions
----------------------------------------------------*/
async function getEntriesFromAirtable() {
  const token = "key34bOupUaggtKkP";
  const requestOptions = {
    uri:
      "https://api.airtable.com/v0/apptkZub52FJhrud6/secondbrain?maxRecords=1000&view=Grid%20view",
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

function getCurrentItem(items, entryID) {
  let item;
  switch (entryID) {
    case "":
      // Return random item if no specific entryID is requested
      item = getRandomItem(items);
      break;

    default:
      item = items.find(item => {
        return item.id === entryID;
      });

      if (item === undefined) {
        item = getRandomItem(items);
      }

      break;
  }

  return item;
}

function getRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

function getIDForCurrentItem(event) {
  return event.queryStringParameters
    ? event.queryStringParameters.entryID
      ? event.queryStringParameters.entryID
      : ""
    : "";
}

/****************************
 * Example post method *
 ****************************/

app.post("/items", function(req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/items/*", function(req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example post method *
 ****************************/

app.put("/items", function(req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/items/*", function(req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/items", function(req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/items/*", function(req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
