import { PeriodKey, MatchEvent } from "../../types";
import { EventRow } from "./components/EventRow";
import Styles from "./Timeline.module.css";

type TimelineProps = {
  isHome: boolean;
  eventsByPeriod: Record<PeriodKey, MatchEvent[]>;
  periods: { key: PeriodKey; label: string; stoppage?: number }[];
};

export const Timeline = ({
  isHome,
  eventsByPeriod,
  periods,
}: TimelineProps) => {
  return (
    <div className={Styles.timeline_container}>
      {periods.map(({ key, label, stoppage }) => {
        const events = eventsByPeriod[key] || [];
        if (!events.length && !stoppage) return null;

        let stoppageEvents: MatchEvent[] = [];
        let regularEvents: MatchEvent[] = [];

        switch (key) {
          case "1T":
            stoppageEvents = events.filter((e) => e.time > 45);
            regularEvents = events.filter((e) => e.time <= 45);
            break;
          case "2T":
            stoppageEvents = events.filter((e) => e.time > 90);
            regularEvents = events.filter((e) => e.time <= 90);
            break;
          case "1ET":
            stoppageEvents = events.filter((e) => e.time > 105);
            regularEvents = events.filter((e) => e.time <= 105);
            break;
          case "2ET":
            stoppageEvents = events.filter((e) => e.time > 120);
            regularEvents = events.filter((e) => e.time <= 120);
            break;
          default:
            regularEvents = events;
        }

        return (
          <div key={key} className={Styles.period_section}>
            <div className={Styles.timeline_divider}>
              <div className={Styles.line} />
              <span className={Styles.timeline_title}>{label}</span>
              <div className={Styles.line} />
            </div>

            <div className={Styles.events_list}>
              {stoppageEvents.map((event) => (
                <EventRow key={event.id} event={event} isHome={isHome} />
              ))}

              {stoppage !== undefined && stoppage > 0 && (
                <div className={Styles.stoppage_container}>
                  <span className={Styles.stoppage_badge}>
                    Tempo adicional {stoppage}
                  </span>
                </div>
              )}

              {regularEvents.map((event) => (
                <EventRow key={event.id} event={event} isHome={isHome} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
