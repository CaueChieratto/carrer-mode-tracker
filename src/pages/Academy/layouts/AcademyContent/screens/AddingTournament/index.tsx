import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";
import { AddingTournamentSkeleton } from "./AddingTournamentSkeleton";
import { AddingTournamentView } from "./AddingTournamentView";

export const AddingTournament = () => {
  const { isLoading, setIsAddingTournament, refetchTournaments } =
    useAcademyContext();

  const handleTournamentAdded = () => {
    setIsAddingTournament(false);
    if (refetchTournaments) refetchTournaments();
  };

  if (isLoading) {
    return <AddingTournamentSkeleton />;
  }

  return <AddingTournamentView onTournamentAdded={handleTournamentAdded} />;
};
