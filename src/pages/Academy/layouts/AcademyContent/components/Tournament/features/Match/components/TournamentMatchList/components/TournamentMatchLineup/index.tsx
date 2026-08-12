import { GiSoccerBall } from "react-icons/gi";
import { UseRatingColor } from "../../../../../../../../../../../../common/hooks/Colors/GetOverallColor";
import { Boot } from "../../../../../../../../../../../../ui/IconsSVG/Boot";
import { PlayerMatchesStats } from "../../../../../../../../interfaces/AcademyTournaments/AcademyMatches/PlayerMatchesStats";
import Styles from "./TournamentMatchLineup.module.css";
import { MdSportsHandball } from "react-icons/md";
import { useTheme } from "../../../../../../../../../../../../contexts/LightThemeContext";
import { RatingBackground } from "../../../../../../../../ui/PlayerItem/components/RatingBackground";
import { PlayerStats } from "../../../../../../../../ui/PlayerItem/components/PlayerStats";
import { PlayerName } from "../../../../../../../../ui/PlayerItem/components/PlayerName";
import { PlayerItem } from "../../../../../../../../ui/PlayerItem";
import { StatsGroup } from "../../../../../../../../ui/PlayerItem/components/StatsGroup";

type TournamentMatchLineupProps = {
  lineup?: PlayerMatchesStats[];
};

export const TournamentMatchLineup = ({
  lineup,
}: TournamentMatchLineupProps) => {
  const { theme } = useTheme();
  if (!lineup || lineup.length === 0) return null;

  const BootIcon = () => <Boot isWhite={theme === "dark"} />;

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
            <PlayerItem key={player.playerId}>
              <PlayerName playerName={player.playerName} />

              <StatsGroup>
                <PlayerStats>
                  <RatingBackground colorRating={ratingColor} rating={rating} />
                </PlayerStats>

                {defesas ? (
                  <PlayerStats icon={MdSportsHandball} stat={defesas} />
                ) : (
                  <PlayerStats icon={GiSoccerBall} stat={goals} />
                )}

                <PlayerStats icon={BootIcon} stat={assists} />
              </StatsGroup>
            </PlayerItem>
          );
        })}
      </div>
    </div>
  );
};
