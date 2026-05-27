import { MatchEvent } from "../../../../types";
import { EventIcon } from "./components/EventIcon";
import Styles from "./EventRow.module.css";

type Props = {
  event: MatchEvent;
  isUserHome: boolean;
};

export const EventRow = ({ event, isUserHome }: Props) => {
  const timeDisplay = event.displayTime || `${event.time}'`;

  const isHomeEvent = event.isOpponent ? !isUserHome : isUserHome;

  if (isHomeEvent) {
    return (
      <div className={`${Styles.event_row} ${Styles.event_left}`}>
        <span className={Styles.event_time}>{timeDisplay}</span>
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
      <span className={Styles.event_time}>{timeDisplay}</span>
    </div>
  );
};
