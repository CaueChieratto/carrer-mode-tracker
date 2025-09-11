// src/components/StatsSummary/index.tsx
import { useMemo } from "react";
import { Career } from "../../common/interfaces/Career";
import Styles from "./StatsSummary.module.css";
import { formatDisplayValue } from "../../common/utils/FormatValue";

type StatsSummaryProps = {
  career: Career;
};

const StatDisplay = ({
  label,
  playerName,
  value,
}: {
  label: string;
  playerName?: string;
  value: string | number;
}) => {
  if (!playerName || !value) {
    return null;
  }
  return (
    <div className={Styles.container_stats}>
      <h4 className={Styles.h4}>{label}</h4>
      <p className={Styles.p}>
        <span>{playerName}</span>: <span>{value}</span>
      </p>
    </div>
  );
};

const StatsSummary = ({ career }: StatsSummaryProps) => {
  const stats = useMemo(() => {
    const playerStats: {
      [id: string]: {
        name: string;
        games: number;
        goals: number;
        assists: number;
        goalContributions: number;
      };
    } = {};
    let biggestSigning = { name: "", value: 0 };
    let biggestSale = { name: "", value: 0 };

    (career.clubData || []).forEach((season) => {
      (season.players || []).forEach((player) => {
        if (!playerStats[player.id]) {
          playerStats[player.id] = {
            name: player.name,
            games: 0,
            goals: 0,
            assists: 0,
            goalContributions: 0,
          };
        }

        (player.statsLeagues || []).forEach((league) => {
          const goals = league.stats.goals || 0;
          const assists = league.stats.assists || 0;
          playerStats[player.id].games += league.stats.games || 0;
          playerStats[player.id].goals += goals;
          playerStats[player.id].assists += assists;
          playerStats[player.id].goalContributions += goals + assists;
        });

        (player.contract || []).forEach((contract) => {
          if (
            contract.buyValue &&
            Number(contract.buyValue) > biggestSigning.value
          ) {
            biggestSigning = {
              name: player.name,
              value: Number(contract.buyValue),
            };
          }
          if (contract.sellValue && contract.sellValue > biggestSale.value) {
            biggestSale = { name: player.name, value: contract.sellValue };
          }
        });
      });
    });

    const allPlayersWithStats = Object.values(playerStats);

    const initialPlayerStats = {
      name: "",
      games: 0,
      goals: 0,
      assists: 0,
      goalContributions: 0,
    };

    const mostGames = allPlayersWithStats.reduce(
      (max, p) => (p.games > max.games ? p : max),
      initialPlayerStats
    );
    const mostGoals = allPlayersWithStats.reduce(
      (max, p) => (p.goals > max.goals ? p : max),
      initialPlayerStats
    );
    const mostAssists = allPlayersWithStats.reduce(
      (max, p) => (p.assists > max.assists ? p : max),
      initialPlayerStats
    );
    const mostGoalContributions = allPlayersWithStats.reduce(
      (max, p) => (p.goalContributions > max.goalContributions ? p : max),
      initialPlayerStats
    );

    return {
      mostGames,
      mostGoals,
      mostAssists,
      mostGoalContributions,
      biggestSigning,
      biggestSale,
    };
  }, [career]);

  return (
    <>
      <StatDisplay
        label="Mais Jogos"
        playerName={stats.mostGames.name}
        value={stats.mostGames.games}
      />
      <StatDisplay
        label="Mais Participações"
        playerName={stats.mostGoalContributions.name}
        value={stats.mostGoalContributions.goalContributions}
      />
      <StatDisplay
        label="Mais Gols"
        playerName={stats.mostGoals.name}
        value={stats.mostGoals.goals}
      />
      <StatDisplay
        label="Mais Assistências"
        playerName={stats.mostAssists.name}
        value={stats.mostAssists.assists}
      />
      <StatDisplay
        label="Maior Contratação"
        playerName={stats.biggestSigning.name}
        value={formatDisplayValue(stats.biggestSigning.value)}
      />
      <StatDisplay
        label="Maior Venda"
        playerName={stats.biggestSale.name}
        value={formatDisplayValue(stats.biggestSale.value)}
      />
    </>
  );
};

export default StatsSummary;
