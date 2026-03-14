import { Dispatch, SetStateAction } from "react";
import { Career } from "../../interfaces/Career";
import { ModalType } from "../../../../managers/enum/ModalType";
import ContainerButton from "../../../../components/ContainerButton";
import SummarySection from "./components/SummarySection";
import Card from "../../../../ui/Card";
import ClubNameInCard from "./components/ClubNameInCard";
import DataInCard from "./components/DataInCard";
import Styles from "./CareerCard.module.css";
import { Buttons } from "../../../../common/elements/Buttons";
import { ButtonConfig } from "../../config/CareerCardButtons";

interface CareerCardProps {
  career: Career;
  buttons: ButtonConfig[];
  onOpenModal: (modal: ModalType, career?: Career) => void;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
}

const CareerCard = ({
  career,
  buttons,
  onOpenModal,
  setSelectedCareer,
}: CareerCardProps) => {
  return (
    <Card
      setSelectedCareer={setSelectedCareer}
      selectedCareer={career}
      onOpenModal={onOpenModal}
    >
      <div className={Styles.card_container}>
        <ClubNameInCard
          selectedCareer={career}
          setSelectedCareer={setSelectedCareer}
          onOpenModal={onOpenModal}
          clubName={career.clubName}
          colorsTeams={career.colorsTeams}
          managerName={career.managerName}
          teamBadge={career.teamBadge}
        />
        <SummarySection career={career} />
        <footer className={Styles.footer}>
          <DataInCard createdAt={career.createdAt} />
          <ContainerButton>
            {buttons.map((button, i) => (
              <Buttons.CareerCardButtons
                key={i}
                career={career}
                setSelectedCareer={setSelectedCareer}
                onOpenModal={onOpenModal}
                button={button}
              />
            ))}
          </ContainerButton>
        </footer>
      </div>
    </Card>
  );
};

export default CareerCard;
