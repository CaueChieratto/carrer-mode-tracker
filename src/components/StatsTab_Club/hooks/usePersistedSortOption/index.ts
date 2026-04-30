import { useEffect, useState } from "react";

const STORAGE_KEY = "playerSortOption";
const STORAGE_KEY_REVERSED = "playerSortReversed";
const DEFAULT_OPTION = "Ordenar por padrão";

export const usePersistedSortOption = () => {
  const [sortOption, setSortOption] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || DEFAULT_OPTION;
  });

  const [isReversed, setIsReversed] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REVERSED);
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sortOption);
  }, [sortOption]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REVERSED, String(isReversed));
  }, [isReversed]);

  const handleSetSortOption = (newOption: string) => {
    if (newOption === sortOption) {
      setIsReversed((prev) => !prev);
    } else {
      setSortOption(newOption);
      setIsReversed(false);
    }
  };

  return {
    sortOption,
    setSortOption: handleSetSortOption,
    isReversed,
  };
};
