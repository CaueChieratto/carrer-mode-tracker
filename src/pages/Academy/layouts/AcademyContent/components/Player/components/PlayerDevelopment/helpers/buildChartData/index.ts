import { PlayerData, ChartDataPoint } from "../../types";
import { Career } from "../../../../../../../../../../common/interfaces/Career";
import { isEuropeanSeason } from "../../../../../../utils/isEuropeanSeason";
import { getSeasonMonthWeight } from "../../utils/getSeasonMonthWeight";

const formatToDDMMYY = (dateStr: string, isEurope: boolean) => {
  if (!dateStr) return "";

  if (dateStr.includes(" - ")) {
    const [datePart, seasonPart] = dateStr.split(" - ");
    const [d, m] = datePart.split("/");
    let yearStr = "";
    if (seasonPart.includes("/")) {
      const [startYY, endYY] = seasonPart.split("/");
      yearStr = isEurope && Number(m) < 7 ? endYY : startYY;
    } else {
      yearStr = seasonPart.slice(-2);
    }
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${yearStr}`;
  }

  if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    let y = parts[2] || new Date().getFullYear().toString();
    if (y.length === 4) y = y.slice(-2);
    return `${d}/${m}/${y}`;
  }

  return dateStr;
};

export const buildChartData = (
  player: PlayerData | undefined | null,
  currentAttribute: string,
  career: Career,
): ChartDataPoint[] => {
  if (!player?.evolutionHistory || !player.arrivalDate) return [];

  const history = player.evolutionHistory.filter(
    (h) => h.changedAttribute === currentAttribute,
  );

  if (history.length === 0) return [];

  const isEurope = isEuropeanSeason(career);

  const getSortingValues = (dateStr: string) => {
    let day = 1,
      month = 1,
      year = 2000;

    if (dateStr.includes(" - ")) {
      const [datePart, seasonPart] = dateStr.split(" - ");
      const [d, m] = datePart.split("/");
      day = Number(d);
      month = Number(m);
      if (seasonPart.includes("/")) {
        const [startYY, endYY] = seasonPart.split("/");
        year =
          isEurope && month < 7 ? 2000 + Number(endYY) : 2000 + Number(startYY);
      } else {
        year = Number(seasonPart);
      }
    } else if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      day = Number(parts[0]);
      month = Number(parts[1]);
      year = Number(parts[2] || new Date().getFullYear());
      if (year < 100) year += 2000;
    }

    const seasonYear = isEurope && month < 7 ? year - 1 : year;
    const weight = getSeasonMonthWeight(month, isEurope);

    return { seasonYear, weight, day };
  };

  const sortedHistory = [...history].sort((a, b) => {
    const valA = getSortingValues(a.date);
    const valB = getSortingValues(b.date);

    if (valA.seasonYear !== valB.seasonYear) {
      return valA.seasonYear - valB.seasonYear;
    }
    if (valA.weight !== valB.weight) {
      return valA.weight - valB.weight;
    }
    return valA.day - valB.day;
  });

  const dataPoints: ChartDataPoint[] = [];
  const hasRecruitmentEvent = player.evolutionHistory.some(
    ({ description }) =>
      description === "Jogador recrutado para a categoria de base.",
  );

  dataPoints.push({
    label: formatToDDMMYY(player.arrivalDate, isEurope),
    value: sortedHistory[0].oldValue,
    title: "Valor Inicial",
    desc: hasRecruitmentEvent
      ? "Registrado na chegada do atleta."
      : "Iniciou com este valor.",
  });

  sortedHistory.forEach((item) => {
    dataPoints.push({
      label: formatToDDMMYY(item.date, isEurope),
      value: item.newValue,
      title: "Evolução",
      desc: `Mudou de ${item.oldValue || "--"} para ${item.newValue}`,
    });
  });

  return dataPoints;
};
