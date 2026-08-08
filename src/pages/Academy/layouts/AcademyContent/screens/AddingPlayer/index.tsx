import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";
import { AddingPlayerSkeleton } from "./AddingPlayerSkeleton";
import { AddingPlayerView } from "./AddingPlayerView";

export const AddingPlayer = () => {
  const { isLoading, setIsAddingPlayer, refetchPlayers } = useAcademyContext();

  const handlePlayerAdded = () => {
    setIsAddingPlayer(false);
    refetchPlayers();
  };

  if (isLoading) {
    return <AddingPlayerSkeleton />;
  }

  return <AddingPlayerView onPlayerAdded={handlePlayerAdded} />;
};
