import { useState, ReactNode } from "react";
import { ActiveStatCardContext } from "../useActiveStatCard";

export const ActiveStatCardProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const toggleActiveCard = (id: string) => {
    setActiveCardId((prev) => (prev === id ? null : id));
  };

  return (
    <ActiveStatCardContext.Provider value={{ activeCardId, toggleActiveCard }}>
      {children}
    </ActiveStatCardContext.Provider>
  );
};
