import { FaTrophy } from "react-icons/fa";
import Styles from "./Images.module.css";

type ImagesProps = {
  trophyImage: string;
};

export const Images = ({ trophyImage }: ImagesProps) => {
  return (
    <div className={Styles.imgWrapper}>
      {trophyImage === "/images/leagues/default.png" ? (
        <FaTrophy className={Styles.img} size={48} color="#FFD700" />
      ) : (
        <img className={Styles.img} src={trophyImage} alt="Troféu" />
      )}
    </div>
  );
};
