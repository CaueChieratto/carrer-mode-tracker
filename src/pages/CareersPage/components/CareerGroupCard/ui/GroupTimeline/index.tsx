import Styles from "./GroupTimeline.module.css";
import CareerCard from "../../../CareerCard";
import { Career } from "../../../../../../common/interfaces/Career";

type GroupTimelineProps = {
  sortedCareers: Career[];
  currentId?: string;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
};

export const GroupTimeline = ({
  sortedCareers,
  currentId,
  expandedId,
  onToggleExpand,
}: GroupTimelineProps) => {
  return (
    <div className={Styles.timeline}>
      {sortedCareers.map((career, index) => {
        const isExpanded = expandedId === career.id;
        const isCurrent = career.id === currentId;
        const isLast = index === sortedCareers.length - 1;

        return (
          <div key={career.id} className={Styles.timelineRow}>
            <div className={Styles.timelineRail}>
              <div
                className={`${Styles.dot} ${isCurrent ? Styles.dotCurrent : ""}`}
              />
              {!isLast && <div className={Styles.line} />}
            </div>
            <div
              className={`${Styles.careerItem} ${isCurrent ? Styles.careerCurrent : ""}`}
            >
              <CareerCard
                career={career}
                isGroupItem={true}
                isExpanded={isExpanded}
                onToggleExpand={() => onToggleExpand(career.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
