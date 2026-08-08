import { FaTrophy } from "react-icons/fa";
import { UseRatingColor } from "../../../../../../../../../../common/hooks/Colors/GetOverallColor";
import { TotalStats } from "../../types";
import { StatCard } from "../StatCard";
import { GENERAL_STATS_CARDS } from "../../constants/statsCards";
import Styles from "./GeneralStatsFooter.module.css";
import { useActiveStatCard } from "../../contexts/useActiveStatCard";

type GeneralStatsFooterProps = {
  totalStats: TotalStats;
};

export const GeneralStatsFooter = ({ totalStats }: GeneralStatsFooterProps) => {
  const globalRatingColor = UseRatingColor(totalStats.ratingRawNumber);
  const { activeCardId, toggleActiveCard } = useActiveStatCard();

  return (
    <div className={Styles.footerSection}>
      <h2 className={Styles.footerTitle}>Estatísticas Gerais da Temporada</h2>

      <div className={Styles.statsGrid}>
        {GENERAL_STATS_CARDS.map(
          ({ id, icon: Icon, dataKey, label, useColor }) => (
            <StatCard
              key={id}
              icon={<Icon />}
              value={totalStats[dataKey]}
              label={label}
              customColor={useColor ? globalRatingColor : undefined}
              isActive={activeCardId === `general-${id}`}
              onClick={() => toggleActiveCard(`general-${id}`)}
            />
          ),
        )}
      </div>

      <StatCard
        variant="title"
        icon={<FaTrophy />}
        value={totalStats.tournamentsWon}
        label="Total de Títulos na Temporada"
        isActive={activeCardId === "general-titles"}
        onClick={() => toggleActiveCard("general-titles")}
      />
    </div>
  );
};
