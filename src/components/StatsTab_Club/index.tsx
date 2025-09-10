import { ClubData } from "../../common/interfaces/club/clubData";
import Styles from "./StatsTab_Club.module.css";
import NoStatsMessage from "../NoStatsMessage";
import { useSortedPlayersWithStats } from "../../common/hooks/Players/UseSortedPlayersWithStats";
import PlayerStatsList from "../../ui/PlayerStatsList";

type StatsTab_ClubProps = {
  season: ClubData;
};

export const StatsTab_Club = ({ season }: StatsTab_ClubProps) => {
  const playersWithStats = useSortedPlayersWithStats(season.players);

  return (
    <div className={Styles.container_stats}>
      {playersWithStats.length > 0 ? (
        <PlayerStatsList players={playersWithStats} />
      ) : (
        <NoStatsMessage />
      )}
    </div>
  );
};
