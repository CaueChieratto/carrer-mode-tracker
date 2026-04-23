import { Career } from "../../common/interfaces/Career";
import { ClubData } from "../../common/interfaces/club/clubData";
import CompetitionsCard from "./components/CompetitionsCard";
import MatchStatsCard from "./components/MatchStatsCard";
import SummaryCard from "./components/SummaryCard";
import TransferCardBalance from "./components/TransferCardBalance";
import TransfersCardSummary from "./components/TransfersCardSummary";

type GeneralTabProps = {
  season: ClubData;
  career: Career;
  onOpenTransfers?: (type: "arrivals" | "exit") => void;
};

const GeneralTab = ({ season, onOpenTransfers, career }: GeneralTabProps) => {
  return (
    <>
      <SummaryCard season={season} />

      {season.matches && season.matches?.length > 0 && (
        <MatchStatsCard season={season} career={career} />
      )}

      <TransfersCardSummary
        season={season}
        career={career}
        onOpenTransfers={onOpenTransfers}
      />

      <TransferCardBalance season={season} career={career} />

      {season.leagues && season.leagues?.length > 0 && (
        <CompetitionsCard season={season} />
      )}
    </>
  );
};
export default GeneralTab;
