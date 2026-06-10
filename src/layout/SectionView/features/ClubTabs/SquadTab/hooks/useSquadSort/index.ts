import { useEffect, useState } from "react";

const DEFAULT_SORT = "Ordenar por padrão";

export const useSquadSort = (seasonId: string) => {
  const STORAGE_KEY = `squadSortOption_${seasonId}`;
  const STORAGE_KEY_ASC = `squadSortAsc_${seasonId}`;

  const [sortOption, setSortOption] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "Padrão") return DEFAULT_SORT;
    return saved || DEFAULT_SORT;
  });

  const [isAsc, setIsAsc] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ASC);
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sortOption);
    localStorage.setItem(STORAGE_KEY_ASC, String(isAsc));
  }, [sortOption, isAsc, STORAGE_KEY, STORAGE_KEY_ASC]);

  const handleSortChange = (value: string) => {
    const normalizedValue = value === "Padrão" ? DEFAULT_SORT : value;

    if (normalizedValue === sortOption) {
      setIsAsc((prev) => !prev);
    } else {
      setSortOption(normalizedValue);
      setIsAsc(false);
    }
  };

  return {
    sortOption,
    isAsc,
    handleSortChange,
  };
};
