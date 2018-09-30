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
    const sentenceCaseString = this.sanitizeString(string)
      .toLowerCase()
      .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function(c) {
        return c.toUpperCase();
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
}

export { StringHelper };
