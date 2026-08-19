import { useState, useRef } from "react";
import { EditableTeam } from "../../types";

export const useTeamSearch = (teams: EditableTeam[]) => {
  const [searchValue, setSearchValue] = useState("");
  const rowRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleSearchChange = (e: {
    target: { name: string; value: string };
  }) => {
    const val = e.target.value;
    setSearchValue(val);
    const matchedTeam = teams.find((t) => t.name === val);

    if (matchedTeam) {
      const targetElement = rowRefs.current[matchedTeam.originalName];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        targetElement.style.boxShadow = "0 0 0 2px var(--colorSpan)";
        targetElement.style.borderColor = "var(--colorSpan)";

        setTimeout(() => {
          if (targetElement) {
            targetElement.style.boxShadow = "";
            targetElement.style.borderColor = "";
          }
        }, 2000);
      }
    }
  };

  const searchOptions = teams
    .map((t) => t.name)
    .filter((name) => name.toLowerCase().includes(searchValue.toLowerCase()));

  return {
    searchValue,
    handleSearchChange,
    rowRefs,
    searchOptions,
  };
};
