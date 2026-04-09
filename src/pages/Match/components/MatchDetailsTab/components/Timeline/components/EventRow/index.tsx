import { MatchEvent } from "../../../../types";
import { EventIcon } from "./components/EventIcon";
import Styles from "./EventRow.module.css";

type Props = {
  event: MatchEvent;
  isHome: boolean;
};

export const EventRow = ({ event, isHome }: Props) => {
  if (isHome) {
    return (
      <div className={`${Styles.event_row} ${Styles.event_left}`}>
        <span className={Styles.event_time}>{event.time}'</span>
        <span className={Styles.event_icon}>
          <EventIcon type={event.type} />
        </span>
        <span className={Styles.event_main}>{event.mainPlayer}</span>
        {event.secondaryPlayer && (
          <span className={Styles.event_secondary}>
            {event.secondaryPlayer}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`${Styles.event_row} ${Styles.event_right}`}>
      {event.secondaryPlayer && (
        <span className={Styles.event_secondary}>{event.secondaryPlayer}</span>
      )}
      <span className={Styles.event_main}>{event.mainPlayer}</span>
      <span className={Styles.event_icon}>
        <EventIcon type={event.type} />
      </span>
      <span className={Styles.event_time}>{event.time}'</span>
    </div>
  );
};
