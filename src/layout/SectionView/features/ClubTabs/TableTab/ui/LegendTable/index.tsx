import Styles from "./LegendTable.module.css";
import TableStyles from "../../TableTab.module.css";

export const LegendTable = () => {
  return (
    <div className={Styles.legend_container}>
      <div className={Styles.legend_item}>
        <span
          className={`${Styles.legend_dot} ${TableStyles.pos_first}`}
        ></span>
        Campeão
      </div>
      <div className={Styles.legend_item}>
        <span
          className={`${Styles.legend_dot} ${TableStyles.pos_champions}`}
        ></span>
        Liga dos Campeões
      </div>
      <div className={Styles.legend_item}>
        <span
          className={`${Styles.legend_dot} ${TableStyles.pos_europa}`}
        ></span>
        Liga Europeia UEFA
      </div>
      <div className={Styles.legend_item}>
        <span
          className={`${Styles.legend_dot} ${TableStyles.pos_conference}`}
        ></span>
        Conference League
      </div>
      <div className={Styles.legend_item}>
        <span
          className={`${Styles.legend_dot} ${TableStyles.pos_relegation}`}
        ></span>
        Rebaixamento
      </div>
    </div>
  );
};
