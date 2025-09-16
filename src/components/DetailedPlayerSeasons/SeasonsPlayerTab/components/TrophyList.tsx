import { Trophy } from "../../../../common/interfaces/club/trophy";
import Styles from "../SeasonsPlayerTab.module.css";
import LeagueStatsRow from "./LeagueStatsRow";
import NoTitleSeason from "../../components/NoTitleSeason";

type TrophyListProps = {
  trophies: Trophy[];
  isTotal?: boolean;
};

const TrophyList = ({ trophies, isTotal }: TrophyListProps) => {
  if (trophies.length === 0) {
    return <NoTitleSeason text="Nenhum" leagueName="título na temporada" />;
  }

  return (
    <div className={Styles.seasonTitle}>
      {trophies.map((trophy) => (
        <LeagueStatsRow
          seasonTitle
          isTotal={isTotal}
          key={trophy.leagueName}
          leagueImage={trophy.leagueImage}
          leagueName={trophy.leagueName}
          trophy={trophy}
        />
      ))}
    </div>
  );
};

export default TrophyList;
