import { Players } from "../../common/interfaces/playersInfo/players";
import { sortedPlayers } from "../../common/utils/Sorts";
import PlayerStats from "../../components/PlayerStats";

type PlayerStatsListProps = {
  players: Players[];
};

const PlayerStatsList = ({ players }: PlayerStatsListProps) => {
  const sortedPlayerList = sortedPlayers(players);

  return (
    <>
      {sortedPlayerList.map((player) => (
        <PlayerStats key={player.id} player={player} />
      ))}
    </>
  );
};

export default PlayerStatsList;
