import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";
import { ActiveCard } from "../../screens/ActiveCard";
import { AddingPlayer } from "../../screens/AddingPlayer";
import { AddingTournament } from "../../screens/AddingTournament";
import { DashboardGrid } from "../../screens/DashboardGrid";
import { PromotingPlayer } from "../../screens/PromotingPlayer";

export const AcademyContentView = () => {
  const {
    isAddingPlayer,
    isAddingTournament,
    isPromotingPlayer,
    activeCardIndex,
    selectedPlayer,
    selectedTournamentId,
  } = useAcademyContext();

  if (isAddingPlayer) return <AddingPlayer />;
  if (isAddingTournament) return <AddingTournament />;
  if (isPromotingPlayer) return <PromotingPlayer />;

  if (activeCardIndex !== null || selectedPlayer || selectedTournamentId) {
    return <ActiveCard />;
  }

  return <DashboardGrid />;
};
