import React, { PureComponent } from "react";
import { View, Image, StyleSheet } from "react-native";
import { LoadingState } from "./Index";

class BodyImage extends PureComponent {
  constructor(props) {
    super(props);

    // Initializations
    this.state = {
      isLoadingDone: false
    };
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View style={this.getItemStyles()}>
        {this.renderImage(this.props.uri)}
        {this.checkAndShowLoader()}
      </View>
    );
  }

  checkAndShowLoader() {
    const loader = <LoadingState loadingText="Loading image" />;
    return this.state.isLoadingDone === false ? loader : "";
  }

  renderImage(uri) {
    const imageView = (
      <Image
        style={
          this.state.isLoadingDone
            ? styles.excerpt_image
            : styles.container_excerpt_image_only
        }
        source={{
          uri: uri
        }}
        resizeMode="contain"
        onLoadStart={this.handleLoadStart}
        onLoadEnd={this.handleLoadComplete}
      />
    );

    return uri !== "" ? imageView : "";
  }

  /*--------------------------------------------------
  ⭑ Helpers & Handlers
  ----------------------------------------------------*/
  getItemStyles() {
    const style = this.props.doesDescriptionExist
      ? styles.container_excerpt_image
      : styles.container_excerpt_image_only;

    return style;
  }

  handleLoadStart = () => {
    this.setState({ isLoadingDone: false });
  };

  handleLoadComplete = () => {
    this.setState({ isLoadingDone: true });
  };
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container_excerpt_image: {
    marginTop: -15,
    paddingLeft: 17,
    paddingRight: 17
  },
  container_excerpt_image_only: {
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15
  },
  excerpt_image: {
    display: "flex",
    width: "100%",
    height: 400,
    marginLeft: 0,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 0 }
  },
  excerpt_image_loading: {
    display: "none"
  }
});

/*--------------------------------------------------
⭑ Export
----------------------------------------------------*/
export { BodyImage };
