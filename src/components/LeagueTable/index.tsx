import { ClubData } from "../../common/interfaces/club/clubData";
import Card from "../../ui/Card";
import { ContainerClubContent } from "../ContainerClubContent";
import { LeagueTableHeader } from "./components/LeagueTableHeader";
import { LeagueTableRow } from "./components/LeagueTableRow";
import { buildLeagueTable } from "./helpers";
import Styles from "./LeagueTable.module.css";

type LeagueTableProps = {
  season: ClubData;
};

export const LeagueTable = ({ season }: LeagueTableProps) => {
  const table = buildLeagueTable(season.matches ?? []);

  return (
    <ContainerClubContent>
      <Card className={Styles.card}>
        <LeagueTableHeader />
        {table.map((team, index) => (
          <LeagueTableRow key={team.name} team={team} position={index + 1} />
        ))}
      </Card>
    </ContainerClubContent>
  );
};
