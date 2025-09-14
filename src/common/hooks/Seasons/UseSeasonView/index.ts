import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSeasonTabsConfig } from "../../../constants/SeasonTabsConfig";
import { ClubData } from "../../../interfaces/club/clubData";
import { useCareers } from "../../Career/UseCareer";
import { useOpenTransfersModal } from "../../Modal/UseOpenTransfersModal";
import { useAggregatedPlayers } from "../../Players/UseAggregatedPlayers";

export const useSeasonView = (isGeralPage: boolean, isPlayer?: boolean) => {
  const { careerId, seasonId } = useParams<{
    careerId: string;
    seasonId?: string;
  }>();
  const navigate = useNavigate();
  const { careers, loading } = useCareers();

  const career = useMemo(
    () => careers.find((c) => c.id === careerId),
    [careers, careerId]
  );

  const aggregatedPlayers = useAggregatedPlayers(career);

  const latestSeason = useMemo(() => {
    if (!career || !career.clubData || career.clubData.length === 0) {
      return undefined;
    }
    return career.clubData.reduce((latest: ClubData, current: ClubData) => {
      return current.seasonNumber > latest.seasonNumber ? current : latest;
    });
  }, [career]);

  const seasonData = useMemo(() => {
    if (isGeralPage) {
      if (!latestSeason) return undefined;
      return {
        ...latestSeason,
        players: aggregatedPlayers,
      };
    }
    return career?.clubData.find((s) => s.id === seasonId);
  }, [isGeralPage, career, seasonId, latestSeason, aggregatedPlayers]);

  const tabsConfig = useMemo(() => {
    if (isGeralPage) {
      if (!latestSeason) return [];
      return getSeasonTabsConfig(
        careerId!,
        latestSeason.id,
        navigate,
        !!isPlayer
      );
    }
    if (!seasonId) return [];
    return getSeasonTabsConfig(careerId!, seasonId, navigate, !!isPlayer);
  }, [careerId, seasonId, navigate, isGeralPage, latestSeason, isPlayer]);

  const {
    isModalOpen,
    transferType,
    playersToShow,
    handleOpenTransfers,
    handleCloseModal,
  } = useOpenTransfersModal(
    career,
    isGeralPage ? latestSeason ?? undefined : seasonData
  );

  return {
    loading,
    career,
    season: seasonData,
    tabsConfig,
    isModalOpen,
    transferType,
    playersToShow,
    handleOpenTransfers,
    handleCloseModal,
  };
};
