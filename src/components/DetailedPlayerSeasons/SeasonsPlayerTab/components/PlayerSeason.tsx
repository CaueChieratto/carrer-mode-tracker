import SeasonRow from "../../components/SeasonRow";
import TrophyRow from "./TrophyRow";
import SeasonTotalStats from "../../components/SeasonTotalStats";
import Styles from "../SeasonsPlayerTab.module.css";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Trophy } from "../../../../common/interfaces/club/trophy";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { sortLeaguesByLevel } from "../../../../common/utils/Sorts";
import Card from "../../../../ui/Card";

type PlayerSeasonProps = {
  season: ClubData;
  player?: Players;
  seasonString: string;
  trophiesWonInSeason: Trophy[];
  isExpanded: (key: string) => boolean;
  toggleExpand: (key: string) => void;
};

const PlayerSeason = ({
  season,
  player,
  seasonString,
  trophiesWonInSeason,
  isExpanded,
  toggleExpand,
}: PlayerSeasonProps) => {
  const playerInSeason = season.players.find((p) => p.id === player?.id)!;
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
              isExpanded={isExpanded(leagueKey)}
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
};

export default PlayerSeason;
