import { Career } from "../../../../../../common/interfaces/Career";
import { formatDisplayValue } from "../../../../../../common/utils/FormatValue";
import { useStatsSummary } from "../../hooks/useStatsSummary";
import { StatDisplay } from "../../ui/StatDisplay";

interface StatsSummaryProps {
  career: Career;
}

const StatsSummary = ({ career }: StatsSummaryProps) => {
  const stats = useStatsSummary(career);

  const displays = [
    {
      label: "Mais Jogos",
      playerName: stats.mostGames.name,
      value: stats.mostGames.games,
    },
    {
      label: "Mais Participações",
      playerName: stats.mostGoalContributions.name,
      value: stats.mostGoalContributions.goalContributions,
    },
    {
      label: "Mais Gols",
      playerName: stats.mostGoals.name,
      value: stats.mostGoals.goals,
    },
    {
      label: "Mais Assistências",
      playerName: stats.mostAssists.name,
      value: stats.mostAssists.assists,
    },
    {
      label: "Maior Contratação",
      playerName: stats.biggestSigning.name,
      value: formatDisplayValue(stats.biggestSigning.value),
    },
    {
      label: "Maior Venda",
      playerName: stats.biggestSale.name,
      value: formatDisplayValue(stats.biggestSale.value),
    },
  ];

  return (
    <>
      {displays.map((stat) => (
        <StatDisplay
          key={stat.label}
          label={stat.label}
          playerName={stat.playerName}
          value={stat.value}
        />
      ))}
    </>
  );
};

export default StatsSummary;
