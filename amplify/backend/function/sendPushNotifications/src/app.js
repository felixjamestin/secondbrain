var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var request = require("request");

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

// Handle calls
app.all("/notifications", function(req, res, next) {
  // 1. Read random entry off airtable (restrict to once per day)

  // 2. Read push key off dynamo db

  // 3. Call expo push api
  request("https://exp.host/--/api/v2/push/send", function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  });

  console.log("Accessing the secret section ...");
  res.json({ success: "call succeed!", url: req.url });
});

// const fetchEntries = async () => {
//   try {
//     // Prepare data for api call
//     const url =
//       "https://api.airtable.com/v0/apptkZub52FJhrud6/secondbrain?maxRecords=100&view=Grid%20view";

//     const token = "key34bOupUaggtKkP";
//     const obj = {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token
//       }
//     };

//     // Fetch results from Airtable api
//     let response = await fetch(url, obj);
//     let responseJson = await response.json();

//     // Remove empty entries
//     let dataSourceSanitized = responseJson.records.filter(record => {
//       return Object.keys(record.fields).length > 0;
//     });

//     // Get a random item for display
//     const item = this.getRandomItem(dataSourceSanitized);
//   } catch (error) {
//     console.error(error);
//   }
// };

// /**********************
//  * Example get method *
//  **********************/

// app.get("/notifications", function(req, res) {
//   res.json({ success: "get call succeed!", url: req.url });
// });

// app.get("/notifications/*", function(req, res) {
//   // Add your code here
//   res.json({ success: "get call succeed!", url: req.url });
// });

// /****************************
//  * Example post method *
//  ****************************/

// app.post("/notifications", function(req, res) {
//   // Add your code here
//   res.json({ success: "post call succeed!", url: req.url, body: req.body });
// });

// app.post("/notifications/*", function(req, res) {
//   // Add your code here
//   res.json({ success: "post call succeed!", url: req.url, body: req.body });
// });

// /****************************
//  * Example post method *
//  ****************************/

// app.put("/notifications", function(req, res) {
//   // Add your code here
//   res.json({ success: "put call succeed!", url: req.url, body: req.body });
// });

// app.put("/notifications/*", function(req, res) {
//   // Add your code here
//   res.json({ success: "put call succeed!", url: req.url, body: req.body });
// });

// /****************************
//  * Example delete method *
//  ****************************/

// app.delete("/notifications", function(req, res) {
//   // Add your code here
//   res.json({ success: "delete call succeed!", url: req.url });
// });

// app.delete("/notifications/*", function(req, res) {
//   // Add your code here
//   res.json({ success: "delete call succeed!", url: req.url });
// });

app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
