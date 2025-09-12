import Card from "../Card";
import Styles from "./TransferCardBalance.module.css";
import Titles from "../../components/GeneralTab/GeneralTab.module.css";
import { ClubData } from "../../common/interfaces/club/clubData";
import { formatDisplayValue } from "../../common/utils/FormatValue";
import { getSeasonDateRange } from "../../common/utils/GetSeasonDateRange";
import Load from "../../components/Load";
import { Career } from "../../common/interfaces/Career";
import { useLocation } from "react-router-dom";

type TransferCardBalanceProps = {
  season: ClubData;
  career: Career;
};

const TransferCardBalance = ({ season, career }: TransferCardBalanceProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  if (!career) {
    return <Load />;
  }

  let signings, sales;

  if (isGeralPage) {
    const allPlayers = career.clubData.flatMap((s) => s.players);
    signings = allPlayers.filter((p) => p.buy);
    sales = allPlayers.filter((p) => p.sell);
  } else {
    const { startDate, endDate } = getSeasonDateRange(
      season.seasonNumber,
      career.createdAt,
      career.nation
    );

    signings = season.players.filter((p) => {
      const arrivalDate = p.contract?.[p.contract.length - 1]?.dataArrival;
      return (
        p.buy &&
        arrivalDate &&
        new Date(arrivalDate) >= startDate &&
        new Date(arrivalDate) <= endDate
      );
    });

    sales = season.players.filter((p) => {
      const exitDate = p.contract?.[p.contract.length - 1]?.dataExit;
      return (
        p.sell &&
        exitDate &&
        new Date(exitDate) >= startDate &&
        new Date(exitDate) <= endDate
      );
    });
  }

  const totalSpent = signings.reduce((acc, player) => {
    const contract = player.contract[player.contract.length - 1];
    return (
      acc + (typeof contract.buyValue === "number" ? contract.buyValue : 0)
    );
  }, 0);

  const totalEarned = sales.reduce((acc, player) => {
    const contract = player.contract[player.contract.length - 1];
    return (
      acc + (typeof contract.sellValue === "number" ? contract.sellValue : 0)
    );
  }, 0);

  const profit = totalEarned - totalSpent;

  const content = [
    {
      value: formatDisplayValue(totalSpent),
      name: "Contratações: ",
      number: signings.length,
      color: "#c81419",
    },
    {
      value: formatDisplayValue(totalEarned),
      name: "Vendas: ",
      number: sales.length,
      color: "#0bb32a",
    },
    {
      value: formatDisplayValue(Math.abs(profit)),
      name: profit >= 0 ? "Lucro" : "Perda",
      color: profit >= 0 ? "#0bb32a" : "#c81419",
    },
  ];

  return (
    <Card className={Titles.card}>
      <div className={Titles.container_card}>
        <h1 className={Titles.h1}>Balanço de transferências</h1>
        <div className={Styles.container_info}>
          {content.map((item) => (
            <div className={Styles.infos} key={item.name}>
              <h2 className={Styles.h2}>
                {item.name}
                {item.number !== undefined && (
                  <span className={Styles.span}>{item.number}</span>
                )}
              </h2>
              <h3 className={Styles.h3} style={{ color: item.color }}>
                {item.value}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TransferCardBalance;
