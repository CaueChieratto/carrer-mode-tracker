import { ReactNode } from "react";
import Styles from "../../TableTab.module.css";
import { TableRowData } from "../../../../../../../common/interfaces/Table";

export type TableColumn = {
  key: string;
  label: string;
  show: boolean;
  render: (row: TableRowData) => ReactNode;
};

const formatGoalDiff = (diff: number) => (diff > 0 ? `+${diff}` : diff);

export const buildTableColumns = (activeMode: string): TableColumn[] => [
  {
    key: "played",
    label: "J",
    show: true,
    render: (row) => row.played,
  },
  {
    key: "won",
    label: "V",
    show: activeMode === "Completo",
    render: (row) => row.won,
  },
  {
    key: "drawn",
    label: "E",
    show: activeMode === "Completo",
    render: (row) => row.drawn,
  },
  {
    key: "lost",
    label: "D",
    show: activeMode === "Completo",
    render: (row) => row.lost,
  },
  {
    key: "goalDiff",
    label: "SG",
    show: true,
    render: (row) => (
      <span
        className={`${Styles.goals_diff} ${
          row.goalDiff > 0
            ? Styles.positive
            : row.goalDiff < 0
              ? Styles.negative
              : ""
        }`}
      >
        {formatGoalDiff(row.goalDiff)}
      </span>
    ),
  },
  {
    key: "points",
    label: "P",
    show: true,
    render: (row) => <strong>{row.points}</strong>,
  },
  {
    key: "goals",
    label: "GLS",
    show: activeMode === "Completo",
    render: (row) => `${row.goalsFor}:${row.goalsAgainst}`,
  },
];
