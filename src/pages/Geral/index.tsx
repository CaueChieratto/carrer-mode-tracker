import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSeasonTabsConfig } from "../../common/constants/SeasonTabsConfig";
import Load from "../../components/Load";
import Modal from "../../components/Modal";
import SlideUpModal from "../../ui/modals/SlideUpModal";
import TransfersPanel from "../../components/TransfersPanel";
import SeasonContent from "../../components/SeasonContent";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { useOpenTransfersModal } from "../../common/hooks/Modal/UseOpenTransfersModal";
import { useCareers } from "../../common/hooks/Career/UseCareer";
import { ClubData } from "../../common/interfaces/club/clubData";

const Geral = () => {
  const { careerId } = useParams<{
    careerId: string;
  }>();
  const navigate = useNavigate();
  const { careers, loading } = useCareers();

  const career = useMemo(
    () => careers.find((c) => c.id === careerId),
    [careers, careerId]
  );

  const latestSeason = useMemo(() => {
    if (!career || !career.clubData || career.clubData.length === 0) {
      return null;
    }
    return career.clubData.reduce((latest: ClubData, current: ClubData) => {
      return current.seasonNumber > latest.seasonNumber ? current : latest;
    });
  }, [career]);

  const tabsConfig = useMemo(() => {
    if (!latestSeason) return [];
    return getSeasonTabsConfig(careerId!, latestSeason.id, navigate);
  }, [careerId, latestSeason, navigate]);

  const {
    isModalOpen,
    transferType,
    playersToShow,
    handleOpenTransfers,
    handleCloseModal,
  } = useOpenTransfersModal(career, latestSeason ?? undefined);

  if (loading) return <Load />;
  if (!career || !latestSeason) return <NotFoundDisplay />;

  return (
    <>
      <SeasonContent
        career={career}
        season={latestSeason}
        tabsConfig={tabsConfig}
        onOpenTransfers={handleOpenTransfers}
      />
      <Modal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        slideUp
        text={transferType === "arrivals" ? "Chegadas" : "Saídas"}
      >
        <SlideUpModal>
          <TransfersPanel
            title={transferType === "arrivals" ? "Chegadas" : "Saídas"}
            players={playersToShow}
          />
        </SlideUpModal>
      </Modal>
    </>
  );
};

export default Geral;
