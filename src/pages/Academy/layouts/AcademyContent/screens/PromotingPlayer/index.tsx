import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";
import { PromotingPlayerSkeleton } from "./PromotingPlayerSkeleton";
import { PromotingPlayerView } from "./PromotingPlayerView";

export const PromotingPlayer = () => {
  const { isLoading, setIsPromotingPlayer, back } = useAcademyContext();

  const handlePlayerPromoted = () => {
    setIsPromotingPlayer(false);
    back();
  };

  if (isLoading) {
    return <PromotingPlayerSkeleton />;
  }

  return <PromotingPlayerView onPlayerPromoted={handlePlayerPromoted} />;
};
