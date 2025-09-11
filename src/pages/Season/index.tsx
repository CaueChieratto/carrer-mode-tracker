import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSeasonData } from "../../common/hooks/Seasons/UseSeasonData";
import { getSeasonTabsConfig } from "../../common/constants/SeasonTabsConfig";
import Load from "../../components/Load";
import Modal from "../../components/Modal";
import SlideUpModal from "../../ui/modals/SlideUpModal";
import TransfersPanel from "../../components/TransfersPanel";
import { Players } from "../../common/interfaces/playersInfo/players";
import SeasonContent from "../../components/SeasonContent";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { getSeasonDateRange } from "../../common/utils/GetSeasonDateRange";

const Season = () => {
  const { careerId, seasonId } = useParams<{
    careerId: string;
    seasonId: string;
  }>();
  const navigate = useNavigate();
  const { career, season, loading } = useSeasonData(careerId, seasonId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<"arrivals" | "exit">(
    "arrivals"
  );
  const [playersToShow, setPlayersToShow] = useState<Players[]>([]);

  const tabsConfig = useMemo(
    () => getSeasonTabsConfig(careerId!, seasonId!, navigate),
    [careerId, seasonId, navigate]
  );

  const handleOpenTransfers = (type: "arrivals" | "exit") => {
    if (!season || !career) return;

    const { startDate, endDate } = getSeasonDateRange(
      season.seasonNumber,
      career.createdAt,
      career.nation
    );

    let filteredPlayers: Players[];
    if (type === "arrivals") {
      filteredPlayers = season.players
        .filter((p) => {
          const arrivalDate = p.contract?.[p.contract.length - 1]?.dataArrival;
          return (
            p.buy &&
            arrivalDate &&
            new Date(arrivalDate) >= startDate &&
            new Date(arrivalDate) <= endDate
          );
        })
        .sort(
          (a, b) =>
            new Date(b.contract![0].dataArrival!).getTime() -
            new Date(a.contract![0].dataArrival!).getTime()
        );
    } else {
      filteredPlayers = season.players
        .filter((p) => {
          const exitDate = p.contract?.[p.contract.length - 1]?.dataExit;
          return (
            p.sell &&
            exitDate &&
            new Date(exitDate) >= startDate &&
            new Date(exitDate) <= endDate
          );
        })
        .sort(
          (a, b) =>
            new Date(b.contract![0].dataExit!).getTime() -
            new Date(a.contract![0].dataExit!).getTime()
        );
    }

    setPlayersToShow(filteredPlayers);
    setTransferType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <Load />;
  if (!career || !season) return <NotFoundDisplay />;

  return (
    <>
      <SeasonContent
        career={career}
        season={season}
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

export default Season;
