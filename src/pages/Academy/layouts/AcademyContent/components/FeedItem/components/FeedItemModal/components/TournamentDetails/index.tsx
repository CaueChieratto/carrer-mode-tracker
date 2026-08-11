import { FaTrophy } from "react-icons/fa";
import { FeedEvent } from "../../../../types/FeedEvent";
import Styles from "./TournamentDetails.module.css";

type TournamentDetailsProps = {
  details: NonNullable<FeedEvent["details"]>;
};

export const TournamentDetails = ({ details }: TournamentDetailsProps) => {
  const isChamp = details.tournamentResult === "Campeão";

  return (
    <div className={`${Styles.socialCard} ${isChamp ? Styles.goldCard : ""}`}>
      <FaTrophy className={Styles.bigIcon} />
      <div className={Styles.tournResult}>
        {details.tournamentResult?.toUpperCase()}
      </div>
    </div>
  );
};
