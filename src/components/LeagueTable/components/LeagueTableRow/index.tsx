import Styles from "./LeagueTableRow.module.css";
import { ContainerTableTeam } from "../../../ContainerTableTeam";
import { TABLE_COLUMNS } from "../../constants";
import { getGoalDiffLabel, getPositionColor } from "../../helpers";
import { TeamStats } from "../../types";

type LeagueTableRowProps = {
  team: TeamStats;
  position: number;
};

export const LeagueTableRow = ({ team, position }: LeagueTableRowProps) => {
  const diffLabel = getGoalDiffLabel(team.goalsFor, team.goalsAgainst);

  return (
    <ContainerTableTeam key={team.name} columns={TABLE_COLUMNS}>
      <span className={Styles.position_cell}>
        <span
          className={Styles.position_badge}
          style={{ backgroundColor: getPositionColor(position) }}
        >
          {position}
        </span>
      </span>
      <span className={Styles.team_name}>{team.name}</span>
      <span className={Styles.cell}>{team.played}</span>
      <span className={Styles.cell}>{team.wins}</span>
      <span className={Styles.cell}>{team.draws}</span>
      <span className={Styles.cell}>{team.losses}</span>
      <span className={Styles.cell}>{diffLabel}</span>
      <span className={Styles.cell}>
        {team.goalsFor}:{team.goalsAgainst}
      </span>
      <span className={Styles.cell}>{team.points}</span>
    </ContainerTableTeam>
  );
};
