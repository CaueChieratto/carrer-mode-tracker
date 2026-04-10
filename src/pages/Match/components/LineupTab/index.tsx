import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Match } from "../../../../components/AllMatchesTab/types/Match";
import { useLineup } from "./hooks/useLineup";
import { useSaveLineup } from "./hooks/useSaveLineup";
import { Header } from "./layouts/Header";
import { Section } from "./layouts/Section";
import { PlayerPicker } from "./components/PlayerPicker";
import { Bottom } from "./layouts/Bottom";
import Styles from "./LineupTab.module.css";

type LineupTabProps = {
  season: ClubData;
  career: Career;
  match: Match;
  onRegisterSave?: (fn: () => Promise<void> | void) => void;
};

export const LineupTab = ({
  season,
  career,
  match,
  onRegisterSave,
}: LineupTabProps) => {
  const { careerId, seasonId } = useParams<{
    careerId: string;
    seasonId: string;
  }>();

  const navigate = useNavigate();

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
  } = useLineup(season, match.lineup);

  const saveLineup = useSaveLineup({
    careerId,
    seasonId,
    matchId: match.matchesId,
  });

  useEffect(() => {
    onRegisterSave?.(() => saveLineup(buildSavedLineup()));
  }, [onRegisterSave, saveLineup, buildSavedLineup]);

  const playerClick = (playerId: string) => {
    const isPlayerSaved = [
      match.lineup?.goalkeeper?.playerId,
      ...(match.lineup?.lines?.map((s) => s.playerId) || []),
      ...(match.lineup?.bench?.map((s) => s.playerId) || []),
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
    <div className={Styles.wrapper}>
      <div>
        <Header
          career={career}
          selectedFormation={selectedFormation}
          handleFormationChange={handleFormationChange}
        />

        <Section
          lineup={lineup}
          selectingSlotId={selectingSlotId}
          openPlayerPicker={openPlayerPicker}
          removePlayer={removePlayer}
          swapPlayers={swapPlayers}
          onPlayerClick={playerClick}
          playerStats={playerStats}
          mvpId={mvpId}
        />

        {selectingSlotId && (
          <PlayerPicker
            players={activePlayers}
            assignedIds={assignedPlayerIds}
            onSelect={assignPlayer}
          />
        )}
      </div>

      <Bottom
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
