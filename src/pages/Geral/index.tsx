import Load from "../../components/Load";
import SeasonContent from "../../components/SeasonContent";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import TransfersModal from "../../components/TransfersModal";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";

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

  if (loading) return <Load />;
  if (!career || !season) return <NotFoundDisplay />;

  return (
    <>
      <SeasonContent
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
    </>
  );
};

export default Geral;
