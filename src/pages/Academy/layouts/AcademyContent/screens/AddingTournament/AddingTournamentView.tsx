import { FaTrophy } from "react-icons/fa";
import { FocusedCard } from "../../components/Cards/FocusedCard";
import { CreateAcademyTournamentForm } from "../../components/Tournament/containers/CreateAcademyTournamentForm";
import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";

type AddingTournamentViewProps = {
  onTournamentAdded: () => void;
};

export const AddingTournamentView = ({
  onTournamentAdded,
}: AddingTournamentViewProps) => {
  const { career } = useAcademyContext();

  const tournamentName = career.academy?.tournament;

  return (
    <FocusedCard Icon={FaTrophy} title={`Adicionar ${tournamentName}`}>
      <CreateAcademyTournamentForm onComplete={onTournamentAdded} />
    </FocusedCard>
  );
};
