import { Match } from "../../../../components/AllMatchesTab/types/Match";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { getResultColor } from "../../../../components/AllMatchesTab/helpers";
import Styles from "./MatchStatsTab.module.css";

type MatchStatsTabProps = {
  match: Match;
  season: ClubData;
  career: Career;
};

type StatRowProps = {
  label: string;
  home: string | number;
  away: string | number;
  highlight?: boolean;
};

const StatRow = ({ label, home, away, highlight }: StatRowProps) => (
  <div className={`${Styles.stat_row} ${highlight ? Styles.highlight : ""}`}>
    <span className={Styles.stat_value}>{home}</span>
    <span className={Styles.stat_label}>{label}</span>
    <span className={Styles.stat_value}>{away}</span>
  </div>
);

export const MatchStatsTab = ({ match }: MatchStatsTabProps) => {
  const isFinished = match.status === "FINISHED";
  const resultColor = getResultColor(match.result);

  return (
    <div className={Styles.container}>
      <div className={Styles.scoreboard_card}>
        <div className={Styles.scoreboard}>
          <div className={Styles.team_block}>
            <span className={Styles.team_name}>{match.homeTeam}</span>
          </div>

          <div className={Styles.score_block}>
            {isFinished ? (
              <>
                <div className={Styles.score_row}>
                  <span className={Styles.score}>{match.homeScore ?? 0}</span>
                  <span className={Styles.score_separator}>-</span>
                  <span className={Styles.score}>{match.awayScore ?? 0}</span>
                </div>
                <span
                  className={Styles.result_badge}
                  style={{ backgroundColor: resultColor }}
                >
                  {match.result}
                </span>
              </>
            ) : (
              <span className={Styles.scheduled_label}>Agendado</span>
            )}
            <span className={Styles.match_date}>{match.date}</span>
          </div>

          <div className={Styles.team_block}>
            <span className={Styles.team_name}>{match.awayTeam}</span>
          </div>
        </div>
      </div>

      <div className={Styles.stats_card}>
        <h2 className={Styles.section_title}>Estatísticas da partida</h2>

        {isFinished ? (
          <>
            <StatRow
              highlight
              label="Gols"
              home={match.homeScore ?? 0}
              away={match.awayScore ?? 0}
            />
            {!match.playerStats?.length && (
              <p className={Styles.no_stats}>
                Estatísticas detalhadas não disponíveis.
              </p>
            )}
          </>
        ) : (
          <p className={Styles.no_stats}>A partida ainda não foi realizada.</p>
        )}
      </div>
    </div>
  );
};
