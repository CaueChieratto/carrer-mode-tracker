import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Career } from "../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import { Players } from "../../../../../common/interfaces/playersInfo/players";
import { ContainerClubContent } from "../../../../../components/ContainerClubContent";
import NoStatsMessage from "../../../../../components/NoStatsMessage";
import { ButtonsSwitch } from "./components/ButtonsSwitch";
import { MatchCard } from "./components/MatchCard";
import { MatchStatus } from "./types/MatchStatus";
import { MONTH_OPTIONS } from "./constants/MONTH_OPTIONS";
import { getMatchSeason, processMatches } from "./helpers/processMatches";

type AllMatchesTabProps = {
  season: ClubData;
  career: Career;
  onAddBadge?: (teamName: string) => void;
  player?: Players;
};

export const AllMatchesTab = ({
  season,
  career,
  onAddBadge,
  player,
}: AllMatchesTabProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const storageKeySuffix = isGeralPage ? "geral" : season.id;

  const [activeTab, setActiveTab] = useState<MatchStatus | string>(() => {
    return (
      localStorage.getItem(`matchActiveTab_${storageKeySuffix}`) || "SCHEDULED"
    );
  });
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return (
      localStorage.getItem(`matchSelectedMonth_${storageKeySuffix}`) || "Tudo"
    );
  });
  const [selectedSeasonLabel, setSelectedSeasonLabel] = useState<string>(() => {
    return (
      localStorage.getItem(`matchSelectedSeason_${storageKeySuffix}`) || "Todas"
    );
  });

  useEffect(() => {
    localStorage.setItem(`matchActiveTab_${storageKeySuffix}`, activeTab);
    localStorage.setItem(
      `matchSelectedMonth_${storageKeySuffix}`,
      selectedMonth,
    );
    localStorage.setItem(
      `matchSelectedSeason_${storageKeySuffix}`,
      selectedSeasonLabel,
    );
  }, [activeTab, selectedMonth, selectedSeasonLabel, storageKeySuffix]);

  const seasonOptions = [
    "Todas",
    ...(career.clubData?.map((s) => `Temporada ${s.seasonNumber}`) || []),
  ];

  const selectedSeasonId =
    selectedSeasonLabel === "Todas"
      ? undefined
      : career.clubData?.find(
          (s) => `Temporada ${s.seasonNumber}` === selectedSeasonLabel,
        )?.id;

  const matches = processMatches({
    season,
    career,
    isGeralPage,
    activeTab,
    selectedMonth,
    selectedSeasonId,
    playerId: player?.id,
  });

  return (
    <>
      <ContainerClubContent isMatch>
        <ButtonsSwitch
          isMatches
          isGeralPage={isGeralPage}
          selectOptions={MONTH_OPTIONS}
          selectValue={selectedMonth}
          onSelectChange={setSelectedMonth}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          seasonOptions={seasonOptions}
          seasonValue={selectedSeasonLabel}
          onSeasonChange={setSelectedSeasonLabel}
        />
        {!matches.length ? (
          <NoStatsMessage
            textOne="Nenhuma partida encontrada"
            textTwo={
              player
                ? "O jogador ainda não tem partidas com minutos jogados."
                : "Primeiro, adicione as partidas do time."
            }
          />
        ) : (
          matches.map((match) => {
            const matchSeason = getMatchSeason(
              match.matchesId,
              career,
              season,
              isGeralPage,
            );

            const playerStat = player?.id
              ? match.playerStats?.find((p) => p.playerId === player.id)
              : undefined;

            return (
              <MatchCard
                key={`${match.date}-${match.homeTeam}-${match.awayTeam}`}
                match={match}
                season={matchSeason}
                isGeralPage={isGeralPage}
                career={career}
                onAddBadge={onAddBadge}
                playerStat={playerStat}
              />
            );
          })
        )}
      </ContainerClubContent>
    </>
  );
};
