import { Players } from "../../../../common/interfaces/playersInfo/players";

export const sortPlayers = (
  players: Players[],
  criteria: string,
  isAsc: boolean,
): Players[] => {
  if (criteria === "Padrão") return players;

  return [...players].sort((a, b) => {
    let result = 0;

    switch (criteria) {
      case "Posição":
        result = String(a.position).localeCompare(String(b.position));
        break;

      case "Número da Camisa":
        result = Number(a.shirtNumber) - Number(b.shirtNumber);
        break;

      case "Idade":
        result = a.age - b.age;
        break;

      case "Salário":
        result = a.salary - b.salary;
        break;

      case "Valor de Mercado":
        result = a.playerValue - b.playerValue;
        break;

      case "Tempo de Contrato":
        result = a.contractTime - b.contractTime;
        break;

      default:
        return 0;
    }

    return isAsc ? -result : result;
  });
};
