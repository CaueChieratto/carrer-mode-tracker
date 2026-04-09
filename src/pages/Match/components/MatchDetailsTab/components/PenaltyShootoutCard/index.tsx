import { Match } from "../../../../../../components/AllMatchesTab/types/Match";
import Styles from "./PenaltyShootoutCard.module.css";

type PenaltyShootoutCardProps = {
  match: Match;
};

export const PenaltyShootoutCard = ({ match }: PenaltyShootoutCardProps) => {
  const homePenScore = match?.homePenScore ?? 2;
  const awayPenScore = match?.awayPenScore ?? 4;

  const homeTeamName = match.homeTeam;
  const awayTeamName = match.awayTeam;

  const homePenalties = [
    { player: "A. Sørloth", status: "hit" },
    { player: "J. Álvarez", status: "miss" },
    { player: "Á. Correa", status: "hit" },
    { player: "M. Llorente", status: "miss" },
    { player: "", status: "empty" },
  ];

  const awayPenalties = [
    { player: "K. Mbappé", status: "hit" },
    { player: "J. Bellingham", status: "hit" },
    { player: "F. Valverde", status: "miss" },
    { player: "L. Vázquez", status: "hit" },
    { player: "A. Rüdiger", status: "hit" },
  ];

  const renderDots = (penalties: typeof homePenalties) => (
    <div className={Styles.dots_container}>
      {penalties.map((pen, idx) => (
        <span
          key={idx}
          className={`${Styles.dot} ${
            pen.status === "hit"
              ? Styles.dot_hit
              : pen.status === "miss"
                ? Styles.dot_miss
                : Styles.dot_empty
          }`}
        />
      ))}
    </div>
  );

  const renderPlayers = (penalties: typeof homePenalties) => {
    const activePlayers = penalties.filter((p) => p.player);
    return (
      <div className={Styles.players_list}>
        {activePlayers.map((pen, idx) => (
          <span key={idx}>
            <span
              className={
                pen.status === "hit" ? Styles.text_hit : Styles.text_miss
              }
            >
              {pen.player}
            </span>
            {idx < activePlayers.length - 1 && ", "}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={Styles.card}>
      <h3 className={Styles.title}>Disputa de Pênaltis</h3>

      <div className={Styles.team_section}>
        <div className={Styles.row_wrapper}>
          <div className={Styles.team_abbrev}>
            {homeTeamName.substring(0, 3).toUpperCase()}
          </div>
          {renderDots(homePenalties)}
          <div className={Styles.total_score}>{homePenScore}</div>
        </div>
        {renderPlayers(homePenalties)}
      </div>

      <div className={Styles.team_section}>
        <div className={Styles.row_wrapper}>
          <div className={Styles.team_abbrev}>
            {awayTeamName.substring(0, 3).toUpperCase()}
          </div>
          {renderDots(awayPenalties)}
          <div className={Styles.total_score}>{awayPenScore}</div>
        </div>
        {renderPlayers(awayPenalties)}
      </div>
    </div>
  );
};
