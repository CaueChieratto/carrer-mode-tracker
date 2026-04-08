import { useState, useMemo, useEffect, useRef } from "react";
import { Players } from "../../../../../../../common/interfaces/playersInfo/players";
import { POSITION_ORDER } from "../constants/POSITION_ORDER";

export const usePlayerSearch = (
  players: Players[],
  assignedIds: Set<string>,
) => {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
    return () => clearTimeout(timeoutId);
  }, []);

  const availablePlayers = useMemo(() => {
    return players
      .filter(
        (p) =>
          !p.sell &&
          !assignedIds.has(p.id) &&
          p.shirtNumber != null &&
          p.shirtNumber !== "" &&
          p.name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        const posA = POSITION_ORDER[a.position as string] || 99;
        const posB = POSITION_ORDER[b.position as string] || 99;

        if (posA !== posB) return posA - posB;
        return b.overall - a.overall;
      });
  }, [players, assignedIds, search]);

  return { search, setSearch, searchRef, availablePlayers };
};
