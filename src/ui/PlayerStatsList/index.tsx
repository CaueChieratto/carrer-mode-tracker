import { useLocation } from "react-router-dom";
import { Career } from "../../common/interfaces/Career";
import { ClubData } from "../../common/interfaces/club/clubData";
import { Players } from "../../common/interfaces/playersInfo/players";
import {
  sortedPlayers,
  sortPlayersByContributions,
} from "../../common/utils/Sorts";
import PlayerStats from "../../components/PlayerStats";

type PlayerStatsListProps = {
  players: Players[];
  career: Career;
  season: ClubData;
};

const PlayerStatsList = ({ players, career, season }: PlayerStatsListProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const sortedPlayerList = isGeralPage
    ? sortPlayersByContributions(players)
    : sortedPlayers(players);

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
