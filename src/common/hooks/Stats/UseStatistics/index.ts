import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Styles from "../../../../ui/Statistic/CalculatedStatistics.module.css";
import { Players } from "../../../interfaces/playersInfo/players";
import { LeagueStats } from "../../../interfaces/playersStats/leagueStats";
import { calculateTotalStats } from "../../../utils/PlayerStatsCalculator";

type UseStatisticsProps = {
  total?: boolean;
  league?: boolean;
  isGoalkeeper?: boolean;
  player?: Players;
  leagueStats?: LeagueStats;
  handleDeleteLeague?: (leagueName: string) => void;
  isPlayer?: boolean;
};

export const useStatistics = ({
  total,
  league,
  isGoalkeeper,
  player,
  leagueStats,
  handleDeleteLeague,
  isPlayer,
}: UseStatisticsProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const totalStats = useMemo(() => {
    if (!total || !player) return null;
    return calculateTotalStats(player);
  }, [player, total]);

  const statsData = useMemo(
    () => [
      {
        label: "Jogos",
        getValue: () => (total ? totalStats?.games : leagueStats?.stats.games),
      },
      {
        label: "Gols + Assistências",
        getValue: () =>
          total
            ? (totalStats?.goals ?? 0) + (totalStats?.assists ?? 0)
            : (leagueStats?.stats.goals ?? 0) +
              (leagueStats?.stats.assists ?? 0),
      },
      {
        label: "Gols",
        getValue: () => (total ? totalStats?.goals : leagueStats?.stats.goals),
        hideForGoalkeeper: true,
      },
      {
        label: "Jogos Sem Sofrer Gols",
        getValue: () =>
          total ? totalStats?.cleanSheets : leagueStats?.stats.cleanSheets,
        showForGoalkeeper: true,
      },
      {
        label: "Assistências",
        getValue: () =>
          total ? totalStats?.assists : leagueStats?.stats.assists,
      },
      {
        label: "Média",
        getValue: () =>
          total ? totalStats?.averageRating : leagueStats?.stats.rating,
        className: !league ? Styles.rating : Styles.ratingLeague,
        getColor: true,
      },
      {
        label: "Bola de Ouro",
        getValue: () => player?.ballonDor,
        showOnlyForTotal: true,
      },
      {
        label: "Deletar",
        showOnlyForLeague: true,
        onClick: () => {
          if (leagueStats) {
            if (
              window.confirm(
                `Deseja excluir permanentemente a ${leagueStats.leagueName}?`
              )
            ) {
              handleDeleteLeague?.(leagueStats.leagueName);
            }
          }
        },
      },
    ],
    [totalStats, leagueStats, total, league, player, handleDeleteLeague]
  );

  const filteredStats = useMemo(
    () =>
      statsData.filter((stat) => {
        if (isPlayer && stat.label === "Bola de Ouro") return false;
        if (isGeralPage && stat.label === "Deletar") return false;
        if (stat.showOnlyForLeague && !league) return false;
        if (stat.showOnlyForTotal && !total) return false;
        if (isGoalkeeper) {
          return !stat.hideForGoalkeeper;
        } else {
          return !stat.showForGoalkeeper;
        }
      }),
    [statsData, isGeralPage, league, total, isGoalkeeper, isPlayer]
  );

  return { filteredStats };
};
