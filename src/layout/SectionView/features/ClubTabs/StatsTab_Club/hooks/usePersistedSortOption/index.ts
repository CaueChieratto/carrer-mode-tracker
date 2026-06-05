import { useEffect, useState } from "react";

const DEFAULT_OPTION = "Ordenar por padrão";

export const usePersistedSortOption = (seasonId: string) => {
  const STORAGE_KEY = `playerSortOption_${seasonId}`;
  const STORAGE_KEY_REVERSED = `playerSortReversed_${seasonId}`;

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
  }, [sortOption, STORAGE_KEY]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REVERSED, String(isReversed));
  }, [isReversed, STORAGE_KEY_REVERSED]);

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
