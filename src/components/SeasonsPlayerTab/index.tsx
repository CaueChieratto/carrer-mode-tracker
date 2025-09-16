import { Career } from "../../common/interfaces/Career";
import { Players } from "../../common/interfaces/playersInfo/players";
import Styles from "./SeasonsPlayerTab.module.css";
import Card from "../../ui/Card";
import { useSeasonsPlayerTab } from "./hooks/useSeasonsPlayerTab";
import SeasonRow from "./components/SeasonRow";
import TrophyRow from "./components/TrophyRow";
import { sortLeaguesByLevel } from "../../common/utils/Sorts";
import SeasonTotalStats from "./components/SeasonTotalStats";

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
    playerId,
  } = useSeasonsPlayerTab(career, player);

  console.log(player);

  return (
    <>
      {seasonsPlayerPlayed.map((season) => {
        const seasonString = getSeasonString(season.seasonNumber);
        const playerInSeason = season.players.find((p) => p.id === playerId);
        if (!playerInSeason) return null;

        const trophiesWonInSeason = getTrophiesWonInSeason(seasonString);
        const sortedLeagues = sortLeaguesByLevel(playerInSeason.statsLeagues);

        return (
          <Card className={Styles.card} key={season.id}>
            <SeasonRow seasonString={seasonString} player={player} />
            {sortedLeagues.map((leagueStats) => {
              const trophy = trophiesWonInSeason.find(
                (t) => t.leagueName === leagueStats.leagueName
              );
              const leagueKey = `${season.id}-${leagueStats.leagueName}`;

              return (
                <div key={leagueKey}>
                  <TrophyRow
                    trophy={trophy}
                    playerInSeason={playerInSeason}
                    seasonId={season.id}
                    isExpanded={!!expand[leagueKey]}
                    toggleExpand={toggleExpand}
                    leagueStats={leagueStats}
                  />
                </div>
              );
            })}
            <SeasonTotalStats
              playerInSeason={playerInSeason}
              trophiesWonInSeason={trophiesWonInSeason}
            />
          </Card>
        );
      })}
    </>
  );
};

export default SeasonsPlayerTab;
