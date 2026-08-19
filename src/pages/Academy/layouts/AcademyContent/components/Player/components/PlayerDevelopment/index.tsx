import { useState, useMemo } from "react";
import CustomSelect from "../../../../../../../../components/CustomSelect";
import { useAcademyContext } from "../../../../../contexts/AcademyContext/hooks/useAcademyContext";
import Styles from "./PlayerDevelopment.module.css";
import { PlayerData } from "./types";
import { ATTRIBUTE_MAP, METRIC_OPTIONS, NUMERIC_ATTRIBUTES } from "./constants";
import { buildChartData } from "./helpers/buildChartData";
import { DevelopmentChart } from "./components/DevelopmentChart";

export const PlayerDevelopment = () => {
  const { selectedPlayer, career } = useAcademyContext();
  const [selectedMetric, setSelectedMetric] = useState("Overall");

  const currentAttribute = ATTRIBUTE_MAP[selectedMetric];
  const isNumeric = NUMERIC_ATTRIBUTES.includes(currentAttribute);

  const chartData = useMemo(() => {
    return buildChartData(
      selectedPlayer as unknown as PlayerData,
      currentAttribute,
      career,
    );
  }, [selectedPlayer, currentAttribute, career]);

  return (
    <div className={`${Styles.mobileContainer} swiper-no-swiping`}>
      <div className={Styles.filterSection}>
        <CustomSelect
          name="metric-select"
          options={METRIC_OPTIONS}
          value={selectedMetric}
          placeholder="Selecione a métrica"
          onChange={(e) => setSelectedMetric(e.target.value)}
        />
      </div>

      {chartData.length > 0 ? (
        <DevelopmentChart
          chartData={chartData}
          currentAttribute={currentAttribute}
          isNumeric={isNumeric}
        />
      ) : (
        <div className={Styles.emptyStateWrapper}>
          <div className={Styles.emptyState}>
            <p>
              Nenhum dado registrado para <strong>{selectedMetric}</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
