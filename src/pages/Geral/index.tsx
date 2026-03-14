import Load from "../../ui/Load";
import SectionView from "../../components/SectionView";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import TransfersModal from "../../components/TransfersModal";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";
import { useModalManager } from "../../managers/hooks/useModalManager";
import { ModalType } from "../../managers/enum/ModalType";
import BottomMenu from "../../layouts/BottomMenu";

const Geral = () => {
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
  } = useSeasonView(true);
  const { activeModal } = useModalManager();

  if (loading) return <Load />;
  if (!career || !season) return <NotFoundDisplay />;

  return (
    <>
      <SectionView
        notSeason
        title="Geral"
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
      {activeModal === ModalType.NONE && !isModalOpen && <BottomMenu />}
    </>
  );
};

export default Geral;
