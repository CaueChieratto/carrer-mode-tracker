import { useMemo, useState, useEffect } from "react";
import { POSITION_DATA } from "../../../../../../../../../common/types/Positions";

export const usePositionSelection = (
  initialSector?: string,
  initialPosition?: string,
) => {
  const sectorsList = useMemo(() => {
    return POSITION_DATA.filter((sector) => sector.key !== "loaned").map(
      (sector) => sector.name,
    );
  }, []);

  const [sector, setSector] = useState<string>(
    initialSector || POSITION_DATA[0]?.name || "",
  );

  const availablePositions = useMemo(() => {
    const selectedSector = POSITION_DATA.find((item) => item.name === sector);
    if (!selectedSector) {
      return [];
    }
    return selectedSector.sortOrder ?? selectedSector.positions;
  }, [sector]);

  const [position, setPosition] = useState<string>(initialPosition || "");

  useEffect(() => {
    if (availablePositions.length > 0) {
      setPosition((prevPosition) => {
        if (!prevPosition || !availablePositions.includes(prevPosition)) {
          return availablePositions[0];
        }
        return prevPosition;
      });
    } else {
      setPosition("");
    }
  }, [availablePositions]);

  return {
    sectorsList,
    sector,
    setSector,
    availablePositions,
    position,
    setPosition,
  };
};
