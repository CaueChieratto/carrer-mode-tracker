import { useNavigate } from "react-router-dom";
import { Career } from "../../common/interfaces/Career";
import Styles from "./HeaderSeason.module.css";
import Button from "../Button";
import { useSeasonTheme } from "../../common/hooks/Seasons/UseSeasonTheme";
import { Players } from "../../common/interfaces/playersInfo/players";
import { Match } from "../AllMatchesTab/types/Match";

type HeaderSeasonProps = {
  career: Career;
  season?: number;
  careerId: string;
  titleText?: string;
  backSeasons?: () => void;
  isPlayer?: boolean;
  match?: Match;
  player?: Players;
};

const HeaderSeason = ({
  career,
  season,
  careerId,
  titleText,
  backSeasons,
  player,
  isPlayer,
  match,
}: HeaderSeasonProps) => {
  const navigate = useNavigate();

  const { clubColor, darkClubColor } = useSeasonTheme();

  const leagueLogo = career.clubData
    ?.flatMap((club) => club.leagues)
    ?.find((league) => league?.name === match?.league)?.logo;

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
                {match ? (
                  <div className={Styles.img_card}>
                    <img src={leagueLogo} className={Styles.img_league} />
                  </div>
                ) : (
                  <img src={career.teamBadge} className={Styles.img} />
                )}

                <div className={Styles.container}>
                  {match ? (
                    <h1 className={Styles.h1}>{match.league}</h1>
                  ) : (
                    <h1 className={Styles.h1}>{career.clubName}</h1>
                  )}
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
        onClick={() =>
          !backSeasons
            ? navigate(
                isPlayer ? `/Career/${careerId}/Geral` : `/Career/${careerId}`,
              )
            : backSeasons()
        }
        className={Styles.button}
      >
        Voltar
      </Button>
    </header>
  );
};

export default HeaderSeason;
