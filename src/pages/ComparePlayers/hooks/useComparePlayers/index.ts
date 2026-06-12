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

  const availableSeasons = useMemo(() => {
    if (!augmentedCareer?.clubData) return [];

    let filteredSeasons = augmentedCareer.clubData;

    if (isGeralPlayerCompare && playerId) {
      filteredSeasons = filteredSeasons.filter((season) =>
        season.players.some((p) => String(p.id) === String(playerId)),
      );
    }

    return filteredSeasons.map((s) => ({
      id: String(s.id),
      label: `Temporada ${s.seasonNumber}`,
    }));
  }, [augmentedCareer, isGeralPlayerCompare, playerId]);

  const seasonOptions = useMemo(
    () => availableSeasons.map((s) => s.label),
    [availableSeasons],
  );

  const selectedSeasonLabel = useMemo(() => {
    const found = availableSeasons.find(
      (s) => s.id === String(selectedSeasonId),
    );
    return found ? found.label : "";
  }, [availableSeasons, selectedSeasonId]);

  const handleSeasonChange = (e: {
    target: { name: string; value: string };
  }) => {
    const found = availableSeasons.find((s) => s.label === e.target.value);
    if (found) {
      setSelectedSeasonId(found.id);
    }
  };

  const availablePlayers = useMemo(
    () => getAvailablePlayers(augmentedCareer, selectedSeasonId, compareMode),
    [augmentedCareer, selectedSeasonId, compareMode],
  );

  useEffect(() => {
    if (playerId && augmentedCareer?.clubData) {
      for (const season of augmentedCareer.clubData) {
        const found = season.players.find(
          (p) => String(p.id) === String(playerId),
        );
        if (found) {
          setPlayer1Name(found.name);
          break;
        }
      }
    }
  }, [playerId, augmentedCareer]);

  useEffect(() => {
    if (availablePlayers.length === 0) {
      setPlayer1(null);
      setPlayer2(null);
      return;
    }

    if (player1Name) {
      const matchingP1 = availablePlayers.find(
        (p) => p.name.trim().toLowerCase() === player1Name.trim().toLowerCase(),
      );
      setPlayer1(matchingP1 || null);
    } else {
      setPlayer1(null);
    }

    if (player2Name) {
      const matchingP2 = availablePlayers.find(
        (p) => p.name.trim().toLowerCase() === player2Name.trim().toLowerCase(),
      );
      setPlayer2(matchingP2 || null);
    } else {
      setPlayer2(null);
    }
  }, [availablePlayers, player1Name, player2Name]);

  const getPlayerLabel = (p: Players) => `${p.name} - ${p.position}`;

  const filteredOptions = useMemo(() => {
    let options = availablePlayers;

    if (activeSlot === 1 && player2) {
      options = options.filter((p) => String(p.id) !== String(player2.id));
    } else if (activeSlot === 2 && player1) {
      options = options.filter((p) => String(p.id) !== String(player1.id));
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
  const p1Stats = useMemo(
    () =>
      getAggregatedStats(
        player1,
        augmentedCareer,
        selectedSeasonId,
        compareMode,
      ),
    [player1, augmentedCareer, selectedSeasonId, compareMode],
  );
  const p2Stats = useMemo(
    () =>
      getAggregatedStats(
        player2,
        augmentedCareer,
        selectedSeasonId,
        compareMode,
      ),
    [player2, augmentedCareer, selectedSeasonId, compareMode],
  );

  return {
    state: {
      isLoading,
      playerId,
      player1,
      player2,
      activeSlot,
      searchValue,
      filteredOptions,
      compareMode,
      p1Stats,
      p2Stats,
      seasonOptions,
      selectedSeasonLabel,
      isGeralMode,
      selectedSeasonId,
    },
    actions: {
      setCompareMode,
      openSelection,
      handleSearchChange,
      handleSeasonChange,
    },
  };
};
