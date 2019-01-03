import React from "react";
import { View, Image, StyleSheet } from "react-native";

const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    let headerLogo = this._getHeaderImage();

    return (
      <View>
        <Image
          source={headerLogo.image}
          style={[styles.logo, headerLogo.style]}
          resizeMode="contain"
        />
        <View style={styles.seperator} />
      </View>
    );
  }

  /*--------------------------------------------------
  ⭑ Helpers & Handlers
----------------------------------------------------*/
  _getHeaderImage() {
    const appKey = this.props.appKey;

    let headerLogo;
    switch (appKey) {
      case secondbrainApps.appKeys.sb:
        headerLogo = {
          image: require("../../assets/sb-header_logo.png"),
          style: { width: 180 }
        };

        break;

      case secondbrainApps.appKeys.rmed:
        headerLogo = {
          image: require("../../assets/rmed-header_logo.png"),
          style: { width: 220 }
        };
        break;

      default:
        break;
    }

    return headerLogo;
  }
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  logo: {
    flex: 1,
    alignSelf: "center",
    width: 180,
    paddingTop: 80,
    marginTop: 20
  },
  seperator: {
    backgroundColor: "#333",
    height: 0.5
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { Header };
