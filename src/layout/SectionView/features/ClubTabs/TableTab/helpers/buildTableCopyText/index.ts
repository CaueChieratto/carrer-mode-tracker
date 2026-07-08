import { TableRowData } from "../../../../../../../common/interfaces/Table";

export const buildTableCopyText = (
  tableData: TableRowData[],
  activeMode: string,
): string => {
  return tableData
    .map((row) => {
      const goalDiffStr = row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff;

      if (activeMode === "Completo") {
        return `${row.position}º ${row.name} | ${row.points} Pts | ${row.played} J | ${row.won} V | ${row.drawn} E | ${row.lost} D | ${goalDiffStr} SG | ${row.goalsFor}:${row.goalsAgainst}`;
      }

      return `${row.position}º ${row.name} | ${row.points} Pts | ${row.played} J | ${goalDiffStr} SG`;
    })
    .join("\n");
};
