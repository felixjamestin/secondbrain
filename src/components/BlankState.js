import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ColorConstants } from "./common/Index";

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
        <Text style={styles.text}>I got nothing</Text>
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
    justifyContent: "flex-start",
    marginTop: 0
  },
  text: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15
  }
});

/*---------------------------------------------------
      Exports
  ----------------------------------------------------*/
export { BlankState };
