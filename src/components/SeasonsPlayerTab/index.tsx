import { Career } from "../../common/interfaces/Career";
import { Players } from "../../common/interfaces/playersInfo/players";
import { useSeasonsPlayerTab } from "./hooks/useSeasonsPlayerTab";
import PlayerSeason from "./components/PlayerSeason";
import { useRenderableSeasons } from "./hooks/useRenderableSeasons";
import NoStatsMessage from "../NoStatsMessage";

type SeasonsPlayerTabProps = {
  career: Career;
  player?: Players;
};

const SeasonsPlayerTab = ({ player, career }: SeasonsPlayerTabProps) => {
  const {
    expand,
    toggleExpand,
    seasonsPlayerPlayed,
    getSeasonString,
    getTrophiesWonInSeason,
  } = useSeasonsPlayerTab(career, player);

  const renderableSeasons = useRenderableSeasons(
    seasonsPlayerPlayed,
    player?.id
  );

  if (renderableSeasons.length === 0) {
    return (
      <NoStatsMessage text="Este jogador não possui nenhuma estatística registrada ou temporada válida para ser exibida." />
    );
  }

  return (
    <>
      {renderableSeasons.map((season) => {
        const seasonString = getSeasonString(season.seasonNumber);
        const trophiesWonInSeason = getTrophiesWonInSeason(seasonString);

        return (
          <PlayerSeason
            key={season.id}
            season={season}
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
