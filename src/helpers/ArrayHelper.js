class ArrayHelper {
  static getRandomItemFromArray(items = []) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
}

export { ArrayHelper };
