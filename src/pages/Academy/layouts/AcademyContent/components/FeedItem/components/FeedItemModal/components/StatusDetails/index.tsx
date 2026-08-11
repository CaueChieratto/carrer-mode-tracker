import { FaStar, FaRocket, FaHandshake } from "react-icons/fa";
import { FeedEvent } from "../../../../types/FeedEvent";
import Styles from "./StatusDetails.module.css";

type StatusDetailsProps = {
  details: NonNullable<FeedEvent["details"]>;
};

export const StatusDetails = ({ details }: StatusDetailsProps) => {
  const isPromoted = details.newValue === "promoted";
  const isAcademy = details.newValue === "academy";
  const isReleased = details.newValue === "released";

  let icon = <FaStar />;
  let text = "ATUALIZAÇÃO DE STATUS";

  if (isPromoted) {
    icon = <FaRocket />;
    text = "PROMOVIDO AO PROFISSIONAL!";
  } else if (isAcademy) {
    icon = <FaStar />;
    text = "NOVO TALENTO NA BASE!";
  } else if (isReleased) {
    icon = <FaHandshake />;
    text = "DISPENSADO DA BASE";
  }

  return (
    <div className={Styles.socialCard}>
      <div className={Styles.statusIcon}>{icon}</div>
      <div className={Styles.statusText}>{text}</div>
    </div>
  );
};
