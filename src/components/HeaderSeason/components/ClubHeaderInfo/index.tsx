import { Career } from "../../../../common/interfaces/Career";
import { Match } from "../../../../common/interfaces/Match";
import { OverflowText } from "../../../OverflowText";
import { getLeagueLogo } from "../../helpers/getLeagueLogo";
import Styles from "./ClubHeaderInfo.module.css";

type ClubHeaderInfoProps = {
  career: Career;
  match?: Match;
  season?: number;
  titleText?: string;
  titleTextMatch?: string;
};

export const ClubHeaderInfo = ({
  career,
  match,
  season,
  titleText,
  titleTextMatch,
}: ClubHeaderInfoProps) => {
  const leagueLogo = getLeagueLogo(career.clubData, match?.league);

  return (
    <>
      {match ? (
        <div className={Styles.img_card}>
          <img
            src={leagueLogo}
            className={Styles.img_league}
            alt="League Logo"
          />
        </div>
      ) : (
        career.teamBadge && (
          <img src={career.teamBadge} className={Styles.img} alt="Team Badge" />
        )
      )}
      <div
        className={Styles.container}
        style={{ alignItems: titleTextMatch ? "center" : "flex-start" }}
      >
        <h1 className={Styles.h1}>
          {match ? <OverflowText text={match.league || ""} /> : career.clubName}
        </h1>

        {season && <p className={Styles.season}>Temporada {season}</p>}

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
  );
};
