import { PlayerData, ChartDataPoint } from "../../types";
import { getSeasonMonthWeight } from "../../utils/getSeasonMonthWeight";

export const buildChartData = (
  player: PlayerData | undefined | null,
  currentAttribute: string,
): ChartDataPoint[] => {
  if (!player?.evolutionHistory) return [];

  const history = player.evolutionHistory.filter(
    (h) => h.changedAttribute === currentAttribute,
  );

  if (history.length === 0) return [];

  const sortedHistory = [...history].sort((a, b) => {
    const [, monthA] = a.date.split("/");
    const [, monthB] = b.date.split("/");

    const isEurope = true;

    const weightA = getSeasonMonthWeight(monthA, isEurope);
    const weightB = getSeasonMonthWeight(monthB, isEurope);

    return weightA - weightB;
  });

  const dataPoints: ChartDataPoint[] = [];
  const arrivalDateShort = player.arrivalDate.split(" - ")[0];

  const hasRecruitmentEvent = player.evolutionHistory.some(
    ({ description }) =>
      description === "Jogador recrutado para a categoria de base.",
  );

  dataPoints.push({
    label: arrivalDateShort,
    value: sortedHistory[0].oldValue,
    title: "Valor Inicial",
    desc: hasRecruitmentEvent
      ? "Registrado na chegada do atleta."
      : "Iniciou com este valor.",
  });

  sortedHistory.forEach((item) => {
    dataPoints.push({
      label: item.date.substring(0, 5),
      value: item.newValue,
      title: "Evolução",
      desc: `Mudou de ${item.oldValue || "--"} para ${item.newValue}`,
    });
  });

  return dataPoints;
};
