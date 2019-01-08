import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { Constants } from "./common/Index";

const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class Footer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const showNextIcon = this._getShowNextIconForApp(this.props.appKey);

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this._onShowNext}
          style={styles.show_next_container}
          activeOpacity={0.6}
        >
          <View style={styles.show_next_subcontainer}>
            <Image
              source={showNextIcon}
              style={styles.show_next_icon}
              resizeMode="contain"
            />
            <Text style={styles.show_next_text}>Show next</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  _onShowNext = () => {
    this.props.onShowNextExcerpt();
  };

  _getShowNextIconForApp(appKey) {
    let showNextIcon;

    switch (appKey) {
      case secondbrainApps.appKeys.sb:
        showNextIcon = require("../../assets/sb-show_next_icon.png");
        break;

      case secondbrainApps.appKeys.rmed:
        showNextIcon = require("../../assets/rmed-show_next_icon.png");
        break;

      default:
        showNextIcon = "";
        break;
    }

    return showNextIcon;
  }
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingBottom: 150,
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 42,
    paddingRight: 48
  },
  show_next_container: {
    flex: 1,
    height: 50,
    justifyContent: "center"
  },
  show_next_subcontainer: {
    flexDirection: "row"
  },
  show_next_icon: {
    width: 13,
    height: 13,
    marginRight: 3,
    top: 3,
    left: -2
  },
  show_next_text: {
    fontFamily: "overpass-light",
    fontSize: 15,
    color: Constants.baseColors.white
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { Footer };
