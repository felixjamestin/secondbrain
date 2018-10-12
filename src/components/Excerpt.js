import React from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { StringHelper } from "../helpers/Index";
import { BodyContent, BodyMetaDesc, BodyImage, Footer } from "./Index";

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
    const [author, body, title, uri] = this.getItemDetails(item);
    const doesDescriptionExist = author !== "-" || title !== "-";

    return (
      <View>
        <View style={styles.container_desc}>
          <BodyMetaDesc
            title={title}
            author={author}
            doesDescriptionExist={doesDescriptionExist}
          />
          <BodyContent
            content={body}
            doesDescriptionExist={doesDescriptionExist}
          />
        </View>

        <BodyImage uri={uri} doesDescriptionExist={doesDescriptionExist} />
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
  getItemDetails(item) {
    const author = StringHelper.convertToCamelCase(item.fields.author);
    const body = StringHelper.convertToSentenceCase(item.fields.extract);
    const title = StringHelper.convertToCamelCase(item.fields.title);
    const url = this.getImageURL(item);

    return [author, body, title, url];
  }

  getImageURL(item) {
    return item.fields.image !== undefined
      ? item.fields.image[0].url !== undefined
        ? item.fields.image[0].url
        : ""
      : "";
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
    paddingRight: 48,
    paddingTop: 80
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { Excerpt };
