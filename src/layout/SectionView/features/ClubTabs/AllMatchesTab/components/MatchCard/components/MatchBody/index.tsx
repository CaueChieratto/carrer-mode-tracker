import { getResultColor } from "../../../../helpers";
import { Match } from "../../../../types/Match";
import { IoMdAddCircleOutline } from "react-icons/io";
import Styles from "./MatchBody.module.css";

type MatchBodyProps = {
  match: Match;
  onClick: () => void;
  homeBadge: string;
  awayBadge: string;
  onAddBadge?: (teamName: string) => void;
};

export const MatchBody = ({
  match,
  onClick,
  homeBadge,
  awayBadge,
  onAddBadge,
}: MatchBodyProps) => (
  <main className={Styles.match_row} onClick={onClick}>
    <aside className={Styles.aside_date}>
      <span className={Styles.date}>{match.date}</span>
    </aside>

    <section className={Styles.section}>
      <div className={Styles.teams}>
        <div
          className={Styles.wrapper}
          onClick={
            !homeBadge
              ? (event) => {
                  event.stopPropagation();
                  if (onAddBadge) onAddBadge(match.homeTeam);
                }
              : undefined
          }
        >
          <div className={Styles.wrapper_img}>
            {homeBadge ? (
              <img src={homeBadge} className={Styles.badge} />
            ) : (
              <IoMdAddCircleOutline className={Styles.badge_fallback} />
            )}
          </div>

          <span className={Styles.team_name}>{match.homeTeam}</span>
        </div>

        <div
          className={Styles.wrapper}
          onClick={
            !awayBadge
              ? (event) => {
                  event.stopPropagation();
                  if (onAddBadge) onAddBadge(match.awayTeam);
                }
              : undefined
          }
        >
          <div className={Styles.wrapper_img}>
            {awayBadge ? (
              <img src={awayBadge} className={Styles.badge} />
            ) : (
              <IoMdAddCircleOutline className={Styles.badge_fallback} />
            )}
          </div>

          <span className={Styles.team_name}>{match.awayTeam}</span>
        </div>
      </div>

      <div className={Styles.scores}>
        <span className={Styles.score}>
          {match.homeScore}
          {match.homePenScore != null && ` (${match.homePenScore})`}
        </span>

        <span className={Styles.score}>
          {match.awayScore}
          {match.awayPenScore != null && ` (${match.awayPenScore})`}
        </span>
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
