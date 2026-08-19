import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Career } from "../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import { Players } from "../../../../../common/interfaces/playersInfo/players";
import { ContainerClubContent } from "../../../../../components/ContainerClubContent";
import NoStatsMessage from "../../../../../components/NoStatsMessage";
import { useBestPlayersStats } from "../../ClubTabs/BestPlayersTab/hooks/useBestPlayersStats";
import { statConfigs } from "../../ClubTabs/BestPlayersTab/constants/statConfigs";
import { UseRatingColor } from "../../../../../common/hooks/Colors/GetOverallColor";
import Card from "../../../../../ui/Card";
import Styles from "./PlayerDetailedStatsTab.module.css";

export type PlayerDetailedStatsTabProps = {
  season: ClubData;
  career: Career;
  player?: Players;
};

export const PlayerDetailedStatsTab = ({
  season,
  career,
  player,
}: PlayerDetailedStatsTabProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const statsData = useBestPlayersStats(season, career, isGeralPage, 0);

  const playerStats = useMemo(() => {
    if (!player) return null;
    const normalizedName = player.name.trim().toLowerCase();
    const normalizedNation = player.nation.trim().toLowerCase();

    return statsData.find((d) => {
      if (isGeralPage) {
        return (
          d.player.name.trim().toLowerCase() === normalizedName &&
          d.player.nation.trim().toLowerCase() === normalizedNation
        );
      }
      return d.player.id === player.id;
    });
  }, [statsData, player, isGeralPage]);

  if (!playerStats || playerStats.games === 0) {
    return (
      <ContainerClubContent>
        <NoStatsMessage
          textOne="Nenhuma estatística detalhada"
          textTwo={
            isGeralPage
              ? "Este jogador não possui estatísticas detalhadas de partidas registradas no geral."
              : "Este jogador não possui estatísticas detalhadas de partidas registradas nesta temporada."
          }
        />
      </ContainerClubContent>
    );
  }

  return (
    <ContainerClubContent>
      <Card className={Styles.card}>
        <h2 className={Styles.title}>Estatísticas Detalhadas</h2>

        <div className={Styles.grid}>
          {statConfigs.map((config) => {
            const rawValue = playerStats[config.key] as number;

            if (
              config.title.includes("Frequência") &&
              playerStats.goals === 0 &&
              config.key === "goalFrequency"
            )
              return null;
            if (
              config.title.includes("Frequência") &&
              playerStats.assists === 0 &&
              config.key === "assistFrequency"
            )
              return null;
            if (
              config.title.includes("Frequência") &&
              playerStats.goals + playerStats.assists === 0 &&
              config.key === "participationFrequency"
            )
              return null;

            const displayValue = config.format
              ? config.format(rawValue)
              : Number.isInteger(rawValue)
                ? rawValue
                : rawValue.toFixed(1);

            return (
              <div key={config.key} className={Styles.statItem}>
                <span className={Styles.statTitle}>{config.title}</span>
                {config.isRating ? (
                  <span
                    className={Styles.ratingBadge}
                    style={{ backgroundColor: UseRatingColor(+rawValue) }}
                  >
                    {Number(rawValue) % 1 === 0
                      ? Number(rawValue).toString()
                      : displayValue}
                  </span>
                ) : (
                  <span className={Styles.statValue}>{displayValue}</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </ContainerClubContent>
  );
};

export default PlayerDetailedStatsTab;
