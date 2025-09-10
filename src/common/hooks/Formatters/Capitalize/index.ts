export const capitalizeWords = (
  value: string,
  isShiftDown: boolean,
  previousValue: string
): string => {
  if (value.length < previousValue.length) {
    return value;
  }

  return value
    .split(" ")
    .map((word, index) => {
      if (word.length === 0) return "";
      const prevWords = previousValue.split(" ");
      const prevWord = prevWords[index] || "";
      if (word.length === 1 && isShiftDown) {
        return word.toLowerCase();
      }
      if (
        prevWord.length > 0 &&
        prevWord.charAt(0) === prevWord.charAt(0).toLowerCase()
      ) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};
