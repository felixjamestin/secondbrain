import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import { MarkdownView } from "react-native-markdown-view";
import { ColorConstants } from "./common/ColorConstants";

class BodyContent extends PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const style = this.getItemStyles(this.props.content);

    return (
      <View>
        <Text style={style}>{this.props.content}</Text>

        {/* <MarkdownView>{this.props.content}</MarkdownView>

        <MarkdownView styles={markdownStyles}>
          {"# Why is markdown cool?\n" +
            "## Why is markdown cool?\n" +
            "* because it lets us do simple formatting **easily** \n" +
            "* _without_ the need for complex CMS data structures \n" +
            "* and you can outsource ~~your~~ work to the content creators! \n\n" +
            "* zxsasda ddand you can outsource ~~your~~ work to the content creators! \n\n" +
            "> This is a blockquote \n"}
        </MarkdownView> */}
      </View>
    );
  }

  /*--------------------------------------------------
      Helpers & Handlers
  ----------------------------------------------------*/
  getItemStyles(body) {
    const style =
      body === "-" || body === ""
        ? styles.excerpt_body_empty
        : this.getDynamicSizeForText(body);

    return style;
  }

  getDynamicSizeForText(text) {
    let textStyle = styles.excerpt_body_superlarge;

    const textLength = text.length;
    if (textLength > 100) {
      textStyle = styles.excerpt_body_small;
    } else if (textLength > 90) {
      textStyle = styles.excerpt_body_medium;
    } else if (textLength > 60) {
      textStyle = styles.excerpt_body_large;
    }

    return textStyle;
  }
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
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
    fontSize: 24,
    lineHeight: 42,
    letterSpacing: 0.2,
    opacity: 1
  },
  excerpt_body_superlarge: {
    color: ColorConstants.baseColors.white,
    marginVertical: 50,
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
  }
});

const markdownStyles = {
  blockQuote: {
    marginLeft: 10,
    opacity: 0.8
  },
  codeBlock: {
    fontFamily: "Courier",
    fontWeight: "500"
  },
  del: {
    textDecorationLine: "line-through"
  },
  em: {
    fontStyle: "italic"
  },
  heading: {
    fontWeight: "700"
  },
  heading1: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 24,
    marginTop: 22,
    marginBottom: 22,
    marginLeft: 0,
    marginRight: 0
  },
  heading2: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-semibold",
    letterSpacing: 0.5,
    fontSize: 15,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0
  },
  heading3: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0
  },
  heading4: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 16,
    marginTop: 22,
    marginBottom: 22,
    marginLeft: 0,
    marginRight: 0
  },
  heading5: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 14,
    marginTop: 22,
    marginBottom: 22,
    marginLeft: 0,
    marginRight: 0
  },
  heading6: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 11,
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 0,
    marginRight: 0
  },
  hr: {
    backgroundColor: "#ccc",
    height: 1
  },
  imageWrapper: {
    padding: 4,
    width: 320,
    height: 320
  },
  image: {
    flexGrow: 1
  },
  inlineCode: {
    backgroundColor: "rgba(128, 128, 128, 0.25)",
    fontFamily: "Courier",
    fontWeight: "500"
  },
  link: {
    color: "#0366d6"
  },
  list: {
    margin: 8
  },
  listItem: {
    flexDirection: "row"
  },
  listItemNumber: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    minWidth: 28,
    paddingRight: 4
  },
  listItemBullet: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    minWidth: 20
  },
  listItemOrderedContent: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15,
    letterSpacing: 0.5,
    flex: 1
  },
  listItemUnorderedContent: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15,
    letterSpacing: 0.5,
    flex: 1,
    marginBottom: 15,
    opacity: 1
  },
  paragraph: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 10
  },
  strong: {
    color: ColorConstants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontWeight: "700"
  },
  table: {
    margin: 4,
    borderColor: "#222"
  },
  tableHeaderCell: {
    borderColor: "#222"
  },
  tableHeaderCellContent: {
    fontWeight: "700"
  },
  tableCell: {
    padding: 5
  },
  tableCellOddRow: {
    backgroundColor: "rgba(128, 128, 128, 0.1)"
  },
  tableCellEvenRow: {},
  tableCellLastRow: {
    borderBottomWidth: 0
  },
  tableCellOddColumn: {},
  tableCellEvenColumn: {},
  tableCellLastColumn: {
    borderRightWidth: 0
  },
  tableCellContent: {},
  tableCellContentOddRow: {},
  tableCellContentEvenRow: {},
  tableCellContentLastRow: {},
  tableCellContentOddColumn: {},
  tableCellContentEvenColumn: {},
  tableCellContentLastColumn: {},
  u: {
    color: ColorConstants.baseColors.white,
    textDecorationLine: "underline"
  }
};

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { BodyContent };