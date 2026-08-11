import { OverflowText } from "../../../../../../../../../../../../components/OverflowText";
import Styles from "./TournamentMatchBody.module.css";

type TournamentMatchBodyProps = {
  homeTeamName: string;
  homeTeamBadge?: string | null;
  awayTeamName: string;
  awayTeamBadge?: string | null;
  result?: string;
  homeGoals?: number;
  awayGoals?: number;
  homePenalties?: number;
  awayPenalties?: number;
};

export const TournamentMatchBody = ({
  homeTeamName,
  homeTeamBadge,
  awayTeamName,
  awayTeamBadge,
  result,
  homeGoals,
  awayGoals,
  homePenalties,
  awayPenalties,
}: TournamentMatchBodyProps) => {
  return (
    <div className={Styles.matchBody}>
      <div className={`${Styles.team} ${Styles.homeTeam}`}>
        {homeTeamBadge && (
          <img
            src={homeTeamBadge}
            alt={homeTeamName}
            className={Styles.badge}
          />
        )}
        <div className={Styles.nameWrapper}>
          <OverflowText text={homeTeamName} className={Styles.teamName} />
        </div>
      </div>

      {result === "SCHEDULED" ? (
        <div className={Styles.scheduledScore}>
          <span className={Styles.scheduledDash}>-</span>
          <span className={Styles.scheduledText}>Agendado</span>
        </div>
      ) : (
        <div className={Styles.scoreContainer}>
          <div className={Styles.score}>
            <span>{homeGoals}</span>
            <span>-</span>
            <span>{awayGoals}</span>
          </div>
          {homePenalties !== undefined && awayPenalties !== undefined && (
            <div className={Styles.penalties}>
              PEN ({homePenalties} x {awayPenalties})
            </div>
          )}
        </div>
      )}

      <div className={`${Styles.team} ${Styles.awayTeam}`}>
        <div className={Styles.nameWrapper}>
          <OverflowText text={awayTeamName} className={Styles.teamName} />
        </div>
        {awayTeamBadge && (
          <img
            src={awayTeamBadge}
            alt={awayTeamName}
            className={Styles.badge}
          />
        )}
      </div>
    </div>
  );
};
