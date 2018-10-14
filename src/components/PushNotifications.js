import { Permissions, Notifications } from "expo";

/*---------------------------------------------------
⭑ Main function
----------------------------------------------------*/
async function registerForPushNotifications() {
  // 1. Get OS permission
  const wasPushNotificationPermissionObtained = getOSPermissionForPushNotifications();
  if (!wasPushNotificationPermissionObtained) return;

  // 2. Get device push token
  let token = await Notifications.getExpoPushTokenAsync();
  console.log(token);

  // // 3. Send token to backend
  // return sendPushTokenToBackend(token);
}

/*--------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { registerForPushNotifications };

/*---------------------------------------------------
⭑ Sub functions
----------------------------------------------------*/
function sendPushTokenToBackend(token) {
  const PUSH_ENDPOINT = "https://your-server.com/users/push-token"; //TODO:
  return fetch(PUSH_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: {
        value: token
      },
      user: {
        username: "Brent" //TODO:
      }
    })
  });
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
