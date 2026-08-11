import { FocusedCard } from "../../components/Cards/FocusedCard";
import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";
import { PlayerWorkspace } from "../../components/Player/views/PlayerWorkspace";
import { TournamentWorkspace } from "../../components/Tournament/views/TournamentWorkspace";

export const ActiveCardView = () => {
  const {
    activeCardIndex,
    selectedPlayer,
    selectedTournamentId,
    tournamentsAcademy,
    dashboardCards,
    isAnimationDisabled,
  } = useAcademyContext();

  const selectedTournament = tournamentsAcademy.find(
    (t) => t.id === selectedTournamentId,
  );

  let activeCard =
    activeCardIndex !== null ? dashboardCards[activeCardIndex] : null;

  if (selectedPlayer) {
    activeCard = dashboardCards[0];
  }
  if (selectedTournament) activeCard = dashboardCards[1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <FocusedCard
        key={activeCard?.id || "active-card"}
        Icon={activeCard?.Icon}
        title={activeCard?.title}
        disableAnimation={isAnimationDisabled}
        sortOptions={activeCard?.sortOptions}
        currentSort={activeCard?.currentSort}
        onSortChange={activeCard?.onSortChange}
        className={activeCard?.className}
      >
        {activeCard?.children}
      </FocusedCard>

      {selectedPlayer && <PlayerWorkspace selectedPlayer={selectedPlayer} />}
      {selectedTournament && (
        <TournamentWorkspace selectedTournament={selectedTournament} />
      )}
    </div>
  );
};
