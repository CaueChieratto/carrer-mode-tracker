import { PeriodKey, MatchEvent } from "../../types";
import { EventRow } from "./components/EventRow";
import Styles from "./Timeline.module.css";

type TimelineProps = {
  isHome: boolean;
  eventsByPeriod: Record<PeriodKey, MatchEvent[]>;
  periods: { key: PeriodKey; label: string }[];
};

export const Timeline = ({
  isHome,
  eventsByPeriod,
  periods,
}: TimelineProps) => {
  return (
    <div className={Styles.timeline_container}>
      {periods.map(({ key, label }) => {
        const events = eventsByPeriod[key];
        if (!events.length) return null;

        return (
          <div key={key} className={Styles.period_section}>
            <div className={Styles.timeline_divider}>
              <div className={Styles.line} />
              <span className={Styles.timeline_title}>{label}</span>
              <div className={Styles.line} />
            </div>

            <div className={Styles.events_list}>
              {events.map((event) => (
                <EventRow key={event.id} event={event} isHome={isHome} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
