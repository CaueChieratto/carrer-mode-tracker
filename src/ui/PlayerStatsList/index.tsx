import { Career } from "../../common/interfaces/Career";
import { ClubData } from "../../common/interfaces/club/clubData";
import { Players } from "../../common/interfaces/playersInfo/players";
import { sortedPlayers } from "../../common/utils/Sorts";
import PlayerStats from "../../components/PlayerStats";

type PlayerStatsListProps = {
  players: Players[];
  career: Career;
  season: ClubData;
};

const PlayerStatsList = ({ players, career, season }: PlayerStatsListProps) => {
  const sortedPlayerList = sortedPlayers(players);

  return (
    <>
      {sortedPlayerList.map((player) => (
        <PlayerStats
          key={player.id}
          player={player}
          career={career}
          season={season}
        />
      ))}
    </>
  );
};

export default PlayerStatsList;
