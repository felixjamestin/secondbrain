class StringHelper {
  static getRandomStringFromArray(strings = []) {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
  }

  static getNextStringInArray(strings = [], currentIndex) {
    const nextIndex = (currentIndex + 1) % strings.length;
    return {
      placeholderText: strings[nextIndex],
      placeholderIndex: nextIndex
    };
  }

  static convertToLower(string) {
    return this.sanitizeString(string.toLowerCase());
  }

  static convertToUpper(string) {
    return this.sanitizeString(string.toUpperCase());
  }

  static convertToSentenceCase(string) {
    const sanitizedString = this.sanitizeString(string);
    let markDownRegex = /([#*]{1,5}\s["“']*\w|[\.\!\?]\s*\w)/g;
    let plainTextRegex = /(^\s*\w|[\.\!\?]\s*\w)/g;

    const sentenceCaseString = this.isTextInMarkdown(sanitizedString)
      ? sanitizedString.toLowerCase().replace(markDownRegex, function(c) {
          return c.toUpperCase(); // Detect for markdown
        })
      : sanitizedString.toLowerCase().replace(plainTextRegex, function(c) {
          return c.toUpperCase(); // Detect for plain text
        });

    return sentenceCaseString;
  }

  static convertToCamelCase(string) {
    const camelCaseString = this.sanitizeString(string)
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return camelCaseString;
  }

  static sanitizeString(string) {
    return string ? string : "";
  }

  static addNewLines(text) {
    return text
      .split("\n")
      .map(element => {
        return element + "\n";
      })
      .join("");
  }

  static isTextInMarkdown(text) {
    const firstSentence = text.split("\n")[0];
    const firstChar = firstSentence.trim().charAt(0);

    let isTextInMarkdown = false;
    const regex = /[#,*]/;
    if (regex.test(firstChar)) {
      isTextInMarkdown = true;
    }

    return isTextInMarkdown;
  }
}

export { StringHelper };
