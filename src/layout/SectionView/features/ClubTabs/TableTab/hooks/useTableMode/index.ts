import { useEffect, useState } from "react";

const DEFAULT_MODE = "Resumido";

export const useTableMode = (storageKey: string) => {
  const [activeMode, setActiveMode] = useState(() => {
    return localStorage.getItem(storageKey) ?? DEFAULT_MODE;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, activeMode);
  }, [activeMode, storageKey]);

  return {
    activeMode,
    setActiveMode,
  };
};
