import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Match } from "../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { useLineup } from "./hooks/useLineup";
import { useSaveLineup } from "./hooks/useSaveLineup";
import { Header } from "./layouts/Header";
import { Section } from "./layouts/Section";
import { PlayerPicker } from "./components/PlayerPicker";
import { Bottom } from "./layouts/Bottom";
import Styles from "./LineupTab.module.css";
import { SavedLineup } from "../../types/Lineup";

type LineupTabProps = {
  season: ClubData;
  career: Career;
  match: Match;
  isFromGeral?: boolean;
  onRegisterSave?: (fn: () => Promise<void> | void) => void;
};

const parseDate = (dateStr: string): number => {
  if (!dateStr) return 0;
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(2000 + year, month - 1, day).getTime();
};

const isLineupEmpty = (lineup?: SavedLineup) => {
  if (!lineup) return true;
  if (lineup.goalkeeper?.playerId) return false;
  if (lineup.lines?.some((slot) => slot && slot.playerId)) return false;
  if (lineup.bench?.some((slot) => slot && slot.playerId)) return false;
  return true;
};

export const LineupTab = ({
  season,
  career,
  match,
  isFromGeral,
  onRegisterSave,
}: LineupTabProps) => {
  const { careerId, seasonId } = useParams<{
    careerId: string;
    seasonId: string;
  }>();

  const navigate = useNavigate();

  const savedLineupRef = useRef<SavedLineup | null>(match.lineup || null);

  useEffect(() => {
    if (match.lineup) {
      savedLineupRef.current = match.lineup;
    }
  }, [match.lineup]);

  const effectiveLineup = useMemo(() => {
    if (!isLineupEmpty(match.lineup)) return match.lineup;

    const matches = season.matches || [];

    const sortedMatches = [...matches].sort(
      (a, b) => parseDate(a.date) - parseDate(b.date),
    );

    const currentIndex = sortedMatches.findIndex(
      (m) => m.matchesId === match.matchesId,
    );

    if (currentIndex > 0) {
      for (let i = currentIndex - 1; i >= 0; i--) {
        const prevMatch = sortedMatches[i];
        if (
          prevMatch.league === match.league &&
          !isLineupEmpty(prevMatch.lineup)
        ) {
          return prevMatch.lineup;
        }
      }

      for (let i = currentIndex - 1; i >= 0; i--) {
        const prevMatch = sortedMatches[i];
        if (!isLineupEmpty(prevMatch.lineup)) {
          return prevMatch.lineup;
        }
      }
    }

    return match.lineup;
  }, [match.lineup, match.matchesId, match.league, season.matches]);

  const {
    selectedFormation,
    lineup,
    selectingSlotId,
    assignedPlayerIds,
    activePlayers,
    handleFormationChange,
    openPlayerPicker,
    assignPlayer,
    removePlayer,
    buildSavedLineup,
    swapPlayers,
  } = useLineup(season, effectiveLineup);

  const saveLineup = useSaveLineup({
    careerId,
    seasonId,
    matchId: match.matchesId,
  });

  useEffect(() => {
    onRegisterSave?.(async () => {
      const currentSavedLineup = buildSavedLineup();
      const activePlayerIds = new Set<string>();

      if (currentSavedLineup.goalkeeper.playerId) {
        activePlayerIds.add(currentSavedLineup.goalkeeper.playerId);
      }
      currentSavedLineup.lines.forEach((slot) => {
        if (slot && slot.playerId) activePlayerIds.add(slot.playerId);
      });
      currentSavedLineup.bench?.forEach((slot) => {
        if (slot && slot.playerId) activePlayerIds.add(slot.playerId);
      });

      const updatedPlayerStats = (match.playerStats || []).filter((stat) =>
        activePlayerIds.has(stat.playerId),
      );

      const removedPlayerIds = (match.playerStats || [])
        .filter((stat) => !activePlayerIds.has(stat.playerId))
        .map((stat) => stat.playerId);

      await saveLineup(
        currentSavedLineup,
        updatedPlayerStats,
        removedPlayerIds,
      );

      savedLineupRef.current = currentSavedLineup;
    });
  }, [onRegisterSave, saveLineup, buildSavedLineup, match.playerStats]);

  const playerClick = (playerId: string) => {
    const lineupToCheck = savedLineupRef.current || match.lineup;

    const isPlayerSaved = [
      lineupToCheck?.goalkeeper?.playerId,
      ...(lineupToCheck?.lines?.map((s) => s.playerId) || []),
      ...(lineupToCheck?.bench?.map((s) => s.playerId) || []),
    ].includes(playerId);

    if (!isPlayerSaved) {
      alert("Salve a escalação antes de editar as estatísticas deste jogador.");
      return;
    }

    navigate(
      `/Career/${careerId}/Season/${seasonId}/Match/${match.matchesId}/${playerId}`,
    );
  };

  const mvpId = useMemo(() => {
    if (!match.playerStats || match.playerStats.length === 0) return null;
    let highestRating = 0;
    let id: string | null = null;

    match.playerStats.forEach((stat) => {
      if (stat.rating > highestRating) {
        highestRating = stat.rating;
        id = stat.playerId;
      }
    });

    return highestRating > 0 ? id : null;
  }, [match.playerStats]);

  const playerStats = match.playerStats || [];

  return (
    <div
      className={Styles.wrapper}
      style={isFromGeral ? { gap: "0" } : undefined}
    >
      <div>
        <Header
          isFromGeral={isFromGeral}
          career={career}
          selectedFormation={selectedFormation}
          handleFormationChange={handleFormationChange}
        />

        <Section
          isFromGeral={isFromGeral}
          lineup={lineup}
          selectingSlotId={selectingSlotId}
          openPlayerPicker={openPlayerPicker}
          removePlayer={removePlayer}
          swapPlayers={swapPlayers}
          onPlayerClick={playerClick}
          playerStats={playerStats}
          mvpId={mvpId}
        />

        {selectingSlotId && !isFromGeral && (
          <PlayerPicker
            players={activePlayers}
            assignedIds={assignedPlayerIds}
            onSelect={assignPlayer}
          />
        )}
      </div>

      <Bottom
        isFromGeral={isFromGeral}
        lineup={lineup}
        selectingSlotId={selectingSlotId}
        openPlayerPicker={openPlayerPicker}
        removePlayer={removePlayer}
        onPlayerClick={playerClick}
        playerStats={playerStats}
        mvpId={mvpId}
        allPlayers={season.players}
      />
    </div>
  );
};
