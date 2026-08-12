import { FaTrophy } from "react-icons/fa";
import Styles from "./TournamentResult.module.css";
import { FeedEvent } from "../../../../../../types/FeedEvent";

type TournamentResultProps = {
  details: NonNullable<FeedEvent["details"]>;
};

export const TournamentResult = ({ details }: TournamentResultProps) => {
  const isChamp = details.tournamentResult === "Campeão";

  return (
    <>
      {details.tournamentResult && (
        <div
          className={`${Styles.socialCard} ${isChamp ? Styles.goldCard : ""}`}
        >
          <FaTrophy className={Styles.bigIcon} />
          <div className={Styles.tournResult}>
            {details.tournamentResult.toUpperCase()}
          </div>
        </div>
      )}
    </>
  );
};
