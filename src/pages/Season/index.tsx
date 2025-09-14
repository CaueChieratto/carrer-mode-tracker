import Load from "../../components/Load";
import SectionView from "../../components/SectionView";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import TransfersModal from "../../components/TransfersModal";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";

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
    </>
  );
};

export default Season;
