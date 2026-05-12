import { useState } from "react";
import Styles from "./SeasonCard.module.css";
import { TbHandClick } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";
import { ClubData } from "../../common/interfaces/club/clubData";
import Card from "../Card";
import Load from "../../components/Load";

type SeasonCardProps = {
  season: ClubData;
  onClick: () => void;
  onDelete: () => void | Promise<void>;
};

const SeasonCard = ({ season, onClick, onDelete }: SeasonCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      await onDelete();
    } catch (error) {
      console.error("Erro ao deletar temporada:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={Styles.card} onClick={!isLoading ? onClick : undefined}>
      {isLoading ? (
        <Load />
      ) : (
        <>
          <div className={Styles.icon} onClick={handleDeleteClick}>
            <IoMdCloseCircle size={25} color="red" />
          </div>
          <h1 className={Styles.h1}>Temporada {season.seasonNumber}</h1>
          <TbHandClick />
        </>
      )}
    </Card>
  );
};

export default SeasonCard;
