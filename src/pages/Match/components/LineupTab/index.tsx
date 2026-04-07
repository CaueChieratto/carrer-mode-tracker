import { useParams } from "react-router-dom";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { PlayerPicker } from "./components/PlayerPicker";
import { useLineup } from "./hooks/useLineup";
import { Header } from "./layouts/Header";
import { Section } from "./layouts/Section";
import Styles from "./LineupTab.module.css";
import { useCallback, useEffect } from "react";
import { Match } from "../../../../components/AllMatchesTab/types/Match";
import { ServiceLineup } from "../../services/ServiceLineup";

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

  const save = useCallback(async () => {
    if (!careerId || !seasonId) return;

    const savedLineup = buildSavedLineup();

    try {
      await ServiceLineup.saveLineupToMatch(
        careerId,
        seasonId,
        match.matchesId,
        savedLineup,
      );
      alert("Formação salva com sucesso!");
    } catch (erro) {
      console.error(erro);
      alert("Erro ao salvar a formação. Tente novamente.");
    }
  }, [careerId, seasonId, match.matchesId, buildSavedLineup]);

  useEffect(() => {
    onRegisterSave?.(save);
  }, [onRegisterSave, save]);

  return (
    <div className={Styles.wrapper}>
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
      />

      {selectingSlotId && (
        <PlayerPicker
          players={activePlayers}
          assignedIds={assignedPlayerIds}
          onSelect={assignPlayer}
        />
      )}
    </div>
  );
};
