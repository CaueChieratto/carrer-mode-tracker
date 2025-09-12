import { Career } from "../../common/interfaces/Career";
import { ClubData } from "../../common/interfaces/club/clubData";
import SummaryCard from "../../ui/SummaryCard";
import TransferCardBalance from "../../ui/TransferCardBalance";
import TransfersCardSummary from "../../ui/TransfersCardSummary";

type GeneralTabProps = {
  season: ClubData;
  career: Career;
  onOpenTransfers?: (type: "arrivals" | "exit") => void;
};

const GeneralTab = ({ season, onOpenTransfers }: GeneralTabProps) => {
  return (
    <>
      <SummaryCard season={season} />
      <TransfersCardSummary season={season} onOpenTransfers={onOpenTransfers} />
      <TransferCardBalance season={season} />
    </>
  );
};
export default GeneralTab;
