import Card from "../../../../ui/Card";
import Titles from "../../GeneralTab.module.css";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import Load from "../../../Load";
import { Career } from "../../../../common/interfaces/Career";
import TransferInfo from "./components/TransferInfo";
import { useTransferData } from "./hooks/UseTransferData";

type TransfersCardSummaryProps = {
  season: ClubData;
  career: Career;
  onOpenTransfers?: (type: "arrivals" | "exit") => void;
};

const TransfersCardSummary = ({
  season,
  career,
  onOpenTransfers,
}: TransfersCardSummaryProps) => {
  const { arrivals, departures } = useTransferData(career, season);

  if (!career) {
    return <Load />;
  }

  const content = [
    {
      info: "Chegadas",
      color: "#c81419",
      players: arrivals.map((p) => p.name),
      onClick: () => onOpenTransfers?.("arrivals"),
    },
    {
      info: "Saídas",
      color: "#0bb32a",
      players: departures.map((p) => p.name),
      onClick: () => onOpenTransfers?.("exit"),
    },
  ];

  return (
    <Card className={Titles.card}>
      <div className={Titles.container_card}>
        <h1 className={Titles.h1}>Transferências</h1>
        <div className={Titles.container_info}>
          {content.map((item) => (
            <TransferInfo
              key={item.info}
              title={item.info}
              color={item.color}
              players={item.players}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TransfersCardSummary;
