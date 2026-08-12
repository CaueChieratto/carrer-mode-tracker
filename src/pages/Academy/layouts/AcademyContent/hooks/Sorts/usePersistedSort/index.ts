import { useState, useEffect } from "react";

export const usePersistedSort = <T extends string>(
  storageKey: string,
  defaultOption: T,
) => {
  const [sortOption, setSortOption] = useState<T>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved).option || defaultOption;
      } catch {
        return defaultOption;
      }
    }
    return defaultOption;
  });

  const [isReversed, setIsReversed] = useState<boolean>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved).isReversed || false;
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ option: sortOption, isReversed }),
    );
  }, [sortOption, isReversed, storageKey]);

  const handleSortChange = (newOption: T) => {
    if (newOption === sortOption) {
      setIsReversed((prev) => !prev);
    } else {
      setSortOption(newOption);
      setIsReversed(false);
    }
  };

  return { sortOption, isReversed, handleSortChange };
};
