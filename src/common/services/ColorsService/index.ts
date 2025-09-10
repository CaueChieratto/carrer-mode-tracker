export const ColorsService = {
  saveColors: (careerId: string, color: string) => {
    const localStorageKey = `colorSaved_${careerId}`;
    localStorage.setItem(localStorageKey, color);
  },

  getColorSaved: (careerId: string) => {
    let foundColor = null;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("colorSaved_") && key.endsWith(careerId)) {
        foundColor = localStorage.getItem(key);
      }
    });
    return foundColor;
  },
};
