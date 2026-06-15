import { GiSoccerBall } from "react-icons/gi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { getResultColor } from "../../../../helpers";
import { Match } from "../../../../types/Match";
import { PlayerMatchStat } from "../../../../types/PlayerMatchStat";
import { UseRatingColor } from "../../../../../../../../../common/hooks/Colors/GetOverallColor";
import Styles from "./MatchBody.module.css";
import { Boot } from "../../../../../../../../../ui/IconsSVG/Boot";
import { OwnGoal } from "../../../../../../../../../ui/IconsSVG/OwnGoal";
import { RefereeCard } from "../../../../../../../../../ui/IconsSVG/RefereeCard";

type MatchBodyProps = {
  match: Match;
  onClick: () => void;
  homeBadge: string;
  awayBadge: string;
  onAddBadge?: (teamName: string) => void;
  playerStat?: PlayerMatchStat;
  isHomeCareerTeam?: boolean;
};

export const MatchBody = ({
  match,
  onClick,
  homeBadge,
  awayBadge,
  onAddBadge,
  playerStat,
  isHomeCareerTeam,
}: MatchBodyProps) => {
  const displayRating = playerStat
    ? playerStat.rating % 1 === 0
      ? playerStat.rating.toString()
      : playerStat.rating.toFixed(1)
    : "";

  const renderPlayerEvents = () => {
    if (!playerStat) return null;
    return (
      <div className={Styles.player_events}>
        {playerStat.goals > 0 && (
          <span className={Styles.event_item}>
            <GiSoccerBall size={14} />{" "}
            {playerStat.goals > 1 ? playerStat.goals : ""}
          </span>
        )}
        {playerStat.assists > 0 && (
          <span className={Styles.event_item}>
            <Boot />
            {playerStat.assists > 1 ? playerStat.assists : ""}
          </span>
        )}
        {playerStat.ownGoals && playerStat.ownGoals > 0 ? (
          <span className={Styles.event_item}>
            <OwnGoal lineup />
            {playerStat.ownGoals > 1 ? playerStat.ownGoals : ""}
          </span>
        ) : null}
        {playerStat.secondYellowCard ? (
          <span className={Styles.event_item}>
            <RefereeCard type="second-yellow" />
          </span>
        ) : playerStat.redCard ? (
          <span className={Styles.event_item}>
            <RefereeCard type="red" />
          </span>
        ) : playerStat.yellowCard ? (
          <span className={Styles.event_item}>
            <RefereeCard type="yellow" />
          </span>
        ) : null}
      </div>
    );
  };

  return (
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

        <div className={Styles.scores_container}>
          <div className={Styles.scores}>
            <div className={Styles.score_row}>
              {isHomeCareerTeam && renderPlayerEvents()}
              <span className={Styles.score}>
                {match.homeScore}
                {match.homePenScore != null && ` (${match.homePenScore})`}
              </span>
            </div>

            <div className={Styles.score_row}>
              {!isHomeCareerTeam && renderPlayerEvents()}
              <span className={Styles.score}>
                {match.awayScore}
                {match.awayPenScore != null && ` (${match.awayPenScore})`}
              </span>
            </div>
          </div>
        </div>
      </section>

      <aside
        className={Styles.aside_result}
        style={{
          backgroundColor: playerStat
            ? UseRatingColor(playerStat.rating)
            : getResultColor(match.result),
        }}
      >
        {playerStat ? displayRating : match.result}
      </aside>
    </main>
  );
};
