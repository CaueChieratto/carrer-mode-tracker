import Load from "../../components/Load";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import TransfersModal from "../../components/TransfersModal";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";
import { ModalType } from "../../common/types/enums/ModalType";
import BottomMenu from "../../ui/BottomMenu";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";
import SectionView from "../../layout/SectionView";
import { useState } from "react";

const Season = () => {
  const [hasOpenScreen, setHasOpenScreen] = useState(false);
  const {
    loading,
    career,
    season,
    tabsConfig,
    isModalOpen,
    transferType,
    playersToShow,
    handleOpenTransfers,
    handleCloseModal,
  } = useSeasonView(false);

  const { activeModal } = useModalManager();

  if (loading) return <Load />;
  if (!career || !season) return <NotFoundDisplay />;

  return (
    <>
      <SectionView
        career={career}
        season={season}
        tabsConfig={tabsConfig}
        onOpenTransfers={handleOpenTransfers}
        onScreenChange={setHasOpenScreen}
      />
      <TransfersModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        transferType={transferType}
        playersToShow={playersToShow}
        currency={career.currency}
      />
      {activeModal === ModalType.NONE && !hasOpenScreen && <BottomMenu />}
    </>
  );
};

export default Season;
