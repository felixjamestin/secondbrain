import React from "react";
import { StyleSheet, View } from "react-native";
import { Font, Notifications, Constants } from "expo";
import Amplify from "aws-amplify";
import {
  Header,
  Excerpt,
  BlankState,
  LoadingState,
  AnalyticsHelper
} from "./src/components/Index";
import { Constants as AppConstants } from "./src/components/common/Index";
import { ArrayHelper } from "./src/helpers/Index";
import { StorageService, UserService, LogService } from "./src/services/Index";
import config from "./aws-exports";

const secondbrainApps = require("./amplify/backend/function/sbapigetallitems/src/constants");

Amplify.configure(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Initializations
    this.appKey = this.getAppKeyFromExpoReleaseChannel(
      Constants.manifest.releaseChannel
    );

    this.state = {
      dataSource: [],
      currentItem: {},
      isDataLoadingDone: false,
      isFontLoadingDone: false
    };

    // Bindings
    this.handleShowNextExcerpt = this.handleShowNextExcerpt.bind(this);
    this.handleNotification = this.handleNotification.bind(this);
  }

  /*--------------------------------------------------
  ⭑ Lifecycle events
  ----------------------------------------------------*/

  componentDidMount() {
    UserService.registerUser(this.appKey);
    Notifications.addListener(this.handleNotification);

    this.loadFonts();
    AnalyticsHelper.trackEvent(AnalyticsHelper.eventEnum().appOpen);

    this.fetchEntries(this.appKey);
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    return <View style={styles.wrapper}> {this.getViewForRender()}</View>;
  }

  getViewForRender() {
    const finalView = this.checkIfAppLoadingInProgress()
      ? this.renderWhenLoading()
      : this.checkIfNoEntries()
      ? this.renderWhenEmpty()
      : this.renderWhenItemsExist();

    return finalView;
  }

  renderWhenLoading() {
    return <LoadingState />;
  }

  renderWhenEmpty() {
    return (
      <View style={styles.container}>
        <Header appKey={this.appKey} />
        <BlankState />
      </View>
    );
  }

  renderWhenItemsExist() {
    const item = this.state.currentItem;

    return (
      <View style={styles.container}>
        <Header appKey={this.appKey} />
        <Excerpt item={item} onShowNextExcerpt={this.handleShowNextExcerpt} />
      </View>
    );
  }

  /*--------------------------------------------------
  ⭑ Helpers & Handlers
  ----------------------------------------------------*/
  checkIfAppLoadingInProgress() {
    const isAppLoadingInProgress =
      this.state.isDataLoadingDone === false ||
      this.state.isFontLoadingDone === false;

    return isAppLoadingInProgress;
  }

  checkIfNoEntries() {
    const isDataEmpty = !this.state.dataSource;
    return isDataEmpty;
  }

  handleShowNextExcerpt() {
    const item = this.getRandomItem();
    this.setState({
      currentItem: item
    });

    AnalyticsHelper.trackEvent(AnalyticsHelper.eventEnum().showNext);
  }

  getRandomItem(dataSource = this.state.dataSource) {
    return ArrayHelper.getRandomItemFromArray(dataSource);
  }

  getAppKeyFromExpoReleaseChannel(channel) {
    const releaseChannel = channel || "default";

    let appKey;
    switch (releaseChannel) {
      case "default":
        appKey = secondbrainApps.appKeys.sb;
        break;

      case "sb-staging":
      case "sb-prod":
        appKey = secondbrainApps.appKeys.sb;
        break;

      case "rmed-staging":
      case "rmed-prod":
        appKey = secondbrainApps.appKeys.rmed;
        break;

      default:
        break;
    }

    return appKey;
  }

  async handleNotification(notification) {
    let entryID = notification.data.id
      ? notification.data.id
      : this.props.exp.notification
      ? this.props.exp.notification.data.id
      : "";

    this.fetchEntries(this.appKey, entryID);
  }

  async fetchEntries(appKey, id = "") {
    try {
      const items = await StorageService.fetchData(appKey, id);

      // Set internal state
      let dataSource = items ? items.allItems : "";
      let currentItem = items ? items.currentItem : "";
      this.setState({
        isDataLoadingDone: true,
        dataSource: dataSource,
        currentItem: currentItem
      });
    } catch (error) {
      LogService.log(
        error.name + ": " + error.message,
        "error",
        "fetchEntries",
        LogService.loggingType.remote
      );
    }
  }

  async loadFonts() {
    await Font.loadAsync({
      "overpass-thin": require("./assets/fonts/overpass-thin.ttf"),
      "overpass-light": require("./assets/fonts/overpass-light.ttf"),
      "overpass-regular": require("./assets/fonts/overpass-regular.ttf"),
      "overpass-semibold": require("./assets/fonts/overpass-semibold.ttf")
    });

    this.setState({
      isFontLoadingDone: true
    });
  }
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: AppConstants.baseColors.darkGrey
  },
  container: {
    flex: 1,
    justifyContent: "flex-start"
  }
});
