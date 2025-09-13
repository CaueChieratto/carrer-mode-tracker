import { useMemo } from "react";
import { ClubData } from "../../../interfaces/club/clubData";
import { formatDisplayValue } from "../../../utils/FormatValue";

export const useSummaryData = (season: ClubData) => {
  const activePlayers = useMemo(
    () => season.players.filter((player) => !player.sell),
    [season.players]
  );

  const totalPlayers = activePlayers.length;

  const averageAge = useMemo(
    () =>
      totalPlayers > 0
        ? (
            activePlayers.reduce((acc, player) => acc + player.age, 0) /
            totalPlayers
          ).toFixed(1)
        : "0.0",
    [activePlayers, totalPlayers]
  );

  const weeklySalaries = useMemo(
    () => activePlayers.reduce((acc, player) => acc + player.salary, 0),
    [activePlayers]
  );

  const squadValue = useMemo(
    () => activePlayers.reduce((acc, player) => acc + player.playerValue, 0),
    [activePlayers]
  );

  const content = useMemo(
    () => [
      { info: "Total de jogadores", number: totalPlayers },
      { info: "Média de idade", number: averageAge },
      {
        info: "Salários Semanais",
        number: formatDisplayValue(weeklySalaries),
      },
      {
        info: "Valor do plantel",
        number: formatDisplayValue(squadValue),
      },
    ],
    [totalPlayers, averageAge, weeklySalaries, squadValue]
  );

  return { content };
};
