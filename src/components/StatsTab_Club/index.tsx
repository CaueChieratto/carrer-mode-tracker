import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ClubData } from "../../common/interfaces/club/clubData";
import NoStatsMessage from "../NoStatsMessage";
import { useSortedPlayersWithStats } from "./hooks/UseSortedPlayersWithStats";
import PlayerStatsList from "./components/PlayerStatsList";
import { Career } from "../../common/interfaces/Career";
import { ContainerClubContent } from "../ContainerClubContent";
import { getAggregatedPlayersForCareer } from "../../layout/SectionView/helpers/mergeMatchStats";

type StatsTab_ClubProps = {
  season: ClubData;
  career: Career;
};

export const StatsTab_Club = ({ season, career }: StatsTab_ClubProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const playersToDisplay = useMemo(() => {
    if (isGeralPage) {
      return getAggregatedPlayersForCareer(career);
    }
    return season.players;
  }, [isGeralPage, career, season.players]);

  const playersWithStats = useSortedPlayersWithStats(playersToDisplay);

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
