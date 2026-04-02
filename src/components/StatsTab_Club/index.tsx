import { ClubData } from "../../common/interfaces/club/clubData";
import NoStatsMessage from "../NoStatsMessage";
import { useSortedPlayersWithStats } from "../../common/hooks/Players/UseSortedPlayersWithStats";
import PlayerStatsList from "../../ui/PlayerStatsList";
import { Career } from "../../common/interfaces/Career";
import { ContainerClubContent } from "../ContainerClubContent";

type StatsTab_ClubProps = {
  season: ClubData;
  career: Career;
};

export const StatsTab_Club = ({ season, career }: StatsTab_ClubProps) => {
  const playersWithStats = useSortedPlayersWithStats(season.players);

  return (
    <ContainerClubContent>
      {playersWithStats.length > 0 ? (
        <PlayerStatsList
          players={playersWithStats}
          career={career}
          season={season}
        />
      ) : (
        <NoStatsMessage
          isStats
          textOne="Nenhuma estatística encontrada"
          textTwo="Primeiro, adicione jogadores ao elenco para poder registrar suas estatísticas."
        />
      )}
    </ContainerClubContent>
  );
};
