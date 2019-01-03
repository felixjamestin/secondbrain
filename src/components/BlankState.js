import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Constants } from "./common/Index";

class BlankState extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          We're really sorry, but something went wrong. Please reinstall the app
          and things should work fine.
        </Text>
      </View>
    );
  }
}

/*---------------------------------------------------
      Styles
  ----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    paddingHorizontal: 40
  },
  text: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15,
    marginTop: -100,
    textAlign: "center"
  }
});

/*---------------------------------------------------
      Exports
  ----------------------------------------------------*/
export { BlankState };
