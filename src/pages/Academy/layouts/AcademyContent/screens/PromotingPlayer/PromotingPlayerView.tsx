import { FaArrowUp } from "react-icons/fa";
import { FocusedCard } from "../../components/Cards/FocusedCard";
import { PromoteAcademyPlayerForm } from "../../components/Player/containers/PromoteAcademyPlayerForm";

type PromotingPlayerViewProps = {
  onPlayerPromoted: () => void;
};

export const PromotingPlayerView = ({
  onPlayerPromoted,
}: PromotingPlayerViewProps) => {
  return (
    <FocusedCard Icon={FaArrowUp} title="Promover ao Profissional">
      <PromoteAcademyPlayerForm onComplete={onPlayerPromoted} />
    </FocusedCard>
  );
};
