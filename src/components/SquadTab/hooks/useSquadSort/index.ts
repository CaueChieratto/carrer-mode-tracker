import { useEffect, useState } from "react";

const STORAGE_KEY = "squadSortOption";
const STORAGE_KEY_ASC = "squadSortAsc";
const DEFAULT_SORT = "Padrão";

export const useSquadSort = () => {
  const [sortOption, setSortOption] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_SORT;
  });

  const [isAsc, setIsAsc] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ASC);
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sortOption);
    localStorage.setItem(STORAGE_KEY_ASC, String(isAsc));
  }, [sortOption, isAsc]);

  const handleSortChange = (value: string) => {
    if (value === sortOption) {
      setIsAsc((prev) => !prev);
    } else {
      setSortOption(value);
      setIsAsc(false);
    }
  };

  return {
    sortOption,
    isAsc,
    handleSortChange,
  };
};
