import Card from "../Card";
import Titles from "../../components/GeneralTab/GeneralTab.module.css";
import Styles from "./TransfersCardSummary.module.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ClubData } from "../../common/interfaces/club/clubData";

type TransfersCardSummaryProps = {
  season: ClubData;
  onOpenTransfers?: (type: "arrivals" | "exit") => void;
};

const TransfersCardSummary = ({
  season,
  onOpenTransfers,
}: TransfersCardSummaryProps) => {
  const arrivals = season.players
    .filter((p) => p.buy && p.contract?.[0]?.dataArrival)
    .sort(
      (a, b) =>
        new Date(b.contract![0].dataArrival!).getTime() -
        new Date(a.contract![0].dataArrival!).getTime()
    )
    .slice(0, 3);

  const departures = season.players
    .filter((p) => p.sell && p.contract?.[0]?.dataExit)
    .sort(
      (a, b) =>
        new Date(b.contract![0].dataExit!).getTime() -
        new Date(a.contract![0].dataExit!).getTime()
    )
    .slice(0, 3);

  const content = [
    {
      info: "Chegadas",
      icon: <IoMdInformationCircleOutline />,
      color: "#c81419",
      players: arrivals.map((p) => p.name),
      onClick: () => onOpenTransfers?.("arrivals"),
    },
    {
      info: "Saídas",
      icon: <IoMdInformationCircleOutline />,
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
            <div
              className={Styles.infos}
              key={item.info}
              onClick={item.onClick}
            >
              <div className={Styles.container} style={{ color: item.color }}>
                <h2 className={Styles.h2}>{item.info}</h2>
                <div className={Styles.icon}>{item.icon}</div>
              </div>
              <div className={Styles.players}>
                {item.players.map((player, index) => (
                  <div className={Styles.player} key={index}>
                    {player}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TransfersCardSummary;
