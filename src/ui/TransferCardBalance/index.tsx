import Card from "../Card";
import Styles from "./TransferCardBalance.module.css";
import Titles from "../../components/GeneralTab/GeneralTab.module.css";
import { ClubData } from "../../common/interfaces/club/clubData";
import { formatDisplayValue } from "../../common/utils/FormatValue";

type TransferCardBalanceProps = {
  season: ClubData;
};

const TransferCardBalance = ({ season }: TransferCardBalanceProps) => {
  const signings = season.players.filter(
    (p) => p.buy && p.contract && p.contract.length > 0
  );
  const sales = season.players.filter(
    (p) => p.sell && p.contract && p.contract.length > 0
  );

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
