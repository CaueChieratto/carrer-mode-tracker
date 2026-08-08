import { useState, useCallback } from "react";

export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
  }, []);

  return { isOpen, open, close };
};
