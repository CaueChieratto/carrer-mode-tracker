import Styles from "./CircularStatRow.module.css";
import { CircularProgress } from "./components/CircularProgress";
import { getPercentage } from "./helpers/getCircularStatData";

export type CircularStatRowProps = {
  label: string;
  homeSuccess: number;
  homeTotal: number;
  awaySuccess: number;
  awayTotal: number;
};

export const CircularStatRow = ({
  label,
  homeSuccess,
  homeTotal,
  awaySuccess,
  awayTotal,
}: CircularStatRowProps) => {
  const homePercentage = getPercentage({
    success: homeSuccess,
    total: homeTotal,
  });

  const awayPercentage = getPercentage({
    success: awaySuccess,
    total: awayTotal,
  });

  const homeWins = homePercentage >= awayPercentage;
  const awayWins = awayPercentage >= homePercentage;

  return (
    <div className={Styles.circular_stat_row}>
      <CircularProgress
        percentage={homePercentage}
        colorClass={homeWins ? Styles.color_home : Styles.color_home_faded}
      />

      <span className={Styles.circular_label}>{label}</span>

      <CircularProgress
        percentage={awayPercentage}
        colorClass={awayWins ? Styles.color_away : Styles.color_away_faded}
      />
    </div>
  );
};
