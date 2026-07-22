import { Players } from "../../../../../../../common/interfaces/playersInfo/players";
import { formatDisplayValue } from "../../../../../../../common/utils/FormatValue";

export const buildSquadCopyText = (
  players: Players[],
  currency?: string,
): string => {
  return players
    .map((p) => {
      const salary = formatDisplayValue(p.salary, currency);
      const value = formatDisplayValue(p.playerValue, currency);

      const contract =
        p.contractTime <= 1
          ? `${p.contractTime} ano`
          : `${p.contractTime} anos`;
      return `${p.name}, ${p.position}, ${p.age} anos, ${p.nation}, Camisa ${p.shirtNumber}, ${value} de valor de mercado, ${salary} de salário semanal, ${contract} de contrato`;
    })
    .join("\n");
};
