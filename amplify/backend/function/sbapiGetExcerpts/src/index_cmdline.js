const AWS = require("aws-sdk");
const requestpromise = require("request-promise");

main();

async function main() {
  try {
    let items = await getEntriesFromAirtable();

    // Remove empty entries
    let sanitizedItems = items.records.filter(item => {
      return Object.keys(item.fields).length > 0;
    });

    // Get item for display
    let entryID = "";
    let currentItem = getCurrentItem(sanitizedItems, entryID);

    console.log(sanitizedItems);
    console.log(currentItem);

    return {
      currentItem,
      sanitizedItems
    };
  } catch (error) {
    console.error(error);
  }
}

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
  return currentItemID
    ? // Return item corresponding to ID
      items.find(item => {
        item.id === currentItemID;
      })
    : // Return random item
      getRandomItem(items);
}

function getRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}
