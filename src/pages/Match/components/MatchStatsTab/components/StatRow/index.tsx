import Styles from "./StatRow.module.css";
import { getStatRowData } from "../../helpers/getStatRowData";
import { formatStatValue } from "../../helpers/formatStatValue";

export type StatRowProps = {
  label: string;
  home: number;
  away: number;
  info?: boolean;
  reverseWinner?: boolean;
  isPercentage?: boolean;
  suffix?: string;
};

export const StatRow = ({
  label,
  home,
  away,
  info,
  reverseWinner,
  isPercentage,
  suffix,
}: StatRowProps) => {
  const { homeWidth, awayWidth, homeWins, awayWins } = getStatRowData({
    home,
    away,
    reverseWinner,
  });

  const displayHome = formatStatValue({
    value: home,
    isPercentage,
    suffix,
  });

  const displayAway = formatStatValue({
    value: away,
    isPercentage,
    suffix,
  });

  return (
    <div className={Styles.stat_row}>
      <div className={Styles.stat_header}>
        <span className={Styles.stat_value}>{displayHome}</span>

        <div
          className={`${Styles.label_wrapper} ${info ? Styles.label_info : ""}`}
        >
          {label}
        </div>

        <span className={Styles.stat_value}>{displayAway}</span>
      </div>

      <div className={Styles.bars_container}>
        <div className={`${Styles.bar_half} ${Styles.bar_half_home}`}>
          <div
            className={`${Styles.bar_fill} ${
              homeWins ? Styles.bg_home : Styles.bg_home_faded
            }`}
            style={{ width: `${homeWidth}%` }}
          />
        </div>

        <div className={`${Styles.bar_half} ${Styles.bar_half_away}`}>
          <div
            className={`${Styles.bar_fill} ${
              awayWins ? Styles.bg_away : Styles.bg_away_faded
            }`}
            style={{ width: `${awayWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
};
