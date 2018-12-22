import { Permissions, Notifications, Constants } from "expo";
import { API } from "aws-amplify";
import { Constants as AppConstants } from "../components/common/Index";

class UserService {
  static async registerUser() {
    try {
      // 1. Get OS permission for push
      const wasPushNotificationPermissionObtained = await this._getOSPermissionForPushNotifications();
      if (!wasPushNotificationPermissionObtained) return;

      // 2. Get device push token
      let token = await Notifications.getExpoPushTokenAsync();

      // 3. Send user details (push token, user timezone, etc) to backend
      this._sendUserDetailsToBackend(token);
    } catch (error) {
      console.log(error);
    }
  }

  /*---------------------------------------------------
  ⭑ Private methods
  ----------------------------------------------------*/
  static async _sendUserDetailsToBackend(token) {
    const apiName = "sbapi";
    const createPath = "/users";

    // Get user's timezone
    const date = new Date();
    const timeZoneOffset = date.getTimezoneOffset() / 60;

    // Get app details
    const newItem = {
      headers: {},
      response: true,
      queryStringParameters: {},
      body: {
        token: token,
        email: "felixjamestin@gmail.com",
        shouldSendNotifications: true,
        timeZoneOffset: timeZoneOffset,
        notificationTime: 9, // Send at 9 AM
        notificationFrequency: 1, // Every "1" day
        deviceID: Constants.deviceId,
        deviceName: Constants.deviceName,
        appType: Constants.appOwnership,
        appKey: AppConstants.appKeys.sb
      }
    };
    await API.post(apiName, createPath, newItem);
  }

  static async _getOSPermissionForPushNotifications() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus =
      existingStatus === "granted"
        ? existingStatus
        : (await Permissions.askAsync(Permissions.NOTIFICATIONS)).status; // Only for iOS; Android perms are granted during app install

    return finalStatus === "granted" ? true : false;
  }
}

/*--------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { UserService };
