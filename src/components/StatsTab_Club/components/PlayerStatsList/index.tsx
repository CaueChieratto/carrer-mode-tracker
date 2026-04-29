import { useLocation } from "react-router-dom";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import PlayerStats from "./components/PlayerStats";
import { sortedPlayers } from "./utils/sortedPlayers";
import { sortPlayersByContributions } from "./utils/sortPlayersByContributions";

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
      {sortedPlayerList.map((player, i) => (
        <PlayerStats
          key={`${player.id}-${i}`}
          player={player}
          career={career}
          season={season}
          isGeralPage={isGeralPage}
        />
      ))}
    </>
  );
};

export default PlayerStatsList;
