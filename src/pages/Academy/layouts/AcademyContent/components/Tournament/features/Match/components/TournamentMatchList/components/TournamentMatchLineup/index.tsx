import { GiSoccerBall } from "react-icons/gi";
import { UseRatingColor } from "../../../../../../../../../../../../common/hooks/Colors/GetOverallColor";
import { Boot } from "../../../../../../../../../../../../ui/IconsSVG/Boot";
import { PlayerMatchesStats } from "../../../../../../../../interfaces/AcademyTournaments/AcademyMatches/PlayerMatchesStats";
import Styles from "./TournamentMatchLineup.module.css";
import { MdSportsHandball } from "react-icons/md";
import { useTheme } from "../../../../../../../../../../../../contexts/LightThemeContext";

type TournamentMatchLineupProps = {
  lineup?: PlayerMatchesStats[];
};

export const TournamentMatchLineup = ({
  lineup,
}: TournamentMatchLineupProps) => {
  const { theme } = useTheme();
  if (!lineup || lineup.length === 0) return null;

  return (
    <div className={Styles.lineupContainer}>
      <span className={Styles.title}>Escalação & Estatísticas</span>
      <div className={Styles.list}>
        {lineup.map((player) => {
          const rating = player.rating !== null ? player.rating : 0;
          const ratingColor = UseRatingColor(rating);

          const goals = player.goals || 0;
          const assists = player.assists || 0;
          const defesas = player.defesas || 0;

          return (
            <div key={player.playerId} className={Styles.playerItem}>
              <span className={Styles.playerName}>{player.playerName}</span>
              <div className={Styles.statsGroup}>
                <span className={Styles.rating} style={{ color: ratingColor }}>
                  Nota: {rating}
                </span>
                {goals > 0 && (
                  <span className={Styles.statBadge}>
                    <GiSoccerBall size={16} /> {goals}
                  </span>
                )}
                {assists > 0 && (
                  <span className={Styles.statBadge}>
                    <Boot isWhite={theme === "dark"} />
                    {assists}
                  </span>
                )}
                {defesas > 0 && (
                  <span className={Styles.statBadge}>
                    <MdSportsHandball /> {defesas}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
