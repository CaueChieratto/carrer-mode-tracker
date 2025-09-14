import { useNavigate } from "react-router-dom";
import { Career } from "../../common/interfaces/Career";
import Styles from "./HeaderSeason.module.css";
import Button from "../Button";
import { useSeasonTheme } from "../../common/hooks/Seasons/UseSeasonTheme";
import { Players } from "../../common/interfaces/playersInfo/players";

type HeaderSeasonProps = {
  career: Career;
  season?: number;
  titleText?: string;
  backSeasons?: () => void;
  isPlayer?: boolean;
  player?: Players;
};

const HeaderSeason = ({
  career,
  season,
  titleText,
  backSeasons,
  player,
  isPlayer,
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
            {isPlayer ? (
              <div className={Styles.container}>
                <h1 className={Styles.h1}>
                  {player?.name} <span>{player?.overall}</span>{" "}
                </h1>

                {titleText && <p className={Styles.season}>{titleText}</p>}
              </div>
            ) : (
              <>
                <img src={career.teamBadge} className={Styles.img} />
                <div className={Styles.container}>
                  <h1 className={Styles.h1}>{career.clubName}</h1>
                  {season && (
                    <p className={Styles.season}>Temporada {season}</p>
                  )}
                  {titleText && <p className={Styles.season}>{titleText}</p>}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <Button
        onClick={() => (!backSeasons ? navigate(-1) : backSeasons())}
        className={Styles.button}
      >
        Voltar
      </Button>
    </header>
  );
};

export default HeaderSeason;
