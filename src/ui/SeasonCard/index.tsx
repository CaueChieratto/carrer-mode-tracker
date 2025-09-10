import Styles from "./SeasonCard.module.css";
import { TbHandClick } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";
import { ClubData } from "../../common/interfaces/club/clubData";
import Card from "../Card";

type SeasonCardProps = {
  season: ClubData;
  onNavigate: () => void;
  onDelete: () => void;
};

const SeasonCard = ({ season, onNavigate, onDelete }: SeasonCardProps) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Card className={Styles.card} onClick={onNavigate}>
      <div className={Styles.icon} onClick={handleDeleteClick}>
        <IoMdCloseCircle size={25} color="red" />
      </div>
      <h1 className={Styles.h1}>Temporada {season.seasonNumber}</h1>
      <TbHandClick />
    </Card>
  );
};

export default SeasonCard;
