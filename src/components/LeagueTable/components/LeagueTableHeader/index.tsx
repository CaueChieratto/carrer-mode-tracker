import { ContainerTableTeam } from "../../../ContainerTableTeam";
import { TABLE_COLUMNS, LEAGUE_TABLE_HEADERS } from "../../constants";
import Styles from "./LeagueTableHeader.module.css";

export const LeagueTableHeader = () => (
  <ContainerTableTeam columns={TABLE_COLUMNS}>
    {LEAGUE_TABLE_HEADERS.map((h) => (
      <span key={h} className={Styles.header_cell}>
        {h}
      </span>
    ))}
  </ContainerTableTeam>
);
