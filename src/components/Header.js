import React from "react";
import { View, Image, StyleSheet } from "react-native";

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View>
        <Image
          source={require("../../assets/header_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.seperator} />
      </View>
    );
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
