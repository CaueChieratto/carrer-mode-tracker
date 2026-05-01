import { Players } from "../../../../common/interfaces/playersInfo/players";

export const POSITION_ORDER = [
  "ATA",
  "PD",
  "PE",
  "MD",
  "MEI",
  "MC",
  "ME",
  "VOL",
  "LD",
  "ZAG",
  "LE",
  "GOL",
];

export const sortPlayers = (
  players: Players[],
  criteria: string,
  isAsc: boolean,
): Players[] => {
  if (criteria === "Ordenar por padrão" || criteria === "Padrão")
    return players;

  return [...players].sort((a, b) => {
    let result = 0;

    switch (criteria) {
      case "Ordenar por posição": {
        const indexA = POSITION_ORDER.indexOf(String(a.position));
        const indexB = POSITION_ORDER.indexOf(String(b.position));

        const weightA = indexA !== -1 ? indexA : 999;
        const weightB = indexB !== -1 ? indexB : 999;

        result = weightA - weightB;
        break;
      }
      case "Ordenar por número da camisa":
        result = Number(a.shirtNumber) - Number(b.shirtNumber);
        break;
      case "Ordenar por idade":
        result = a.age - b.age;
        break;
      case "Ordenar por salário":
        result = a.salary - b.salary;
        break;
      case "Ordenar por valor de mercado":
        result = a.playerValue - b.playerValue;
        break;
      case "Ordenar por tempo de contrato":
        result = a.contractTime - b.contractTime;
        break;
      default:
        return 0;
    }

    return isAsc ? -result : result;
  });
};
