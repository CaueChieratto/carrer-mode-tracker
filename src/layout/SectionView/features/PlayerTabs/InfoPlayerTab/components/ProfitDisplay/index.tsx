import React from "react";
import { formatDisplayValue } from "../../../../../../../common/utils/FormatValue";
import Styles from "../../InfoPlayerTab.module.css";

type ProfitDisplayProps = {
  buyValue?: number;
  sellValue?: number;
  playerValue?: number;
  salary?: number;
  contractTime?: number;
  textOne: string;
  textTwo: string;
  textTree: string;
  isProfit?: boolean;
  currency?: string;
};

const ProfitDisplay: React.FC<ProfitDisplayProps> = ({
  buyValue = 0,
  sellValue = 0,
  playerValue = 0,
  salary = 0,
  contractTime = 0,
  textOne,
  textTwo,
  textTree,
  isProfit,
  currency,
}) => {
  const profit = sellValue - buyValue;

  return (
    <div className={Styles.profit_container}>
      <div className={Styles.contents}>
        <h1 className={Styles.info}>{textOne}</h1>
        <h2
          className={Styles.value}
          style={{ color: isProfit ? "#0bb32aff" : "var(--color-quaternary)" }}
        >
          {isProfit
            ? formatDisplayValue(sellValue, currency)
            : formatDisplayValue(playerValue, currency)}
        </h2>
      </div>

      {isProfit && <span className={Styles.operator}>-</span>}

      <div className={Styles.contents}>
        <h1 className={Styles.info}>{textTwo}</h1>
        <h2
          className={Styles.value}
          style={{ color: isProfit ? "#c81419ff" : "var(--color-quaternary)" }}
        >
          {isProfit
            ? formatDisplayValue(buyValue, currency)
            : formatDisplayValue(salary, currency)}
        </h2>
      </div>

      {isProfit && <span className={Styles.operator}>=</span>}

      <div className={Styles.contents}>
        <h1 className={Styles.info}>{textTree}</h1>
        <h2
          className={Styles.value}
          style={{
            color: isProfit
              ? profit >= 0
                ? "#0bb32aff"
                : "#c81419ff"
              : "var(--color-quaternary)",
          }}
        >
          {isProfit
            ? formatDisplayValue(Math.abs(profit), currency)
            : contractTime}
        </h2>
      </div>
    </div>
  );
};

export default ProfitDisplay;
