import { DashboardCard } from "../../components/Cards/DashboardCard";
import { DashboardCardConfig } from "../../config";
import Styles from "../../../AcademyContent/AcademyContent.module.css";

type DashboardGridViewProps = {
  dashboardCards: DashboardCardConfig[];
  setActiveCardIndex: (index: number) => void;
};

export const DashboardGridView = ({
  dashboardCards,
  setActiveCardIndex,
}: DashboardGridViewProps) => {
  return (
    <div className={Styles.dashboardGrid}>
      {dashboardCards.map((card, index) => (
        <DashboardCard
          key={card.id || index}
          Icon={card.Icon}
          title={card.title}
          actionText={card.actionText}
          onActionClick={() => setActiveCardIndex(index)}
          className={card.className}
          sortOptions={card.sortOptions}
          currentSort={card.currentSort}
          onSortChange={card.onSortChange}
        >
          {card.children}
        </DashboardCard>
      ))}
    </div>
  );
};
