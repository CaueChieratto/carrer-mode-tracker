import { useState } from "react";
import { Career } from "../../../../../common/interfaces/Career";
import { Players } from "../../../../../common/interfaces/playersInfo/players";
import Card from "../../../../../ui/Card";
import SeasonRow from "../components/SeasonRow";
import SeasonTotalStats from "../components/SeasonTotalStats";
import LeagueStatsRowTotal from "./components/LeagueStatsRowTotal";
import { useTotalPlayerTab } from "./hooks/useTotalPlayerTab";
import Styles from "./TotalPlayerTab.module.css";
import NoStatsMessage from "../../../../../components/NoStatsMessage";
import { Copy } from "../../../../../common/utils/Copy";
import { buildPlayerTabCopyText } from "../helpers/buildPlayerTabCopyText";
import { useLocation } from "react-router-dom";
import { ClubData } from "../../../../../common/interfaces/club/clubData";

type TotalPlayerTabProps = {
  player?: Players;
  career: Career;
  season?: ClubData;
};

const TotalPlayerTab = ({ player, career, season }: TotalPlayerTabProps) => {
  const location = useLocation();
  const isNotSeason = location.pathname.includes("/Geral");

  const { allTrophiesWon, seasonsCount } = useTotalPlayerTab(career, player);

  const [expand, setExpand] = useState<Record<string, boolean>>({});

  const toggleExpand = (leagueName: string) => {
    setExpand((prev) => ({
      ...prev,
      [leagueName]: !prev[leagueName],
    }));
  };

  if (!player) return null;

  let displayTrophies = allTrophiesWon;
  let displayIdentifier: string | number = seasonsCount;
  let playerForTotalCalc = player;

  if (!isNotSeason && season) {
    const startYear =
      new Date(career.createdAt).getFullYear() + season.seasonNumber - 1;
    const endYear = (startYear + 1).toString().slice(-2);
    const seasonString =
      career.nation === "Brasil" ||
      career.nation === "EUA" ||
      career.nation === "Argentina"
        ? startYear.toString()
        : `${startYear.toString().slice(-2)}/${endYear}`;

    displayTrophies = career.trophies.filter((t) =>
      t.seasons.includes(seasonString),
    );
    displayIdentifier = seasonString;

    const normalizedName = player.name.trim().toLowerCase();
    const normalizedNation = player.nation.trim().toLowerCase();

    const playerInThisSeason = season.players.find(
      (p) =>
        p.name.trim().toLowerCase() === normalizedName &&
        p.nation.trim().toLowerCase() === normalizedNation,
    );

    if (playerInThisSeason) {
      playerForTotalCalc = playerInThisSeason;
    }
  }

  const copyTotalLeague = async () => {
    const text = buildPlayerTabCopyText(
      "TOTAL_LEAGUE",
      player,
      displayTrophies,
      displayIdentifier,
    );
    await Copy(text, "Estatísticas por liga copiadas com sucesso!");
  };

  const copyTotal = async () => {
    const text = buildPlayerTabCopyText(
      "TOTAL",
      playerForTotalCalc,
      displayTrophies,
      displayIdentifier,
    );
    await Copy(text, "Estatísticas totais copiadas com sucesso!");
  };

  if (player?.statsLeagues.length === 0) {
    return (
      <NoStatsMessage
        textOne="Nenhuma estatística encontrada"
        textTwo="Este jogador não possui nenhuma estatística registrada ou temporada válida para ser exibida."
      />
    );
  }

  return (
    <>
      {isNotSeason && (
        <Card className={Styles.card}>
          <SeasonRow
            seasonString="Total por Liga"
            player={player}
            onClickCopy={copyTotalLeague}
          />
          {player?.statsLeagues.map((league) => {
            const trophy = displayTrophies.find(
              (t) => t.leagueName === league.leagueName,
            );
            return (
              <LeagueStatsRowTotal
                key={league.leagueName}
                leagueStats={league}
                isExpanded={!!expand[league.leagueName]}
                toggleExpand={toggleExpand}
                trophy={trophy}
                player={player}
              />
            );
          })}
        </Card>
      )}

      <Card className={Styles.card}>
        <SeasonRow
          seasonString="Total"
          player={playerForTotalCalc}
          onClickCopy={copyTotal}
        />
        <SeasonTotalStats
          isTotal
          playerInSeason={playerForTotalCalc}
          trophiesWonInSeason={displayTrophies}
        />
      </Card>
    </>
  );
};

export default TotalPlayerTab;
