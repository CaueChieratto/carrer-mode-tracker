import { Trophy } from "../../../../common/interfaces/club/trophy";
import Styles from "../SeasonsPlayerTab.module.css";

type LeagueStatsRowProps = {
  leagueImage: string;
  leagueName: string;
  seasonTitle?: boolean;
  isTotal?: boolean;
  trophy?: Trophy;
};

const LeagueStatsRow = ({
  leagueImage,
  leagueName,
  seasonTitle,
  isTotal,
  trophy,
}: LeagueStatsRowProps) => {
  const numberTitles = trophy?.seasons.length;

  return (
    <section
      className={!seasonTitle ? Styles.container : Styles.containerSeason}
    >
      <img src={leagueImage} alt={leagueName} className={Styles.card_img} />

      <h1
        className={!seasonTitle ? Styles.leagueName : Styles.leagueNameTitles}
      >
        {!seasonTitle ? (
          <>
            {isTotal && numberTitles ? `${numberTitles}x ` : ""}Campeão da{" "}
            <br />
            {leagueName}
          </>
        ) : (
          <>
            {!isTotal ? (
              <>{leagueName}</>
            ) : (
              <>
                {numberTitles} {leagueName}
              </>
            )}
          </>
        )}
      </h1>
    </section>
  );
};

export default LeagueStatsRow;
