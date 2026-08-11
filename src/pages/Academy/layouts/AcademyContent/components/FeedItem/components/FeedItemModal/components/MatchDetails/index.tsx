import { FaTrophy } from "react-icons/fa";
import { FeedEvent } from "../../../../types/FeedEvent";
import Styles from "./MatchDetails.module.css";

type MatchDetailsProps = {
  details: NonNullable<FeedEvent["details"]>;
  clubName: string;
};

export const MatchDetails = ({ details, clubName }: MatchDetailsProps) => {
  const isChamp = details.tournamentResult === "Campeão";
  const playersWithStats = (details.lineup || []).filter(
    (p) => p.rating !== null || (p.goals && p.goals > 0),
  );

  return (
    <div className={Styles.matchDetails}>
      {details.tournamentResult && (
        <div
          className={`${Styles.socialCard} ${isChamp ? Styles.goldCard : ""}`}
        >
          <FaTrophy
            className={Styles.bigIcon}
            style={{ fontSize: "36px", marginBottom: "8px" }}
          />
          <div className={Styles.tournResult} style={{ fontSize: "20px" }}>
            {details.tournamentResult.toUpperCase()}
          </div>
        </div>
      )}

      <div className={Styles.scoreBoardContainer}>
        <div className={Styles.scoreBoard}>
          <span>{clubName}</span>
          <span>
            {details.userGoals ?? 0} x {details.opponentGoals ?? 0}
          </span>
          <span>{details.opponentTeam}</span>
        </div>

        {details.userPenalties !== undefined &&
          details.opponentPenalties !== undefined && (
            <div className={Styles.penaltiesScore}>
              PEN ({details.userPenalties} x {details.opponentPenalties})
            </div>
          )}
      </div>

      {playersWithStats.length > 0 && (
        <div className={Styles.lineupList}>
          <strong>Destaques da Partida:</strong>
          {playersWithStats.map((player) => {
            const goals = player.goals || 0;
            const rating = player.rating !== null ? player.rating : "-";

            return (
              <div key={player.playerName} className={Styles.lineupItem}>
                <span>{player.playerName}</span>
                <div className={Styles.playerStats}>
                  <span className={Styles.rating}>Nota: {rating}</span>
                  {goals > 0 && <span>⚽ {goals}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
