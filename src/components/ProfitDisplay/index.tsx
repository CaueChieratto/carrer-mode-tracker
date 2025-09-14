import React from "react";
import { formatDisplayValue } from "../../common/utils/FormatValue";
import Styles from "../InfoPlayerTab/InfoPlayerTab.module.css";

type ProfitDisplayProps = {
  buyValue: number;
  sellValue: number;
};

const ProfitDisplay: React.FC<ProfitDisplayProps> = ({
  buyValue,
  sellValue,
}) => {
  const profit = sellValue - buyValue;

  return (
    <div className={Styles.profit_container}>
      <div className={Styles.contents}>
        <h1 className={Styles.info}>Valor da venda</h1>
        <h2 className={Styles.value} style={{ color: "#0bb32aff" }}>
          {formatDisplayValue(sellValue)}
        </h2>
      </div>
      -
      <div className={Styles.contents}>
        <h1 className={Styles.info}>Valor da compra</h1>
        <h2 className={Styles.value} style={{ color: "#c81419ff" }}>
          {formatDisplayValue(buyValue)}
        </h2>
      </div>
      =
      <div className={Styles.contents}>
        <h1 className={Styles.info}>Lucro total</h1>
        <h2
          className={Styles.value}
          style={{ color: profit >= 0 ? "#0bb32aff" : "#c81419ff" }}
        >
          {formatDisplayValue(profit)}
        </h2>
      </div>
    </div>
  );
};

export default ProfitDisplay;
