import { AggregatedStats } from "../calculateMatchStats";

export const formatMatchStats = (
  stats: AggregatedStats,
  totalMatches: number,
) => {
  const avg = (value: number, digits = 1) =>
    (value / totalMatches).toFixed(digits);

  const avgRating =
    stats.ratingCount > 0
      ? (stats.totalRating / stats.ratingCount).toFixed(2)
      : "0.00";

  const passesPercentage =
    stats.totalPasses > 0
      ? Math.round((stats.totalPassesCompleted / stats.totalPasses) * 100)
      : 0;

  const avgPossession = Math.round(stats.totalPossession / totalMatches);

  const avgFinishingsOffTarget = (
    (stats.totalFinishings - stats.totalFinishingsOnTarget) /
    totalMatches
  ).toFixed(1);

  return [
    {
      title: "Geral",
      stats: [
        { name: "Partidas", value: totalMatches },
        { name: "Posse de bola média", value: `${avgPossession}%` },
        { name: "Nota média do time", value: avgRating },
      ],
    },
    {
      title: "Atacando",
      stats: [
        { name: "Gols marcados", value: stats.goalsScored },
        { name: "Gols por jogo", value: avg(stats.goalsScored) },
        { name: "xG médio", value: avg(stats.totalXG, 2) },
        { name: "Finalizações por jogo", value: avg(stats.totalFinishings) },
        {
          name: "Chutes no alvo por jogo",
          value: avg(stats.totalFinishingsOnTarget),
        },
        {
          name: "Chutes fora por jogo",
          value: avgFinishingsOffTarget,
        },
      ],
    },
    {
      title: "Passes",
      stats: [
        { name: "Total de passes", value: stats.totalPasses },
        { name: "Assistências", value: stats.totalAssists },
        {
          name: "Passes certos",
          value: `${stats.totalPassesCompleted} (${passesPercentage}%)`,
        },
      ],
    },
    {
      title: "Defendendo",
      stats: [
        { name: "Gols sofridos", value: stats.goalsConceded },
        {
          name: "Gols sofridos por jogo",
          value: avg(stats.goalsConceded),
        },
        { name: "Jogos sem sofrer gol", value: stats.cleanSheets },
        { name: "Defesas por jogo", value: avg(stats.totalDefenses) },
        {
          name: "Recuperações de bola por jogo",
          value: avg(stats.totalBallRecovery),
        },
      ],
    },
    {
      title: "Outros",
      stats: [
        {
          name: "Cartões amarelos",
          value: `${stats.totalYellowCards} (${avg(stats.totalYellowCards)})`,
        },
        {
          name: "Cartões vermelhos",
          value: `${stats.totalRedCards} (${avg(stats.totalRedCards)})`,
        },
      ],
    },
  ];
};
