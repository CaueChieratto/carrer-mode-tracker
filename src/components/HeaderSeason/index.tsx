import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Career } from "../../common/interfaces/Career";
import Styles from "./HeaderSeason.module.css";
import Button from "../Button";
import { useSeasonTheme } from "../../common/hooks/Seasons/UseSeasonTheme";
import { Players } from "../../common/interfaces/playersInfo/players";
import { Match } from "../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { OverflowText } from "../OverflowText";
import { PlayerCircle } from "../../pages/Match/components/LineupTab/layouts/Section/components/SlotButton/components/PlayerDetails/PlayerCircle";

type HeaderSeasonProps = {
  career: Career;
  season?: number;
  careerId: string;
  titleText?: string;
  titleTextMatch?: string;
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
  titleTextMatch,
  backSeasons,
  player,
  isPlayer,
  match,
}: HeaderSeasonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seasonId } = useParams<{ seasonId?: string }>();

  const { clubColor, darkClubColor } = useSeasonTheme();

  const searchParams = new URLSearchParams(location.search);
  const fromPlayerId = searchParams.get("playerId");
  const isFromGeral = searchParams.get("fromGeral") === "true";

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
              <div className={Styles.container_player}>
                <PlayerCircle shirtNumber={player?.shirtNumber} />
                <div className={Styles.container}>
                  <h1 className={match ? Styles.h1 : Styles.h1_player}>
                    {player?.name}
                  </h1>

                  {titleText && <p className={Styles.season}>{titleText}</p>}
                </div>
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

                <div
                  className={Styles.container}
                  style={
                    titleTextMatch
                      ? { alignItems: "center" }
                      : { alignItems: "flex-start" }
                  }
                >
                  {match ? (
                    <h1 className={Styles.h1}>
                      <OverflowText text={match.league || ""} />
                    </h1>
                  ) : (
                    <h1 className={Styles.h1}>{career.clubName}</h1>
                  )}
                  {season && (
                    <p className={Styles.season}>Temporada {season}</p>
                  )}
                  {(titleTextMatch || titleText) && (
                    <span className={Styles.season}>
                      {titleTextMatch ? (
                        <p className={Styles.p}>
                          <OverflowText text={titleTextMatch} />
                        </p>
                      ) : (
                        titleText
                      )}
                    </span>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <Button
        onClick={() => {
          if (fromPlayerId) {
            if (isFromGeral) {
              navigate(`/Career/${careerId}/Geral/Player/${fromPlayerId}`);
            } else if (seasonId) {
              navigate(
                `/Career/${careerId}/Season/${seasonId}/EditPlayer/${fromPlayerId}`,
              );
            } else {
              navigate(`/Career/${careerId}`);
            }
            return;
          }

          if (backSeasons) {
            backSeasons();
            return;
          }

          if (isPlayer) {
            if (location.pathname.includes("/Geral")) {
              navigate(`/Career/${careerId}/Geral`);
            } else if (seasonId) {
              navigate(`/Career/${careerId}/Season/${seasonId}`);
            } else {
              navigate(`/Career/${careerId}`);
            }
            return;
          }

          navigate(`/Career/${careerId}`);
        }}
        className={Styles.button}
      >
        Voltar
      </Button>
    </header>
  );
};

export default HeaderSeason;
