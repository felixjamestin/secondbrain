import { Permissions, Notifications } from "expo";
import Amplify, { API } from "aws-amplify";
import config from "../../aws-exports";

Amplify.configure(config);

/*---------------------------------------------------
⭑ Main function
----------------------------------------------------*/
async function registerForPushNotifications() {
  try {
    // 1. Get OS permission for push
    const wasPushNotificationPermissionObtained = await getOSPermissionForPushNotifications();
    if (!wasPushNotificationPermissionObtained) return;

    // 2. Get device push token
    let token = await Notifications.getExpoPushTokenAsync();

    // 3. Send token to backend
    sendPushTokenToBackend(token);
  } catch (error) {
    console.log(error);
  }
}

/*---------------------------------------------------
⭑ Sub functions
----------------------------------------------------*/
async function sendPushTokenToBackend(token) {
  const apiName = "sbapi";
  const createPath = "/users";
  const newItem = {
    headers: {}, // OPTIONAL
    response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: {}, // OPTIONAL
    body: { token: token, email: "felixjamestin@gmail.com" }
  };
  await API.post(apiName, createPath, newItem);
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

/*--------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { registerForPushNotifications };
