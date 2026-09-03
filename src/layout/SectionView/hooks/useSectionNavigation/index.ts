import { useCallback, useEffect } from "react";
import type { Career } from "../../../../common/interfaces/Career";
import type { ClubData } from "../../../../common/interfaces/club/clubData";
import type { SectionScreen } from "../../config/screens";
import type { OptimisticUpdateData } from "../../helpers/updateSectionCareer";
import { useScreenStack } from "../../navigation/useScreenStack";

interface UseSectionNavigationParams {
  career: Career;
  fallbackSeason: ClubData;
  onScreenChange?: (hasOpenScreen: boolean) => void;
  refreshSeason: (targetSeasonId?: string) => Promise<void>;
  updateMatchesOptimistically: (
    optimisticData: OptimisticUpdateData,
    targetSeasonId?: string,
  ) => void;
}

export function useSectionNavigation({
  career,
  fallbackSeason,
  onScreenChange,
  refreshSeason,
  updateMatchesOptimistically,
}: UseSectionNavigationParams) {
  const {
    current: screen,
    push: openScreen,
    pop: closeScreen,
  } = useScreenStack<SectionScreen>();

  useEffect(() => {
    onScreenChange?.(Boolean(screen));
  }, [onScreenChange, screen]);

  const screenSeasonId = screen?.seasonId;

  const screenSeason = screenSeasonId
    ? (career.clubData.find((season) => season.id === screenSeasonId) ??
      fallbackSeason)
    : fallbackSeason;

  const handleCloseScreen = useCallback(
    (optimisticData?: OptimisticUpdateData) => {
      if (optimisticData) {
        updateMatchesOptimistically(optimisticData, screenSeasonId);
      }

      closeScreen();
      void refreshSeason(screenSeasonId);
    },
    [closeScreen, refreshSeason, screenSeasonId, updateMatchesOptimistically],
  );

  return {
    screen,
    season: screenSeason,
    open: openScreen,
    close: handleCloseScreen,
  };
}
