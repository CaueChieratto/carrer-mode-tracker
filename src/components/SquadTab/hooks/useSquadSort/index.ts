import { useEffect, useState } from "react";

const STORAGE_KEY = "squadSortOption";
const DEFAULT_SORT = "Padrão";

export const useSquadSort = () => {
  const [sortOption, setSortOption] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_SORT;
  });

  const [isAsc, setIsAsc] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sortOption);
  }, [sortOption]);

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
