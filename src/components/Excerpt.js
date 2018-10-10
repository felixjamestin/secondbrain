import React from "react";
import { View, StyleSheet, FlatList, Text, Image } from "react-native";
import { ColorConstants } from "./common/ColorConstants";
import { StringHelper } from "../helpers/Index";
import { Footer } from "./Footer";

class Excerpt extends React.PureComponent {
  constructor(props) {
    super(props);

    // Bindings
    this.renderItem = this.renderItem.bind(this);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const items = [this.props.item];

    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item, index) => index.toString()}
          style={styles.excerpt_list}
        />
      </View>
    );
  }

  renderItem({ item }) {
    const [author, extract, title, uri] = this.getItemDetails(item);
    const itemStyle = this.getItemStyles(author, extract, title);

    return (
      <View>
        <View style={styles.container_desc}>
          <Text style={itemStyle.title}>{title}</Text>
          <Text style={itemStyle.author}>{author}</Text>
          <View style={itemStyle.redbar} />
          <Text style={itemStyle.body}>{extract}</Text>
        </View>
        <View style={itemStyle.image}>{this.renderImage(uri)}</View>
      </View>
    );
  }

  renderFooter = () => {
    const onShowNextExcerpt = this.props.onShowNextExcerpt;
    return <Footer onShowNextExcerpt={onShowNextExcerpt} />;
  };

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
      Helpers & Handlers
  ----------------------------------------------------*/
  getItemDetails(item) {
    const author = StringHelper.convertToCamelCase(item.fields.author);
    const extract = StringHelper.convertToSentenceCase(item.fields.extract);
    const title = StringHelper.convertToCamelCase(item.fields.title);
    const url = this.getImageURL(item);

    return [author, extract, title, url];
  }

  getImageURL(item) {
    return item.fields.image !== undefined
      ? item.fields.image[0].url !== undefined
        ? item.fields.image[0].url
        : ""
      : "";
  }

  getItemStyles(author, extract, title) {
    let itemStyle = {
      author: "",
      title: "",
      body: "",
      redbar: "",
      image: ""
    };

    itemStyle.body =
      extract === "-" || extract === ""
        ? styles.excerpt_body_empty
        : this.getDynamicSizeForText(extract);

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

    const doesDescriptionExist = author !== "-" || title !== "-";

    itemStyle.redbar = doesDescriptionExist
      ? styles.redbar
      : styles.redbar_empty;

    itemStyle.image = doesDescriptionExist
      ? styles.container_excerpt_image
      : styles.container_excerpt_image_only;

    return itemStyle;
  }

  getDynamicSizeForText(text) {
    let textStyle = styles.excerpt_body_large;

    const textLength = text.length;
    if (textLength > 70) {
      textStyle = styles.excerpt_body_small;
    } else if (textLength > 60) {
      textStyle = styles.excerpt_body_medium;
    }

    return textStyle;
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
  container_desc: {
    paddingLeft: 42,
    paddingRight: 48
  },
  redbar: {
    backgroundColor: ColorConstants.baseColors.red,
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
  excerpt_list: {
    flex: 1,
    paddingTop: 100,
    marginHorizontal: 0
  },
  excerpt_title: {
    color: ColorConstants.baseColors.white,
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
    color: ColorConstants.baseColors.white,
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
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 13,
    opacity: 0.65,
    marginTop: 5,
    marginBottom: 2,
    letterSpacing: 0.5
  },
  excerpt_type: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15
  },
  excerpt_body_small: {
    color: ColorConstants.baseColors.white,
    marginBottom: 0,
    fontFamily: "overpass-light",
    fontSize: 15,
    lineHeight: 27,
    letterSpacing: 0.2,
    opacity: 1
  },
  excerpt_body_medium: {
    color: ColorConstants.baseColors.white,
    marginBottom: 0,
    fontFamily: "overpass-light",
    fontSize: 15,
    lineHeight: 27,
    letterSpacing: 0.2,
    opacity: 1
  },
  excerpt_body_large: {
    color: ColorConstants.baseColors.white,
    marginBottom: 0,
    fontFamily: "overpass-thin",
    fontSize: 28,
    lineHeight: 42,
    letterSpacing: 0.2,
    opacity: 1
  },
  excerpt_body_empty: {
    height: 0,
    width: 0,
    opacity: 0
  },
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

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { Excerpt };
