import { AsyncStorage } from "react-native";
import { LogService } from "./Index";
import { CONFIG } from "../config/Index";

class StorageService {
  static async fetchData(entryID) {
    const localItems = await this._fetchLocalData(entryID);

    const syncedItems = (await this._isSyncRequired())
      ? this._fetchSyncedData(entryID)
      : localItems;

    return syncedItems;
  }

  /*--------------------------------------------------
    ⭑ Private methods
  ----------------------------------------------------*/
  static async _fetchLocalData(entryID) {
    let items = await this._getFromLocalStorage("items");
    if (items)
      items.currentItem = this._getCurrentItem(items.allItems, entryID);

    return items;
  }

  static async _isSyncRequired() {
    const lastSyncedAt = await this._getFromLocalStorage("lastSyncedAt");
    const cache_timeout_secs = CONFIG.CACHE_TIMEOUT * 24 * 60 * 60 * 1000;

    const isSyncRequired =
      lastSyncedAt === null || lastSyncedAt + cache_timeout_secs < Date.now();

    return isSyncRequired;
  }

  static async _fetchSyncedData(entryID) {
    var items;
    try {
      // Fetch from Airtable
      const itemsFromCloud = await this._fetchDataFromAirtable(entryID);
      await this._storeLocalData(itemsFromCloud); // Store into local data
      items = itemsFromCloud;
    } catch (error) {
      // Timeout? Fallback to locally stored data
      const localItems = await this._fetchLocalData(entryID);
      items = localItems;
    }

    return items;
  }

  static async _fetchDataFromAirtable(entryID) {
    const params = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    let url = this._getFetchURL(entryID);
    let response = await fetch(url, params);

    return await response.json();
  }

  static async _storeLocalData(items) {
    AsyncStorage.setItem("items", JSON.stringify(items));
    AsyncStorage.setItem("lastSyncedAt", JSON.stringify(Date.now()));
  }

  static _getFetchURL(entryID) {
    const urlBase =
      "https://h9r2pkur9g.execute-api.us-east-1.amazonaws.com/Prod/items";
    const url = entryID ? urlBase + "?entryID=" + entryID : urlBase;

    return url;
  }

  static async _getFromLocalStorage(key) {
    const result = await AsyncStorage.getItem(key);
    return JSON.parse(result);
  }

  static _getCurrentItem(items, entryID) {
    let item;

    switch (entryID) {
      case "":
        // Return random item if no specific entryID is requested
        item = this._getRandomItem(items);
        break;

      default:
        item = items.find(item => {
          return item.id === entryID;
        });

        if (item === undefined) {
          item = this._getRandomItem(items);
        }

        break;
    }

    return item;
  }

  static _getRandomItem(items) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
}

export { StorageService };
