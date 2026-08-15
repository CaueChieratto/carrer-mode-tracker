import Styles from "./StatDisplay.module.css";

type StatDisplayProps = {
  label: string;
  playerName?: string;
  value: string | number;
};

export const StatDisplay = ({ label, playerName, value }: StatDisplayProps) => {
  if (!playerName || !value) {
    return null;
  }
  return (
    <div className={Styles.container_stats}>
      <h4 className={Styles.h4}>{label}</h4>
      <p className={Styles.p}>
        <span>{playerName}</span>: <span>{value}</span>
      </p>
    </div>
  );
};
