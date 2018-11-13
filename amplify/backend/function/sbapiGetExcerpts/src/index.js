const requestpromise = require("request-promise");

exports.handler = async function(event, context) {
  try {
    let items = await getEntriesFromAirtable();
    let currentItem = getCurrentItem(
      items,
      event.queryStringParameters.entryID
    );

    console.log(items);
    console.log(currentItem);

    return {
      currentItem,
      items
    };
  } catch (error) {
    console.error(error);
  }
};

/*--------------------------------------------------
⭑ Component functions
----------------------------------------------------*/
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

function getCurrentItem(items, currentItemID) {
  return items.find(item => {
    item.id === currentItemID;
  });
}
