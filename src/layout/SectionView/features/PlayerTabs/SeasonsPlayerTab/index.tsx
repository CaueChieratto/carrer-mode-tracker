import { useSeasonsPlayerTab } from "./hooks/useSeasonsPlayerTab";
import PlayerSeason from "./components/PlayerSeason";
import { useRenderableSeasons } from "./hooks/useRenderableSeasons";
import { Career } from "../../../../../common/interfaces/Career";
import { Players } from "../../../../../common/interfaces/playersInfo/players";
import NoStatsMessage from "../../../../../components/NoStatsMessage";
import { useLocation } from "react-router-dom";
import { ClubData } from "../../../../../common/interfaces/club/clubData";

type SeasonsPlayerTabProps = {
  career: Career;
  player?: Players;
  season?: ClubData;
};

const SeasonsPlayerTab = ({
  player,
  career,
  season,
}: SeasonsPlayerTabProps) => {
  const {
    expand,
    toggleExpand,
    seasonsPlayerPlayed,
    getSeasonString,
    getTrophiesWonInSeason,
  } = useSeasonsPlayerTab(career, player);

  const location = useLocation();
  const isNotSeason = location.pathname.includes("/Geral");

  let renderableSeasons = useRenderableSeasons(seasonsPlayerPlayed, player);

  if (!isNotSeason && season) {
    renderableSeasons = renderableSeasons.filter((s) => s.id === season.id);
  }

  if (renderableSeasons.length === 0) {
    return (
      <NoStatsMessage
        textOne="Nenhuma estatística encontrada"
        textTwo="Este jogador não possui nenhuma estatística registrada ou temporada válida para ser exibida."
      />
    );
  }

  return (
    <>
      {renderableSeasons.map((renderableSeason) => {
        const seasonString = getSeasonString(renderableSeason.seasonNumber);
        const trophiesWonInSeason = getTrophiesWonInSeason(seasonString);
        return (
          <PlayerSeason
            key={renderableSeason.id}
            season={renderableSeason}
            player={player}
            seasonString={seasonString}
            trophiesWonInSeason={trophiesWonInSeason}
            isExpanded={(key) => !!expand[key]}
            toggleExpand={toggleExpand}
          />
        );
      })}
    </>
  );
};

export default SeasonsPlayerTab;
