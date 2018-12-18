import { Permissions, Notifications, Constants } from "expo";
import { API } from "aws-amplify";

/*---------------------------------------------------
⭑ Main functions
----------------------------------------------------*/
async function registerForPushNotifications() {
  try {
    // 1. Get OS permission for push
    const wasPushNotificationPermissionObtained = await getOSPermissionForPushNotifications();
    if (!wasPushNotificationPermissionObtained) return;

    // 2. Get device push token
    let token = await Notifications.getExpoPushTokenAsync();

    // 3. Send user details (push token, user timezone, etc) to backend
    sendUserDetailsToBackend(token);
  } catch (error) {
    console.log(error);
  }
}

/*---------------------------------------------------
⭑ Sub functions
----------------------------------------------------*/
async function sendUserDetailsToBackend(token) {
  const apiName = "sbapi";
  const createPath = "/users";

  // Get user's notification preferences
  // TODO: Add user settings for these
  const shouldSendDailyNotifications = true;
  const dailyNotificationTime = new Date().getTime();

  // Get user's timezone
  const date = new Date();
  const timeZoneOffset = date.getTimezoneOffset() / 60;

  const newItem = {
    headers: {},
    response: true,
    queryStringParameters: {},
    body: {
      token: token,
      email: "felixjamestin@gmail.com",
      shouldSendDailyNotifications: shouldSendDailyNotifications,
      timeZoneOffset: timeZoneOffset,
      dailyNotificationTime: dailyNotificationTime,
      deviceID: Constants.deviceId,
      deviceName: Constants.deviceName
    }
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
