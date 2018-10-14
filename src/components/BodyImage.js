import React, { PureComponent } from "react";
import { View, Image, StyleSheet } from "react-native";

class BodyImage extends PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    const style = this.getItemStyles();

    return <View style={style}>{this.renderImage(this.props.uri)}</View>;
  }

  renderImage(uri) {
    const imageView = (
      <Image
        style={styles.excerpt_image}
        source={{
          uri: uri
        }}
        resizeMode="contain"
      />
    );

    return uri ? imageView : "";
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
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container_excerpt_image: {
    paddingLeft: 17,
    paddingRight: 17
  },
  container_excerpt_image_only: {
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15
  },
  excerpt_image: {
    width: "100%",
    height: 400,
    marginLeft: 0,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 0 }
  }
});

/*--------------------------------------------------
⭑ Export
----------------------------------------------------*/
export { BodyImage };
