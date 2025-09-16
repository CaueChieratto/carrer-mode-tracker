import Styles from "../SeasonsPlayerTab.module.css";

type LeagueStatsRowProps = {
  leagueImage: string;
  leagueName: string;
  seasonTitle?: boolean;
};

const LeagueStatsRow = ({
  leagueImage,
  leagueName,
  seasonTitle,
}: LeagueStatsRowProps) => {
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
            Campeão da <br />
            {leagueName}
          </>
        ) : (
          <>{leagueName}</>
        )}
      </h1>
    </section>
  );
};

export default LeagueStatsRow;
