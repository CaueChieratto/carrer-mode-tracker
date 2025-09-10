import { useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";
import { IoIosStats } from "react-icons/io";
import { TbShieldCancel, TbSoccerField, TbTargetArrow } from "react-icons/tb";
import { LeagueStats } from "../../common/interfaces/playersStats/leagueStats";
import { Players } from "../../common/interfaces/playersInfo/players";
import Styles from "../../ui/Statistic/CalculatedStatistics.module.css";
import { calculateTotalStats } from "../../common/utils/PlayerStatsCalculator";
import Statistic from "../../ui/Statistic";
import { FcFullTrash } from "react-icons/fc";

type CalculatedStatisticsProps = {
  info?: boolean;
  total?: boolean;
  league?: boolean;
  isGoalkeeper?: boolean;
  player?: Players;
  leagueStats?: LeagueStats;
  handleDeleteLeague?: (leagueName: string) => void;
};

const CalculatedStatistics = ({
  info,
  total,
  league,
  isGoalkeeper,
  player,
  leagueStats,
  handleDeleteLeague,
}: CalculatedStatisticsProps) => {
  const totalStats = useMemo(() => {
    if (!total || !player) return null;
    return calculateTotalStats(player);
  }, [player, total]);

  const statsData = [
    {
      label: "Jogos",
      icon: <TbSoccerField />,
      getValue: () => (total ? totalStats?.games : leagueStats?.stats.games),
    },
    {
      label: "Gols + Assistências",
      icon: <IoIosStats />,
      getValue: () =>
        total
          ? (totalStats?.goals ?? 0) + (totalStats?.assists ?? 0)
          : (leagueStats?.stats.goals ?? 0) + (leagueStats?.stats.assists ?? 0),
    },
    {
      label: "Gols",
      icon: <GiSoccerBall />,
      getValue: () => (total ? totalStats?.goals : leagueStats?.stats.goals),
      hideForGoalkeeper: true,
    },
    {
      label: "Jogos Sem Sofrer Gols",
      icon: <TbShieldCancel />,
      getValue: () =>
        total ? totalStats?.cleanSheets : leagueStats?.stats.cleanSheets,
      showForGoalkeeper: true,
    },
    {
      label: "Assistências",
      icon: <TbTargetArrow />,
      getValue: () =>
        total ? totalStats?.assists : leagueStats?.stats.assists,
    },
    {
      label: "Média",
      icon: <FaStar />,
      getValue: () =>
        total ? totalStats?.averageRating : leagueStats?.stats.rating,
      className: !league ? Styles.rating : Styles.ratingLeague,
      getColor: true,
    },
    {
      label: "Bola de Ouro",
      icon: <GiSoccerBall color="#FFD700" />,
      getValue: () => player?.ballonDor,
      showOnlyForTotal: true,
    },
    {
      label: "Deletar",
      icon: <FcFullTrash />,
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
  ];

  const filteredStats = statsData.filter((stat) => {
    if (stat.showOnlyForLeague && !league) return false;
    if (stat.showOnlyForTotal && !total) return false;
    if (isGoalkeeper) {
      return !stat.hideForGoalkeeper;
    } else {
      return !stat.showForGoalkeeper;
    }
  });

  return (
    <>
      {filteredStats.map((stat, index) => (
        <Statistic
          key={index}
          label={stat.label}
          icon={!stat.showOnlyForLeague ? stat.icon : undefined}
          deleteIcon={stat.showOnlyForLeague ? stat.icon : undefined}
          value={stat.getValue ? stat.getValue() : undefined}
          isLeague={league}
          isInfo={info}
          getColor={stat.getColor}
          className={stat.className}
          onClick={stat.onClick}
        />
      ))}
    </>
  );
};

export default CalculatedStatistics;
