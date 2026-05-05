import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ClubData } from "../../common/interfaces/club/clubData";
import NoStatsMessage from "../NoStatsMessage";
import { useSortedPlayersWithStats } from "./hooks/UseSortedPlayersWithStats";
import PlayerStatsList from "./components/PlayerStatsList";
import { Career } from "../../common/interfaces/Career";
import { ContainerClubContent } from "../ContainerClubContent";
import { getAggregatedPlayersForCareer } from "../../layout/SectionView/helpers/mergeMatchStats";
import { ButtonsSwitch } from "../AllMatchesTab/components/ButtonsSwitch";
import { buildPlayersCopyText } from "./helpers/buildPlayersCopyText";
import { sortPlayersList } from "./helpers/sortPlayersList";
import { usePersistedSortOption } from "./hooks/usePersistedSortOption";
import { SORTS_OPTIONS } from "./constants/SORTS_OPTIONS";

type StatsTab_ClubProps = {
  season: ClubData;
  career: Career;
};

export const StatsTab_Club = ({ season, career }: StatsTab_ClubProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const { sortOption, setSortOption, isReversed } = usePersistedSortOption();

  const playersToDisplay = useMemo(() => {
    return isGeralPage ? getAggregatedPlayersForCareer(career) : season.players;
  }, [isGeralPage, career, season.players]);

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

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        alert("Lista copiada com sucesso!");
      } else {
        throw new Error("Clipboard API indisponível");
      }
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Lista copiada com sucesso!");
      } catch (err) {
        console.error("Erro ao copiar texto no fallback:", err);
      }
      document.body.removeChild(textArea);
    }
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
          textTwo="Primeiro, adicione jogadores ao elenco para poder registrar suas estatísticas."
        />
      )}
    </ContainerClubContent>
  );
};
