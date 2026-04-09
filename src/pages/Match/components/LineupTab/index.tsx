import { useEffect } from "react";
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
    navigate(
      `/Career/${careerId}/Season/${seasonId}/Match/${match.matchesId}/${playerId}`,
    );
  };

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
      />
    </div>
  );
};
