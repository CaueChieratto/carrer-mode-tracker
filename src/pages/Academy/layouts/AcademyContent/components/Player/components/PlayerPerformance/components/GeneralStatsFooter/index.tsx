import { FaTrophy } from "react-icons/fa";
import { MdSportsHandball } from "react-icons/md";
import { UseRatingColor } from "../../../../../../../../../../common/hooks/Colors/GetOverallColor";
import { TotalStats } from "../../types";
import { StatCard } from "../StatCard";
import { GENERAL_STATS_CARDS } from "../../constants/statsCards";
import Styles from "./GeneralStatsFooter.module.css";
import { useActiveStatCard } from "../../contexts/useActiveStatCard";

type GeneralStatsFooterProps = {
  totalStats: TotalStats;
  isGeral: boolean;
};

export const GeneralStatsFooter = ({
  totalStats,
  isGeral,
}: GeneralStatsFooterProps) => {
  const globalRatingColor = UseRatingColor(totalStats.ratingRawNumber);
  const { activeCardId, toggleActiveCard } = useActiveStatCard();

  return (
    <div className={Styles.footerSection}>
      <h2 className={Styles.footerTitle}>
        {isGeral ? "Estatísticas Gerais" : "Estatísticas Gerais da Temporada"}
      </h2>
      <div className={Styles.statsGrid}>
        {GENERAL_STATS_CARDS.map(
          ({ id, icon: Icon, dataKey, label, useColor }) => {
            let displayIcon = <Icon />;
            let displayValue = totalStats[dataKey as keyof TotalStats];
            let displayLabel = label;

            if (id === "total-goals" && totalStats.isGoleiro) {
              displayIcon = <MdSportsHandball />;
              displayValue = totalStats.totalDefesas;
              displayLabel = "Defesas Totais";
            }

            return (
              <StatCard
                key={id}
                icon={displayIcon}
                value={displayValue as string | number}
                label={displayLabel}
                customColor={useColor ? globalRatingColor : undefined}
                isActive={activeCardId === `general-${id}`}
                onClick={() => toggleActiveCard(`general-${id}`)}
              />
            );
          },
        )}
      </div>
      <StatCard
        variant="title"
        icon={<FaTrophy />}
        value={totalStats.tournamentsWon}
        label={isGeral ? "Total de Títulos" : "Total de Títulos na Temporada"}
        isActive={activeCardId === "general-titles"}
        onClick={() => toggleActiveCard("general-titles")}
      />
    </div>
  );
};
