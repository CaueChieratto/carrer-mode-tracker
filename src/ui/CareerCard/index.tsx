import { Dispatch, SetStateAction } from "react";
import { Career } from "../../common/interfaces/Career";
import { ModalType } from "../../common/types/enums/ModalType";
import ContainerButton from "../../components/ContainerButton";
import SummarySection from "../../components/SummarySection";
import Card from "../Card";
import ClubNameInCard from "../ClubNameInCard";
import DataInCard from "../DataInCard";
import Styles from "./CareerCard.module.css";
import { Buttons } from "../../common/elements/Buttons";
import { ButtonConfig } from "../../common/constants/CareerCardButtons";

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
