import Styles from "./StatsSummary.module.css";

const StatsSummary = () => {
  return (
    <div className={Styles.container_stats}>
      <h4 className={Styles.h4}>Mais Jogos</h4>
      <p className={Styles.p}>
        <span>F. Ibanez</span>: <span>667</span>
      </p>
    </div>
  );
};

export default StatsSummary;
