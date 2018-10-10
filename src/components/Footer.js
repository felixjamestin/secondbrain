import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { ColorConstants } from "./common/Index";

class Footer extends React.PureComponent {
  constructor(props) {
    super(props);

    // Initializations
    this.state = {
      showNextExcerpt: false
    };
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onShowNext}
          style={styles.show_next_container}
          activeOpacity={0.6}
        >
          <View style={styles.show_next_subcontainer}>
            <Image
              source={require("../../assets/show_next_icon.png")}
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
  onShowNext = () => {
    this.props.onShowNextExcerpt(true);
  };
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingBottom: 250,
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
    color: ColorConstants.baseColors.white
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { Footer };
