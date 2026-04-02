import { getResultColor } from "../../../../helpers";
import { Match } from "../../../../types/Match";
import Styles from "./MatchBody.module.css";

type MatchBodyProps = {
  match: Match;
  onClick: () => void;
};

export const MatchBody = ({ match, onClick }: MatchBodyProps) => (
  <main className={Styles.match_row} onClick={onClick}>
    <aside className={Styles.aside_date}>
      <span className={Styles.date}>{match.date}</span>
    </aside>

    <section className={Styles.section}>
      <div className={Styles.teams}>
        <span className={Styles.team_name}>{match.homeTeam}</span>
        <span className={Styles.team_name}>{match.awayTeam}</span>
      </div>
      <div className={Styles.scores}>
        <span className={Styles.score}>{match.homeScore}</span>
        <span className={Styles.score}>{match.awayScore}</span>
      </div>
    </section>

    <aside
      className={Styles.aside_result}
      style={{ backgroundColor: getResultColor(match.result) }}
    >
      {match.result}
    </aside>
  </main>
);
