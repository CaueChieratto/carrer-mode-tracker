import ModalManager from "../../../../common/constants/ModalManager";
import type { Career } from "../../../../common/interfaces/Career";
import type { ClubData } from "../../../../common/interfaces/club/clubData";
import { ModalType } from "../../../../common/types/enums/ModalType";
import type { SectionModalController } from "../../hooks/useSectionModal";

interface SectionModalProps {
  career: Career;
  season: ClubData;
  controller: SectionModalController;
}

export function SectionModal({
  career,
  season,
  controller,
}: SectionModalProps) {
  if (controller.activeModal === ModalType.NONE) return null;

  return (
    <ModalManager
      activeModal={controller.activeModal}
      selectedCareer={controller.selectedCareer ?? career}
      setSelectedCareer={controller.setSelectedCareer}
      selectedSeason={controller.selectedSeason ?? season}
      onClose={controller.close}
      career={career}
      teamName={controller.teamName}
    />
  );
}
