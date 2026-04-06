import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { PlayerPicker } from "./components/PlayerPicker";
import { useLineup } from "./hooks/useLineup";
import { Header } from "./layouts/Header";
import { Section } from "./layouts/Section";
import Styles from "./LineupTab.module.css";

type LineupTabProps = {
  season: ClubData;
  career: Career;
};

export const LineupTab = ({ season, career }: LineupTabProps) => {
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
  } = useLineup(season);

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
