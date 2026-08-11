import React from "react";
import Styles from "./PlayerPerformance.module.css";
import { usePlayerPerformance } from "./hooks/usePlayerPerformance";
import { TournamentStatItem } from "./components/TournamentStatItem";
import { GeneralStatsFooter } from "./components/GeneralStatsFooter";
import { ActiveStatCardProvider } from "./contexts/ActiveStatCardContext";

export const PlayerPerformance: React.FC = () => {
  const { selectedPlayer, tournamentStats, totalStats, isGeral } =
    usePlayerPerformance();

  if (!selectedPlayer) return null;

  const tournamentsBySeason = tournamentStats.reduce(
    (acc, stat) => {
      const season = stat.season || "Geral";
      if (!acc[season]) {
        acc[season] = [];
      }
      acc[season].push(stat);
      return acc;
    },
    {} as Record<string, typeof tournamentStats>,
  );

  return (
    <div className={Styles.container}>
      <ActiveStatCardProvider>
        {tournamentStats.length === 0 ? (
          <p className={Styles.noData}>
            Nenhuma estatística disponível para este jogador.
          </p>
        ) : (
          <>
            {isGeral ? (
              Object.entries(tournamentsBySeason).map(([season, stats]) => (
                <div key={season} className={Styles.seasonSection}>
                  <div className={Styles.seasonHeader}>
                    <h2 className={Styles.seasonTitle}>
                      <span className={Styles.seasonLabel}>Temporada</span>
                      <span className={Styles.seasonNumber}>{season}</span>
                    </h2>
                  </div>
                  <div className={Styles.tournamentsContainer}>
                    {stats.map((stat) => (
                      <TournamentStatItem key={stat.tournamentId} stat={stat} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className={Styles.tournamentsContainer}>
                {tournamentStats.map((stat) => (
                  <TournamentStatItem key={stat.tournamentId} stat={stat} />
                ))}
              </div>
            )}

            <GeneralStatsFooter totalStats={totalStats} isGeral={isGeral} />
          </>
        )}
      </ActiveStatCardProvider>
    </div>
  );
};
