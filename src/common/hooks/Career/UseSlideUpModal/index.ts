import { useState, useMemo } from "react";
import { Career } from "../../../interfaces/Career";
import { sortTrophies } from "../../../utils/Sorts";

export const useSlideUpModal = (selectedCareer: Career) => {
  const [view, setView] = useState<"titles" | "add">("titles");

  const sortedTrophies = useMemo(
    () => sortTrophies(selectedCareer.trophies),
    [selectedCareer.trophies]
  );

  return { view, setView, sortedTrophies };
};
