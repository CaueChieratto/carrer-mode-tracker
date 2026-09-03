import { useCallback, useState } from "react";
import { useModalManager } from "../../../../common/hooks/Modal/UseModalManager";
import type { Career } from "../../../../common/interfaces/Career";
import type { ClubData } from "../../../../common/interfaces/club/clubData";
import { ModalType } from "../../../../common/types/enums/ModalType";

type ModalManagerController = ReturnType<typeof useModalManager>;

export type SectionModalController = Pick<
  ModalManagerController,
  "activeModal" | "selectedCareer" | "selectedSeason" | "setSelectedCareer"
> & {
  close: () => void;
  openAddBadge: (teamName: string) => void;
  teamName: string;
};

interface UseSectionModalParams {
  career: Career;
  season: ClubData;
  refreshSeason: (targetSeasonId?: string) => Promise<void>;
}

export function useSectionModal({
  career,
  season,
  refreshSeason,
}: UseSectionModalParams): SectionModalController {
  const {
    activeModal,
    openModal,
    closeModal,
    selectedSeason,
    selectedCareer,
    setSelectedCareer,
  } = useModalManager();

  const [teamName, setTeamName] = useState("");

  const close = useCallback(() => {
    closeModal();
    void refreshSeason();
  }, [closeModal, refreshSeason]);

  const openAddBadge = useCallback(
    (selectedTeamName: string) => {
      setTeamName(selectedTeamName);
      openModal(ModalType.ADD_BADGE_CLUB, career, season);
    },
    [career, openModal, season],
  );

  return {
    activeModal,
    selectedCareer,
    selectedSeason,
    setSelectedCareer,
    close,
    openAddBadge,
    teamName,
  };
}
