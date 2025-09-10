import { Dispatch, SetStateAction, useState } from "react";
import Styles from "./ClubNameInCard.module.css";
import { FaPlus } from "react-icons/fa6";
import ContainerIcon from "../../components/ContainerIcon";
import { ModalType } from "../../common/types/enums/ModalType";
import { Career } from "../../common/interfaces/Career";
import { ColorsService } from "../../common/services/ColorsService";
import { UseChange } from "../../common/hooks/Colors/UseChangeClubColors";

type ClubNameInCardProps = {
  clubName: string;
  colorsTeams: string[];
  managerName: string;
  teamBadge: string;
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  onOpenModal: (type: ModalType, selectedCareer: Career) => void;
};

const ClubNameInCard = ({
  clubName,
  colorsTeams,
  managerName,
  teamBadge,
  selectedCareer,
  setSelectedCareer,
  onOpenModal,
}: ClubNameInCardProps) => {
  const primaryClubColor = colorsTeams[0];
  const secondaryClubColor = colorsTeams[1];

  const [colorDefault, setColor] = useState(() => {
    return ColorsService.getColorSaved(selectedCareer.id) || primaryClubColor;
  });

  function change() {
    UseChange({
      colorDefault,
      primaryClubColor,
      secondaryClubColor,
      setColor,
      selectedCareer,
    });
  }

  return (
    <header className={Styles.container_header}>
      <div className={Styles.container_info}>
        <h2 className={Styles.h2}>{clubName}</h2>
        <p className={Styles.p}>{managerName}</p>
      </div>
      <div
        className={Styles.container_img}
        style={{ backgroundColor: colorDefault }}
        onClick={change}
      >
        {teamBadge ? (
          <img className={Styles.img} src={teamBadge} />
        ) : (
          <ContainerIcon
            className={Styles.icon}
            onClick={() => {
              setSelectedCareer(selectedCareer);
              onOpenModal(ModalType.ADD_CLUB_IMG, selectedCareer);
            }}
          >
            <FaPlus size={23} />
          </ContainerIcon>
        )}
      </div>
    </header>
  );
};

export default ClubNameInCard;
