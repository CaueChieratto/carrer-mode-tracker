import { FaPlus } from "react-icons/fa";
import { FocusedCard } from "../../components/Cards/FocusedCard";
import { CreateAcademyPlayerForm } from "../../components/Player/containers/CreateAcademyPlayerForm";

type AddingPlayerViewProps = {
  onPlayerAdded: () => void;
};

export const AddingPlayerView = ({ onPlayerAdded }: AddingPlayerViewProps) => {
  return (
    <FocusedCard Icon={FaPlus} title="Adicionar Jogador">
      <CreateAcademyPlayerForm onComplete={onPlayerAdded} />
    </FocusedCard>
  );
};
