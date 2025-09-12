import { ClubData } from "../../common/interfaces/club/clubData";
import Styles from "./StatsTab_Club.module.css";
import NoStatsMessage from "../NoStatsMessage";
import { useSortedPlayersWithStats } from "../../common/hooks/Players/UseSortedPlayersWithStats";
import PlayerStatsList from "../../ui/PlayerStatsList";
import { Career } from "../../common/interfaces/Career";

type StatsTab_ClubProps = {
  season: ClubData;
  career: Career;
};

export const StatsTab_Club = ({ season, career }: StatsTab_ClubProps) => {
  const playersWithStats = useSortedPlayersWithStats(season.players);

  return (
    <div className={Styles.container_stats}>
      {playersWithStats.length > 0 ? (
        <PlayerStatsList
          players={playersWithStats}
          career={career}
          season={season}
        />
      ) : (
        <NoStatsMessage />
      )}
    </div>
  );
};
