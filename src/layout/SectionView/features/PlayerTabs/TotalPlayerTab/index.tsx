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

type TotalPlayerTabProps = {
  player?: Players;
  career: Career;
};

const TotalPlayerTab = ({ player, career }: TotalPlayerTabProps) => {
  const { allTrophiesWon } = useTotalPlayerTab(career, player);
  const [expand, setExpand] = useState<Record<string, boolean>>({});

  const toggleExpand = (leagueName: string) => {
    setExpand((prev) => ({
      ...prev,
      [leagueName]: !prev[leagueName],
    }));
  };

  const normalizedName = player?.name.trim().toLowerCase();
  const normalizedNation = player?.nation.trim().toLowerCase();
  const seasonsCount = player
    ? career.clubData.filter((s) =>
        s.players.some(
          (p) =>
            p.name.trim().toLowerCase() === normalizedName &&
            p.nation.trim().toLowerCase() === normalizedNation,
        ),
      ).length
    : 0;

  const copyTotalLeague = async () => {
    if (!player) return;
    const text = buildPlayerTabCopyText(
      "TOTAL_LEAGUE",
      player,
      allTrophiesWon,
      seasonsCount,
    );
    await Copy(text, "Estatísticas por liga copiadas com sucesso!");
  };

  const copyTotal = async () => {
    if (!player) return;
    const text = buildPlayerTabCopyText(
      "TOTAL",
      player,
      allTrophiesWon,
      seasonsCount,
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
      <Card className={Styles.card}>
        <SeasonRow
          seasonString="Total por Liga"
          player={player}
          onClickCopy={copyTotalLeague}
        />
        {player?.statsLeagues.map((league) => {
          const trophy = allTrophiesWon.find(
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

      <Card className={Styles.card}>
        <SeasonRow
          seasonString="Total"
          player={player}
          onClickCopy={copyTotal}
        />
        <SeasonTotalStats
          isTotal
          playerInSeason={player}
          trophiesWonInSeason={allTrophiesWon}
        />
      </Card>
    </>
  );
};

export default TotalPlayerTab;
