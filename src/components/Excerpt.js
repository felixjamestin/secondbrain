import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
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
    const [author, extract, title] = this.getItemText(item);

    return (
      <View>
        <Text style={styles.excerpt_title}>{title}</Text>
        <Text style={this.getStyleForAuthor(title)}>{author}</Text>
        <View style={styles.redbar} />
        <Text style={styles.excerpt_body}>{extract}</Text>
      </View>
    );
  }

  renderFooter = () => {
    const onShowNextExcerpt = this.props.onShowNextExcerpt;
    return <Footer onShowNextExcerpt={onShowNextExcerpt} />;
  };

  /*--------------------------------------------------
      Helpers & Handlers
  ----------------------------------------------------*/
  getItemText = item => {
    const author = StringHelper.convertToCamelCase(item.fields.author);
    const extract = StringHelper.convertToSentenceCase(item.fields.extract);
    let title = StringHelper.convertToCamelCase(item.fields.title);

    title = title === "-" ? "" : title; // Don't show title if blank

    return [author, extract, title];
  };

  getStyleForAuthor(title) {
    return title === ""
      ? styles.excerpt_author
      : styles.excerpt_author_secondary;
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
  redbar: {
    backgroundColor: ColorConstants.baseColors.red,
    height: 2,
    width: 40,
    marginTop: 10,
    marginBottom: 50
  },
  excerpt_list: {
    flex: 1,
    paddingTop: 100,
    marginHorizontal: 0,
    paddingLeft: 42,
    paddingRight: 48
  },
  excerpt_title: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15,
    letterSpacing: 0.5
  },
  excerpt_author: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15,
    letterSpacing: 0.5
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
  excerpt_body: {
    color: ColorConstants.baseColors.white,
    marginBottom: 0,
    fontFamily: "overpass-light",
    fontSize: 15,
    lineHeight: 27,
    letterSpacing: 0.2,
    opacity: 1
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { Excerpt };
