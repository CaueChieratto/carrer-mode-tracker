import Styles from "./BalanceItem.module.css";

type BalanceItemProps = {
  name: string;
  value: string;
  number?: number;
  color: string;
};

const BalanceItem = ({ name, value, number, color }: BalanceItemProps) => (
  <div className={Styles.infos}>
    <h2 className={Styles.h2}>
      {name}
      {number !== undefined && <span className={Styles.span}>{number}</span>}
    </h2>
    <h3 className={Styles.h3} style={{ color }}>
      {value}
    </h3>
  </div>
);

export default BalanceItem;
