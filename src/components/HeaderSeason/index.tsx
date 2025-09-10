import { useNavigate } from "react-router-dom";
import { Career } from "../../common/interfaces/Career";
import Styles from "./HeaderSeason.module.css";
import Button from "../Button";
import { useSeasonTheme } from "../../common/hooks/Seasons/UseSeasonTheme";

type HeaderSeasonProps = {
  career: Career;
  careerId: string;
  season?: number;
  player?: string;
  backSeasons?: () => void;
};

const HeaderSeason = ({
  career,
  careerId,
  season,
  player,
  backSeasons,
}: HeaderSeasonProps) => {
  const navigate = useNavigate();

  const { clubColor, darkClubColor } = useSeasonTheme();

  return (
    <header
      className={Styles.header}
      style={{
        background: `linear-gradient(to right, ${darkClubColor}, ${clubColor})`,
      }}
    >
      <div className={Styles.container_club}>
        {career.teamBadge && (
          <>
            <img src={career.teamBadge} className={Styles.img} />
            <div className={Styles.container}>
              <h1 className={Styles.h1}>{career.clubName}</h1>
              {season && <p className={Styles.season}>Temporada {season}</p>}
              {player && <p className={Styles.season}>{player}</p>}
            </div>
          </>
        )}
      </div>
      <Button
        onClick={() =>
          !backSeasons ? navigate(`/Career/${careerId}`) : backSeasons()
        }
        className={Styles.button}
      >
        Voltar
      </Button>
    </header>
  );
};

export default HeaderSeason;
