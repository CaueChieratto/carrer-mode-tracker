import Load from "../../components/Load";
import SectionView from "../../components/SectionView";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import TransfersModal from "../../components/TransfersModal";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";
import { ModalType } from "../../common/types/enums/ModalType";
import BottomMenu from "../../ui/BottomMenu";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";

const Season = () => {
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
      />
      <TransfersModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        transferType={transferType}
        playersToShow={playersToShow}
      />
      {activeModal === ModalType.NONE && <BottomMenu />}
    </>
  );
};

export default Season;
