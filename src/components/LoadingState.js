import React, { PureComponent } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { ColorConstants } from "./common/ColorConstants";

class LoadingState extends PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
     ⭑ Render UI 
  ----------------------------------------------------*/
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="small"
          color={ColorConstants.baseColors.white}
          style={styles.loading_spinner}
        />

        <Text style={styles.loading_text}>{this.getLoadingText()}</Text>
      </View>
    );
  }

  getLoadingText = () => {
    const defaultText =
      "When you realize nothing is lacking, the whole world belongs to you - Lao Tzu";

    return this.props.loadingText ? this.props.loadingText : defaultText;
  };
}

/*---------------------------------------------------
   ⭑ Styles 
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loading_text: {
    color: ColorConstants.baseColors.white,
    fontSize: 12,
    opacity: 0.7,
    marginTop: 20,
    marginHorizontal: 57,
    marginBottom: 150,
    textAlign: "center",
    lineHeight: 20
  },
  loading_spinner: {
    opacity: 0.8,
    marginTop: 50,
    marginBottom: -10
  }
});

/*--------------------------------------------------
⭑ Export
----------------------------------------------------*/
export { LoadingState };
