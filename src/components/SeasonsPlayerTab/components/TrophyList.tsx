import { Trophy } from "../../../common/interfaces/club/trophy";
import Styles from "../SeasonsPlayerTab.module.css";
import LeagueStatsRow from "./LeagueStatsRow";
import NoTitleSeason from "./NoTitleSeason";

type TrophyListProps = {
  trophies: Trophy[];
};

const TrophyList = ({ trophies }: TrophyListProps) => {
  if (trophies.length === 0) {
    return <NoTitleSeason leagueName="nenhum título na temporada" />;
  }

  return (
    <div className={Styles.seasonTitle}>
      {trophies.map((trophy) => (
        <LeagueStatsRow
          seasonTitle
          key={trophy.leagueName}
          leagueImage={trophy.leagueImage}
          leagueName={trophy.leagueName}
        />
      ))}
    </div>
  );
};

export default TrophyList;
