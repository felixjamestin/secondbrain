import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Constants } from "./common/Constants";

const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class BodyMetaDesc extends PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
       Render UI 
  ----------------------------------------------------*/
  render() {
    const itemStyle = this._getItemStyles(
      this.props.author,
      this.props.title,
      this.props.appKey
    );

    return (
      <View>
        <Text style={itemStyle.title}>{this.props.title}</Text>
        <Text style={itemStyle.author}>{this.props.author}</Text>
        <View style={itemStyle.redbar} />
      </View>
    );
  }

  /*--------------------------------------------------
      Helpers & Handlers
  ----------------------------------------------------*/
  _getItemStyles(author, title, appKey) {
    let itemStyle = {
      author: "",
      title: "",
      redbar: ""
    };

    switch (appKey) {
      case secondbrainApps.appKeys.sb:
        this._getItemStylesForSB(author, title, itemStyle);
        break;

      case secondbrainApps.appKeys.rmed:
        this._getItemStylesForRMED(itemStyle);
        break;

      default:
        break;
    }

    return itemStyle;
  }

  _getItemStylesForSB(author, title, itemStyle) {
    itemStyle.title =
      title === "-" || title === ""
        ? styles.excerpt_title_empty
        : styles.excerpt_title;

    itemStyle.author =
      author === "-" || author === ""
        ? styles.excerpt_author_empty
        : title === "-" || title === ""
        ? styles.excerpt_author
        : styles.excerpt_author_secondary;

    itemStyle.redbar = this.props.doesDescriptionExist
      ? styles.redbar
      : styles.redbar_empty;

    return itemStyle;
  }

  _getItemStylesForRMED(itemStyle) {
    itemStyle.title = styles.excerpt_title_empty;
    itemStyle.author = styles.excerpt_author_empty;
    itemStyle.redbar = styles.redbar_empty;
    return itemStyle;
  }
}

/*---------------------------------------------------
    Styles 
----------------------------------------------------*/
const styles = StyleSheet.create({
  redbar: {
    backgroundColor: Constants.baseColors.red,
    height: 2,
    width: 40,
    marginTop: 10,
    marginBottom: 50
  },
  redbar_empty: {
    height: 0,
    width: 0,
    opacity: 0
  },
  excerpt_title: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15,
    letterSpacing: 0.5
  },
  excerpt_title_empty: {
    height: 0,
    width: 0,
    opacity: 0
  },
  excerpt_author: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15,
    letterSpacing: 0.5
  },
  excerpt_author_empty: {
    height: 0,
    width: 0,
    opacity: 0
  },
  excerpt_author_secondary: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 13,
    opacity: 0.65,
    marginTop: 5,
    marginBottom: 2,
    letterSpacing: 0.5
  },
  excerpt_type: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15
  }
});

/*--------------------------------------------------
    Export
----------------------------------------------------*/
export { BodyMetaDesc };
