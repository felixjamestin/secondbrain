import { Permissions, Notifications } from "expo";
import Amplify from "@aws-amplify/core";
import API from "@aws-amplify/api";
import config from "../../aws-exports";

Amplify.configure(config);

/*---------------------------------------------------
⭑ Main function
----------------------------------------------------*/
async function registerForPushNotifications() {
  // 1. Get OS permission for push
  const wasPushNotificationPermissionObtained = getOSPermissionForPushNotifications();
  if (!wasPushNotificationPermissionObtained) return;

  // 2. Get device push token
  let token = await Notifications.getExpoPushTokenAsync();

  // // 3. Send token to backend
  sendPushTokenToBackend(token);
}

/*--------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { registerForPushNotifications };

/*---------------------------------------------------
⭑ Sub functions
----------------------------------------------------*/
async function sendPushTokenToBackend(token) {
  const apiName = "secondbrainapi";
  const path = "/users";
  const newItem = {
    headers: {}, // OPTIONAL
    response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: {}, // OPTIONAL
    body: { push_token: token, email: "felixjamestin@gmail.com" }
  };

  await API.post(apiName, path, newItem);
}

async function getOSPermissionForPushNotifications() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );

  let finalStatus =
    existingStatus === "granted"
      ? existingStatus
      : (await Permissions.askAsync(Permissions.NOTIFICATIONS)).status; // Only for iOS; Android perms are granted during app install

  return finalStatus === "granted" ? true : false;
}
