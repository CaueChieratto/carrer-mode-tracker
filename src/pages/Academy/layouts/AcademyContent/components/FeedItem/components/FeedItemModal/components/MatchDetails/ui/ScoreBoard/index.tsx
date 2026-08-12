import { FeedEvent } from "../../../../../../types/FeedEvent";
import Styles from "./ScoreBoard.module.css";
import { OverflowText } from "../../../../../../../../../../../../components/OverflowText";

type ScoreBoardProps = {
  clubName: string;
  clubBadge?: string | null;
  opponentBadge?: string | null;
  details: NonNullable<FeedEvent["details"]>;
};

export const ScoreBoard = ({
  clubName,
  clubBadge,
  opponentBadge,
  details,
}: ScoreBoardProps) => {
  return (
    <div className={Styles.scoreBoardContainer}>
      <div className={Styles.scoreBoard}>
        <div className={Styles.team}>
          {clubBadge && (
            <img src={clubBadge} alt={clubName} className={Styles.badge} />
          )}
          <div className={Styles.nameWrapper}>
            <OverflowText text={clubName} />
          </div>
        </div>

        <span className={Styles.wrapperScore}>
          <p>
            {details.userGoals ?? 0} x {details.opponentGoals ?? 0}
          </p>
          <div>
            {details.userPenalties !== undefined &&
              details.opponentPenalties !== undefined && (
                <p className={Styles.penaltiesScore}>
                  PEN ({details.userPenalties} x {details.opponentPenalties})
                </p>
              )}
          </div>
        </span>

        <div className={Styles.team}>
          <div className={Styles.nameWrapper}>
            <OverflowText text={details.opponentTeam || ""} />
          </div>
          {opponentBadge && (
            <img
              src={opponentBadge}
              alt={details.opponentTeam}
              className={Styles.badge}
            />
          )}
        </div>
      </div>
    </div>
  );
};
