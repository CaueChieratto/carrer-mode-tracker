import React from "react";
import Styles from "./PlayerPerformance.module.css";
import { usePlayerPerformance } from "./hooks/usePlayerPerformance";
import { TournamentStatItem } from "./components/TournamentStatItem";
import { GeneralStatsFooter } from "./components/GeneralStatsFooter";
import { ActiveStatCardProvider } from "./contexts/ActiveStatCardContext";

export const PlayerPerformance: React.FC = () => {
  const { selectedPlayer, tournamentStats, totalStats } =
    usePlayerPerformance();

  if (!selectedPlayer) return null;

  return (
    <div className={Styles.container}>
      <ActiveStatCardProvider>
        {tournamentStats.length === 0 ? (
          <p className={Styles.noData}>
            Nenhuma estatística disponível para este jogador.
          </p>
        ) : (
          <div className={Styles.tournamentsContainer}>
            {tournamentStats.map((stat) => (
              <TournamentStatItem key={stat.tournamentId} stat={stat} />
            ))}
          </div>
        )}

        <GeneralStatsFooter totalStats={totalStats} />
      </ActiveStatCardProvider>
    </div>
  );
};
