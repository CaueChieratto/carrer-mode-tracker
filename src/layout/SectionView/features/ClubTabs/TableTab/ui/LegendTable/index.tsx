import Styles from "./LegendTable.module.css";
import TableStyles from "../../TableTab.module.css";
import {
  TableRowData,
  QualificationZone,
} from "../../../../../../../common/interfaces/Table";

type LegendTableProps = {
  tableData: TableRowData[];
  isFirstDivision: boolean;
};

export const LegendTable = ({
  tableData,
  isFirstDivision,
}: LegendTableProps) => {
  const hasZone = (zone: QualificationZone) =>
    tableData.some((row) => row.zone === zone);

  const showPromotion = !isFirstDivision;
  const showPromotionPlayoff = !isFirstDivision;

  const showChampions = isFirstDivision || hasZone("champions");
  const showEuropa = isFirstDivision || hasZone("europa");
  const showConference = isFirstDivision || hasZone("conference");

  return (
    <div className={Styles.legend_container}>
      <div className={Styles.legend_item}>
        <span
          className={`${Styles.legend_dot} ${TableStyles.pos_first}`}
        ></span>
        Campeão
      </div>

      {showPromotion && (
        <div className={Styles.legend_item}>
          <span
            className={`${Styles.legend_dot} ${TableStyles.pos_promotion}`}
          ></span>
          Acesso
        </div>
      )}

      {showPromotionPlayoff && (
        <div className={Styles.legend_item}>
          <span
            className={`${Styles.legend_dot} ${TableStyles.pos_promotion_playoff}`}
          ></span>
          Play-off para Promoção
        </div>
      )}

      {showChampions && (
        <div className={Styles.legend_item}>
          <span
            className={`${Styles.legend_dot} ${TableStyles.pos_champions}`}
          ></span>
          Liga dos Campeões
        </div>
      )}

      {showEuropa && (
        <div className={Styles.legend_item}>
          <span
            className={`${Styles.legend_dot} ${TableStyles.pos_europa}`}
          ></span>
          Liga Europeia UEFA
        </div>
      )}

      {showConference && (
        <div className={Styles.legend_item}>
          <span
            className={`${Styles.legend_dot} ${TableStyles.pos_conference}`}
          ></span>
          Conference League
        </div>
      )}

      <div className={Styles.legend_item}>
        <span
          className={`${Styles.legend_dot} ${TableStyles.pos_relegation}`}
        ></span>
        Rebaixamento
      </div>
    </div>
  );
};
