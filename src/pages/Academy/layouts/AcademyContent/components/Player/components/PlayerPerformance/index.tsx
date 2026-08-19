import Styles from "./PlayerPerformance.module.css";
import { usePlayerPerformance } from "./hooks/usePlayerPerformance";
import { TournamentStatItem } from "./components/TournamentStatItem";
import { GeneralStatsFooter } from "./components/GeneralStatsFooter";
import { ActiveStatCardProvider } from "./contexts/ActiveStatCardContext";
import { useAcademyContext } from "../../../../../contexts/AcademyContext/hooks/useAcademyContext";
import { isEuropeanSeason } from "../../../../utils/isEuropeanSeason";
import { getSeasonMonthWeight } from "../PlayerDevelopment/utils/getSeasonMonthWeight";
import { TournamentStats } from "./types";

export const PlayerPerformance: React.FC = () => {
  const { selectedPlayer, tournamentStats, totalStats, isGeral } =
    usePlayerPerformance();
  const { career, tournamentsAcademy } = useAcademyContext();

  if (!selectedPlayer) return null;

  const isEurope = isEuropeanSeason(career);

  const getTournamentDate = (id: string) => {
    return tournamentsAcademy.find((t) => t.id === id)?.date || "01/01/2000";
  };

  const sortStatsByDate = (a: TournamentStats, b: TournamentStats) => {
    const dateA = getTournamentDate(a.tournamentId);
    const dateB = getTournamentDate(b.tournamentId);

    const getYear = (dateStr: string) => {
      const parts = dateStr.split(" - ");
      if (parts.length > 1) {
        return parseInt(parts[1].split("/")[0], 10) || 0;
      }
      return parseInt(dateStr.split("/")[2] || "0", 10) || 0;
    };

    const yearA = getYear(dateA);
    const yearB = getYear(dateB);

    if (yearA !== yearB) {
      return yearA - yearB;
    }

    const monthA = dateA.split("/")[1]?.split(" ")[0] || "1";
    const monthB = dateB.split("/")[1]?.split(" ")[0] || "1";

    const weightA = getSeasonMonthWeight(monthA, isEurope);
    const weightB = getSeasonMonthWeight(monthB, isEurope);

    if (weightA !== weightB) {
      return weightA - weightB;
    }

    const dayA = parseInt(dateA.split("/")[0] || "1", 10);
    const dayB = parseInt(dateB.split("/")[0] || "1", 10);

    return dayA - dayB;
  };

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
            <GeneralStatsFooter totalStats={totalStats} isGeral={isGeral} />

            {isGeral ? (
              Object.entries(tournamentsBySeason)
                .sort(([seasonA], [seasonB]) => {
                  if (seasonA.toLowerCase() === "geral") return -1;
                  if (seasonB.toLowerCase() === "geral") return 1;
                  return Number(seasonA) - Number(seasonB);
                })
                .map(([season, stats]) => (
                  <div key={season} className={Styles.seasonSection}>
                    <div className={Styles.seasonHeader}>
                      <h2 className={Styles.seasonTitle}>
                        <span className={Styles.seasonLabel}>Temporada</span>
                        <span className={Styles.seasonNumber}>{season}</span>
                      </h2>
                    </div>
                    <div className={Styles.tournamentsContainer}>
                      {[...stats].sort(sortStatsByDate).map((stat) => (
                        <TournamentStatItem
                          key={stat.tournamentId}
                          stat={stat}
                        />
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className={Styles.tournamentsContainer}>
                {[...tournamentStats].sort(sortStatsByDate).map((stat) => (
                  <TournamentStatItem key={stat.tournamentId} stat={stat} />
                ))}
              </div>
            )}
          </>
        )}
      </ActiveStatCardProvider>
    </div>
  );
};
