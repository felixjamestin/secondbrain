import React from "react";
import { StyleSheet, View } from "react-native";
import { Font, Notifications } from "expo";
import Amplify from "aws-amplify";
import {
  Header,
  Excerpt,
  BlankState,
  LoadingState,
  registerForPushNotifications,
  AnalyticsHelper
} from "./src/components/Index";
import { ColorConstants } from "./src/components/common/Index";
import { ArrayHelper } from "./src/helpers/Index";
import config from "./aws-exports";

Amplify.configure(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Initializations
    this.state = {
      dataSource: {},
      currentItem: {},
      currentItemID: "",
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
    registerForPushNotifications();
    Notifications.addListener(this.handleNotification);

    this.loadFonts();
    AnalyticsHelper.trackEvent(AnalyticsHelper.eventEnum().appOpen);

    this.fetchEntries();
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
        <Header />
        <BlankState />
      </View>
    );
  }

  renderWhenItemsExist() {
    const item = this.state.currentItem;

    return (
      <View style={styles.container}>
        <Header />
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

  handleShowNextExcerpt(showNextExcerpt) {
    if (showNextExcerpt !== true) return false;

    const item = this.getRandomItem();
    this.setState({
      currentItem: item
    });

    AnalyticsHelper.trackEvent(AnalyticsHelper.eventEnum().showNext);
  }

  getRandomItem(dataSource = this.state.dataSource) {
    return ArrayHelper.getRandomItemFromArray(dataSource);
  }

  async handleNotification(notification) {
    let entryID = notification.data.id
      ? notification.data.id
      : this.props.exp.notification;

    this.setState({ currentItemID: entryID });
  }

  async fetchEntries() {
    try {
      // Prepare data for api call
      const urlBase =
        "https://h9r2pkur9g.execute-api.us-east-1.amazonaws.com/Prod/items";
      const urlParams = "?entryID=" + this.state.currentItemID;
      const url = this.state.currentItemID ? urlBase + urlParams : urlBase;
      console.log(url);

      const obj = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };

      let response = await fetch(url, obj);
      let responseJson = await response.json();

      // Set internal state
      this.setState({
        isDataLoadingDone: true,
        currentItemID: "",
        dataSource: responseJson.allItems,
        currentItem: responseJson.currentItem
      });
    } catch (error) {
      console.error(error);
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
    backgroundColor: ColorConstants.baseColors.darkGrey
  },
  container: {
    flex: 1,
    justifyContent: "flex-start"
  }
});
