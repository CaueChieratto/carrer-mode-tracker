import { useState, useMemo, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getAvailablePlayers } from "../../helpers/getAvailablePlayers";
import { getAggregatedStats } from "../../helpers/getAggregatedStats";
import { AugmentedCareer } from "../../types";
import { useCareers } from "../../../../common/hooks/Career/UseCareer";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { augmentCareerWithMatchStats } from "../../../../layout/SectionView/helpers/mergeMatchStats";
import { POSITION_DATA } from "../../../../common/types/Positions";

const positionRankMap = new Map<string, number>();
let rankCount = 0;
POSITION_DATA.forEach((group) => {
  const order = group.sortOrder || group.positions;
  order.forEach((pos) => {
    positionRankMap.set(pos, rankCount++);
  });
});

export const useComparePlayers = () => {
  const { careerId, seasonId, playerId } = useParams();
  const location = useLocation();

  const isGeralMode = location.pathname.includes("/Geral");
  const isGeralPlayerCompare = isGeralMode && !!playerId;
  const { careers } = useCareers();

  const [isLoading, setIsLoading] = useState(true);

  const career = useMemo(
    () => careers.find((c) => c.id === careerId),
    [careers, careerId],
  );

  const augmentedCareer = useMemo(
    () =>
      (career
        ? augmentCareerWithMatchStats(career)
        : null) as AugmentedCareer | null,
    [career],
  );

  const latestSeasonPlayerIds = useMemo(() => {
    if (!augmentedCareer?.clubData || augmentedCareer.clubData.length === 0) {
      return new Set<string>();
    }

    const latestSeason = augmentedCareer.clubData.reduce(
      (max, s) => (s.seasonNumber > max.seasonNumber ? s : max),
      augmentedCareer.clubData[0],
    );

    const ids = new Set<string>();
    latestSeason.players.forEach((p) => {
      if (p.sell === false) {
        ids.add(String(p.id));
      }
    });
    return ids;
  }, [augmentedCareer]);

  useEffect(() => {
    if (careers.length > 0) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      const fallback = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(fallback);
    }
  }, [careers]);

  const [player1, setPlayer1] = useState<Players | null>(null);
  const [player2, setPlayer2] = useState<Players | null>(null);

  const [player1Name, setPlayer1Name] = useState<string>("");
  const [player2Name, setPlayer2Name] = useState<string>("");

  const [activeSlot, setActiveSlot] = useState<1 | 2 | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const [compareMode, setCompareMode] = useState<"season" | "total" | "none">(
    isGeralPlayerCompare ? "none" : isGeralMode ? "total" : "season",
  );

  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(
    seasonId,
  );
  const [selectedSeasonId2, setSelectedSeasonId2] = useState<
    string | undefined
  >();

  const availableSeasonsP1 = useMemo(() => {
    if (!augmentedCareer?.clubData || !playerId) return [];
    return augmentedCareer.clubData
      .filter((season) =>
        season.players.some((p) => String(p.id) === String(playerId)),
      )
      .map((s) => ({
        id: String(s.id),
        label: `Temporada ${s.seasonNumber}`,
      }));
  }, [augmentedCareer, playerId]);

  useEffect(() => {
    if (!selectedSeasonId && availableSeasonsP1.length > 0) {
      setSelectedSeasonId(availableSeasonsP1[0].id);
    }
  }, [availableSeasonsP1, selectedSeasonId]);

  const availablePlayers = useMemo(() => {
    if (isGeralPlayerCompare) {
      return getAvailablePlayers(augmentedCareer, undefined, "total");
    }
    return getAvailablePlayers(augmentedCareer, selectedSeasonId, compareMode);
  }, [augmentedCareer, selectedSeasonId, compareMode, isGeralPlayerCompare]);

  useEffect(() => {
    if (playerId && augmentedCareer?.clubData) {
      for (const season of augmentedCareer.clubData) {
        const found = season.players.find(
          (p) => String(p.id) === String(playerId),
        );
        if (found) {
          setPlayer1Name(found.name);
          setPlayer1(found);
          break;
        }
      }
    }
  }, [playerId, augmentedCareer]);

  useEffect(() => {
    if (availablePlayers.length === 0) {
      if (!isGeralPlayerCompare) setPlayer1(null);
      setPlayer2(null);
      return;
    }

    if (player1Name) {
      const matchingP1 = availablePlayers.find(
        (p) => p.name.trim().toLowerCase() === player1Name.trim().toLowerCase(),
      );
      if (matchingP1) setPlayer1(matchingP1);
    }

    if (player2Name) {
      const matchingP2 = availablePlayers.find(
        (p) => p.name.trim().toLowerCase() === player2Name.trim().toLowerCase(),
      );
      setPlayer2(matchingP2 || null);
    } else {
      setPlayer2(null);
    }
  }, [availablePlayers, player1Name, player2Name, isGeralPlayerCompare]);

  const isSamePlayerSelected = useMemo(() => {
    if (!player1 || !player2) return false;
    return (
      player1.name.trim().toLowerCase() === player2.name.trim().toLowerCase()
    );
  }, [player1, player2]);

  useEffect(() => {
    if (compareMode === "total" && isSamePlayerSelected) {
      setPlayer2(null);
      setPlayer2Name("");
    }
  }, [compareMode, isSamePlayerSelected]);

  const availableSeasonsP2 = useMemo(() => {
    if (!augmentedCareer?.clubData || !player2) return [];

    const normalizedName = player2.name.trim().toLowerCase();
    const normalizedNation = player2.nation.trim().toLowerCase();

    let filtered = augmentedCareer.clubData.filter((season) =>
      season.players.some(
        (p) =>
          p.name.trim().toLowerCase() === normalizedName &&
          p.nation.trim().toLowerCase() === normalizedNation,
      ),
    );

    if (isSamePlayerSelected) {
      filtered = filtered.filter(
        (s) => String(s.id) !== String(selectedSeasonId),
      );
    }

    return filtered.map((s) => ({
      id: String(s.id),
      label: `Temporada ${s.seasonNumber}`,
    }));
  }, [augmentedCareer, player2, isSamePlayerSelected, selectedSeasonId]);

  useEffect(() => {
    if (availableSeasonsP2.length > 0) {
      const exists = availableSeasonsP2.some(
        (s) => s.id === String(selectedSeasonId2),
      );
      if (!exists) {
        setSelectedSeasonId2(availableSeasonsP2[0].id);
      }
    } else {
      setSelectedSeasonId2(undefined);
    }
  }, [availableSeasonsP2, selectedSeasonId2]);

  const getPlayerLabel = (p: Players) => `${p.name} - ${p.position}`;

  const filteredOptions = useMemo(() => {
    let options = availablePlayers;

    if (!isGeralPlayerCompare || compareMode === "total") {
      if (activeSlot === 1 && player2) {
        options = options.filter((p) =>
          compareMode === "total"
            ? p.name.trim().toLowerCase() !== player2.name.trim().toLowerCase()
            : String(p.id) !== String(player2.id),
        );
      } else if (activeSlot === 2 && player1) {
        options = options.filter((p) =>
          compareMode === "total"
            ? p.name.trim().toLowerCase() !== player1.name.trim().toLowerCase()
            : String(p.id) !== String(player1.id),
        );
      }
    }

    if (searchValue) {
      const lower = searchValue.toLowerCase();
      options = options.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.position.toLowerCase().includes(lower),
      );
    }

    return options
      .sort((a, b) => {
        const rankA = positionRankMap.get(a.position) ?? 999;
        const rankB = positionRankMap.get(b.position) ?? 999;

        if (rankA !== rankB) {
          return rankA - rankB;
        }

        const isLatestA = latestSeasonPlayerIds.has(String(a.id)) ? 1 : 0;
        const isLatestB = latestSeasonPlayerIds.has(String(b.id)) ? 1 : 0;

        if (isLatestA !== isLatestB) {
          return isLatestB - isLatestA;
        }

        return a.name.localeCompare(b.name);
      })
      .map(getPlayerLabel);
  }, [
    availablePlayers,
    searchValue,
    latestSeasonPlayerIds,
    activeSlot,
    player1,
    player2,
    isGeralPlayerCompare,
    compareMode,
  ]);

  const openSelection = (slot: 1 | 2) => {
    setActiveSlot(activeSlot === slot ? null : slot);
    setSearchValue("");
  };

  const handleSearchChange = (e: {
    target: { name: string; value: string };
  }) => {
    const val = e.target.value;
    setSearchValue(val);

    const exactMatch = availablePlayers.find((p) => getPlayerLabel(p) === val);
    if (exactMatch) {
      if (activeSlot === 1) {
        setPlayer1(exactMatch);
        setPlayer1Name(exactMatch.name);
      } else if (activeSlot === 2) {
        setPlayer2(exactMatch);
        setPlayer2Name(exactMatch.name);
      }

      setActiveSlot(null);
      setSearchValue("");
    }
  };

  const handleSeasonChange = (e: {
    target: { name: string; value: string };
  }) => {
    const found = availableSeasonsP1.find((s) => s.label === e.target.value);
    if (found) {
      setSelectedSeasonId(found.id);
    }
  };

  const handleSeasonChange2 = (e: {
    target: { name: string; value: string };
  }) => {
    const found = availableSeasonsP2.find((s) => s.label === e.target.value);
    if (found) {
      setSelectedSeasonId2(found.id);
    }
  };

  const player1Effective = useMemo(() => {
    if (!player1 || !augmentedCareer) return null;

    if (compareMode === "total") return player1;

    const season = augmentedCareer.clubData.find(
      (s) => String(s.id) === String(selectedSeasonId),
    );
    if (!season) return player1;
    return (
      season.players.find(
        (p) =>
          p.name.trim().toLowerCase() === player1.name.trim().toLowerCase(),
      ) || player1
    );
  }, [player1, augmentedCareer, selectedSeasonId, compareMode]);

  const player2Effective = useMemo(() => {
    if (!player2 || !augmentedCareer) return null;
    if (compareMode === "total") return player2;

    const targetSeasonId =
      isGeralPlayerCompare && compareMode === "season"
        ? selectedSeasonId2
        : selectedSeasonId;
    const season = augmentedCareer.clubData.find(
      (s) => String(s.id) === String(targetSeasonId),
    );
    if (!season) return player2;
    return (
      season.players.find(
        (p) =>
          p.name.trim().toLowerCase() === player2.name.trim().toLowerCase(),
      ) || player2
    );
  }, [
    player2,
    augmentedCareer,
    selectedSeasonId2,
    selectedSeasonId,
    isGeralPlayerCompare,
    compareMode,
  ]);

  const p1Stats = useMemo(
    () =>
      getAggregatedStats(
        player1Effective,
        augmentedCareer,
        selectedSeasonId,
        compareMode,
      ),
    [player1Effective, augmentedCareer, selectedSeasonId, compareMode],
  );

  const p2Stats = useMemo(() => {
    const targetSeasonId =
      isGeralPlayerCompare && compareMode === "season"
        ? selectedSeasonId2
        : selectedSeasonId;
    return getAggregatedStats(
      player2Effective,
      augmentedCareer,
      targetSeasonId,
      compareMode,
    );
  }, [
    player2Effective,
    augmentedCareer,
    selectedSeasonId2,
    selectedSeasonId,
    isGeralPlayerCompare,
    compareMode,
  ]);

  return {
    state: {
      isLoading,
      playerId,
      player1: player1Effective,
      player2: player2Effective,
      activeSlot,
      searchValue,
      filteredOptions,
      compareMode,
      p1Stats,
      p2Stats,
      seasonOptions: availableSeasonsP1.map((s) => s.label),
      selectedSeasonLabel:
        availableSeasonsP1.find((s) => s.id === String(selectedSeasonId))
          ?.label || "",
      isGeralMode,
      selectedSeasonId,
      isSamePlayerSelected,
      seasonOptions2: availableSeasonsP2.map((s) => s.label),
      selectedSeasonLabel2:
        availableSeasonsP2.find((s) => s.id === String(selectedSeasonId2))
          ?.label || "",
    },
    actions: {
      setCompareMode,
      openSelection,
      handleSearchChange,
      handleSeasonChange,
      handleSeasonChange2,
    },
  };
};
