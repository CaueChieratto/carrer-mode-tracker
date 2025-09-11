import Card from "../Card";
import Titles from "../../components/GeneralTab/GeneralTab.module.css";
import Styles from "./TransfersCardSummary.module.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ClubData } from "../../common/interfaces/club/clubData";
import { useParams } from "react-router-dom";
import { useSeasonData } from "../../common/hooks/Seasons/UseSeasonData";
import { getSeasonDateRange } from "../../common/utils/GetSeasonDateRange";
import Load from "../../components/Load";

type TransfersCardSummaryProps = {
  season: ClubData;
  onOpenTransfers?: (type: "arrivals" | "exit") => void;
};

const TransfersCardSummary = ({
  season,
  onOpenTransfers,
}: TransfersCardSummaryProps) => {
  const { careerId } = useParams<{ careerId: string }>();
  const { career } = useSeasonData(careerId, season.id);

  if (!career) {
    return <Load />;
  }

  const { startDate, endDate } = getSeasonDateRange(
    season.seasonNumber,
    career.createdAt,
    career.nation
  );

  const arrivals = season.players
    .filter((p) => {
      const arrivalDate = p.contract?.[p.contract.length - 1]?.dataArrival;
      return (
        p.buy &&
        arrivalDate &&
        new Date(arrivalDate) >= startDate &&
        new Date(arrivalDate) <= endDate
      );
    })
    .sort(
      (a, b) =>
        new Date(b.contract![b.contract!.length - 1].dataArrival!).getTime() -
        new Date(a.contract![a.contract!.length - 1].dataArrival!).getTime()
    )
    .slice(0, 3);

  const departures = season.players
    .filter((p) => {
      const exitDate = p.contract?.[p.contract.length - 1]?.dataExit;
      return (
        p.sell &&
        exitDate &&
        new Date(exitDate) >= startDate &&
        new Date(exitDate) <= endDate
      );
    })
    .sort(
      (a, b) =>
        new Date(b.contract![b.contract!.length - 1].dataExit!).getTime() -
        new Date(a.contract![a.contract!.length - 1].dataExit!).getTime()
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
