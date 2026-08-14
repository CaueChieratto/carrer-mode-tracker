import { FaTrophy } from "react-icons/fa";
import { MdSportsHandball } from "react-icons/md";
import { UseRatingColor } from "../../../../../../../../../../common/hooks/Colors/GetOverallColor";
import { TournamentStats } from "../../types";
import { StatCard } from "../StatCard";
import { TOURNAMENT_STATS_CARDS } from "../../constants/statsCards";
import Styles from "./TournamentStatItem.module.css";
import { useActiveStatCard } from "../../contexts/useActiveStatCard";

type TournamentStatItemProps = {
  stat: TournamentStats;
};

export const TournamentStatItem = ({ stat }: TournamentStatItemProps) => {
  const ratingColor = UseRatingColor(stat.ratingRawNumber);
  const { activeCardId, toggleActiveCard } = useActiveStatCard();

  return (
    <div className={Styles.tournamentSection}>
      <div className={Styles.tournamentHeader}>
        <h3 className={Styles.tournamentTitle}>{stat.tournamentName}</h3>
        {stat.isChampion && (
          <div className={Styles.championBadge} title="Equipe Campeã">
            <FaTrophy className={Styles.championIconSmall} />
            <span>Campeão</span>
          </div>
        )}
      </div>
      <div className={Styles.statsGrid}>
        {TOURNAMENT_STATS_CARDS.map(
          ({ id, icon: Icon, dataKey, label, useColor }) => {
            const cardId = `${stat.tournamentName}-${id}`;

            let displayIcon = <Icon />;
            let displayValue = stat[dataKey as keyof TournamentStats];
            let displayLabel = label;

            if (id === "goals" && stat.isGoleiro) {
              displayIcon = <MdSportsHandball />;
              displayValue = stat.defesas;
              displayLabel = "Defesas";
            }

            return (
              <StatCard
                key={id}
                icon={displayIcon}
                value={displayValue as string | number}
                label={displayLabel}
                customColor={useColor ? ratingColor : undefined}
                isActive={activeCardId === cardId}
                onClick={() => toggleActiveCard(cardId)}
              />
            );
          },
        )}
      </div>
    </div>
  );
};
