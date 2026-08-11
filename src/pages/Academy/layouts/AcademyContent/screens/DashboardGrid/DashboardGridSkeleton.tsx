import { DashboardCardConfig } from "../../config";
import { SkeletonCard, SkeletonButton } from "../../ui/SkeletonCard";
import Styles from "../../../AcademyContent/AcademyContent.module.css";

type DashboardGridSkeletonProps = {
  dashboardCards: DashboardCardConfig[];
};

export const DashboardGridSkeleton = ({
  dashboardCards,
}: DashboardGridSkeletonProps) => {
  return (
    <div className={Styles.dashboardGrid}>
      {dashboardCards.map((card, index) => (
        <SkeletonCard key={card.id || index}>
          {card.skeletonContent}
          {card.actionText && (
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <SkeletonButton />
            </div>
          )}
        </SkeletonCard>
      ))}
    </div>
  );
};
