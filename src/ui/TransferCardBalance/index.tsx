import Card from "../Card";
import Styles from "./TransferCardBalance.module.css";
import Titles from "../../components/GeneralTab/GeneralTab.module.css";
import { ClubData } from "../../common/interfaces/club/clubData";
import Load from "../../components/Load";
import { Career } from "../../common/interfaces/Career";
import BalanceItem from "../../components/BalanceItem";
import { useTransferBalance } from "../../common/hooks/Transfers/UseTransferBalance";

type TransferCardBalanceProps = {
  season: ClubData;
  career: Career;
};

const TransferCardBalance = ({ season, career }: TransferCardBalanceProps) => {
  const { content } = useTransferBalance(career, season);

  if (!career) {
    return <Load />;
  }

  return (
    <Card className={Titles.card}>
      <div className={Titles.container_card}>
        <h1 className={Titles.h1}>Balanço de transferências</h1>
        <div className={Styles.container_info}>
          {content.map((item) => (
            <BalanceItem
              key={item.name}
              name={item.name}
              value={item.value}
              number={item.number}
              color={item.color}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TransferCardBalance;
