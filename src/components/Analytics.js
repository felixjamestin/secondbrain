import Amplify, { Analytics } from "aws-amplify";
import config from "../../aws-exports";

Amplify.configure(config);

export class AnalyticsHelper {
  static eventEnum() {
    return {
      appOpen: 1,
      showNext: 2,
      createItem: 3,
      deleteItem: 4,
      shareItem: 5,
      error: 6
    };
  }

  static trackEvent(eventType) {
    switch (eventType) {
      // Track app opens
      case AnalyticsHelper.eventEnum().appOpen:
        AnalyticsHelper.registerAnalytics();
        break;

      // Track other events
      case AnalyticsHelper.eventEnum().showNext:
        Analytics.record({
          name: "showNext",
          attributes: { user_email: "felixjamestin@gmail.com" }
        });
        break;

      default:
        break;
    }
  }

  static registerAnalytics() {
    Analytics.updateEndpoint({
      UserId: "felixjamestin@gmail.com",
      Attributes: {
        interests: ["football", "basketball", "AWS"]
      },
      UserAttributes: {
        hobbies: ["piano", "hiking"]
      }
    });

    Analytics.record({
      name: "appOpen",
      attributes: { user_email: "felixjamestin@gmail.com" }
    });
  }
}
