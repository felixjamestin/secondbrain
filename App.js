import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Font } from "expo";
import { Header, Excerpt, BlankState } from "./src/components/Index";
import { ColorConstants } from "./src/components/common/Index";
import { ArrayHelper } from "./src/helpers/Index";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Initializations
    this.state = {
      dataSource: {},
      currentItem: {},
      isDataLoadingDone: false,
      isFontLoadingDone: false
    };

    // Bindings
    this.handleShowNextExcerpt = this.handleShowNextExcerpt.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentDidMount() {
    this.fetchEntries();
    this.loadFonts();
  }

  /*--------------------------------------------------
    Render UI
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
    return <ActivityIndicator />;
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
        Helpers & Handlers
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
    if (showNextExcerpt === true) {
      const item = this.getRandomItem();

      this.setState({
        currentItem: item
      });
    }
  }

  getRandomItem(dataSource = this.state.dataSource) {
    return ArrayHelper.getRandomItemFromArray(dataSource);
  }

  async fetchEntries() {
    try {
      // Prepare data for api call
      const url =
        "https://api.airtable.com/v0/apptkZub52FJhrud6/secondbrain?maxRecords=100&view=Grid%20view";

      const token = "key34bOupUaggtKkP";
      const obj = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      };

      // Fetch results from Airtable api
      let response = await fetch(url, obj);
      let responseJson = await response.json();

      // Remove empty entries
      let dataSourceSanitized = responseJson.records.filter(record => {
        return Object.keys(record.fields).length > 0;
      });

      // Get a random item for display
      const item = this.getRandomItem(dataSourceSanitized);

      // Set internal state
      this.setState(
        {
          isDataLoadingDone: true,
          dataSource: dataSourceSanitized,
          currentItem: item
        },
        function() {}
      );
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
        Styles
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
