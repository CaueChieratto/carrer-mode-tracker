import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import NoStatsMessage from "../../../../../components/NoStatsMessage";
import { useSortedPlayersWithStats } from "./hooks/UseSortedPlayersWithStats";
import PlayerStatsList from "./components/PlayerStatsList";
import { Career } from "../../../../../common/interfaces/Career";
import { ContainerClubContent } from "../../../../../components/ContainerClubContent";
import { ButtonsSwitch } from "../../../../../components/ButtonsSwitch";
import { buildPlayersCopyText } from "./helpers/buildPlayersCopyText";
import { sortPlayersList } from "./helpers/sortPlayersList";
import { usePersistedSortOption } from "./hooks/usePersistedSortOption";
import { SORTS_OPTIONS } from "./constants/SORTS_OPTIONS";
import { Copy } from "../../../../../common/utils/Copy";
import { useAggregatedPlayers } from "../../../../../common/hooks/Players/UseAggregatedPlayers";
import { augmentSeasonWithMatchStats } from "../../../helpers/mergeMatchStats";

type StatsTab_ClubProps = {
  season: ClubData;
  career: Career;
};

export const StatsTab_Club = ({ season, career }: StatsTab_ClubProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");
  const storageKeySuffix = isGeralPage ? "geral" : season.id;
  const { sortOption, setSortOption, isReversed } =
    usePersistedSortOption(storageKeySuffix);

  const careerAggregatedPlayers = useAggregatedPlayers(career);

  const playersToDisplay = useMemo(() => {
    return isGeralPage
      ? careerAggregatedPlayers
      : augmentSeasonWithMatchStats(season, career.clubName).players;
  }, [isGeralPage, careerAggregatedPlayers, season, career.clubName]);

  const playersWithStats = useSortedPlayersWithStats(playersToDisplay);

  const sortedPlayerList = useMemo(() => {
    return sortPlayersList(
      playersWithStats,
      sortOption,
      isGeralPage,
      isReversed,
    );
  }, [playersWithStats, sortOption, isGeralPage, isReversed]);

  const copyList = async () => {
    if (!sortedPlayerList.length) return;
    const text = buildPlayersCopyText(sortedPlayerList);
    await Copy(text, "Lista copiada com sucesso!");
  };

  return (
    <ContainerClubContent>
      <ButtonsSwitch
        selectOptions={SORTS_OPTIONS}
        selectValue={sortOption}
        onSelectChange={setSortOption}
        onClickCopy={copyList}
      />
      {playersWithStats.length > 0 ? (
        <PlayerStatsList
          players={sortedPlayerList}
          career={career}
          season={season}
        />
      ) : (
        <NoStatsMessage
          isStats
          textOne="Nenhuma estatística encontrada"
          textTwo={
            isGeralPage
              ? "Jogue partidas para registrar o histórico global dos seus jogadores."
              : "Primeiro, adicione jogadores ao elenco para poder registrar suas estatísticas."
          }
        />
      )}
    </ContainerClubContent>
  );
};
