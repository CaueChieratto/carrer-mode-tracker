import { GiSoccerBall } from "react-icons/gi";
import Styles from "./MatchHeaderCard.module.css";
import { Match } from "../../../../../../components/AllMatchesTab/types/Match";

type Goal = {
  playerName: string;
  time: number;
  displayTime?: string;
};

type MatchHeaderCardProps = {
  match: Match;
  hasPenalties: boolean;
  isUserHome: boolean;
  goals?: Goal[];
};

export const MatchHeaderCard = ({
  match,
  isUserHome,
  hasPenalties,
  goals = [],
}: MatchHeaderCardProps) => {
  const date = match.date;

  const homeScore = match.homeScore;
  const awayScore = match.awayScore;

  const homeTeam = match.homeTeam;
  const awayTeam = match.awayTeam;

  const statusDisplay = match.status === "FINISHED" ? "Finalizado" : "Agendado";

  return (
    <div className={Styles.card}>
      <div className={Styles.container_date}>
        <span className={Styles.date}>{date}</span>
      </div>

      <div className={Styles.main_row}>
        <div className={Styles.team_name_left}>{homeTeam}</div>

        <div className={Styles.score_container}>
          <div className={Styles.score_row}>
            <span className={Styles.score_number}>{homeScore}</span>
            <span className={Styles.score_separator}>-</span>
            <span className={Styles.score_number}>{awayScore}</span>
          </div>
          {hasPenalties ? (
            <span className={Styles.pen_score}>
              PEN {match.homePenScore} - {match.awayPenScore}
            </span>
          ) : (
            <span className={Styles.match_status}>{statusDisplay}</span>
          )}
        </div>

        <div className={Styles.team_name_right}>{awayTeam}</div>
      </div>

      {goals.length > 0 && (
        <div className={Styles.scorers_container}>
          <div className={Styles.scorers_left}>
            {isUserHome &&
              goals.map((goal, idx) => (
                <span key={idx}>
                  {goal.playerName} {goal.displayTime || `${goal.time}'`}
                </span>
              ))}
          </div>

          <div className={Styles.icon_center}>
            <GiSoccerBall size={14} className={Styles.goal_icon} />
          </div>

          <div className={Styles.scorers_right}>
            {!isUserHome &&
              goals.map((goal, idx) => (
                <span key={idx}>
                  {goal.playerName} {goal.displayTime || `${goal.time}'`}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
