import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Career } from "../../../interfaces/Career";
import { ClubData } from "../../../interfaces/club/clubData";
import { Players } from "../../../interfaces/playersInfo/players";
import { getSeasonDateRange } from "../../../utils/GetSeasonDateRange";

type TransferType = "arrivals" | "exit";

export const useOpenTransfersModal = (career?: Career, season?: ClubData) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<TransferType>("arrivals");
  const [playersToShow, setPlayersToShow] = useState<Players[]>([]);
  const location = useLocation();

  const handleOpenTransfers = (type: TransferType) => {
    if (!season || !career) return;

    const isGeralPage = location.pathname.includes("/Geral");
    let filteredPlayers: Players[];

    if (isGeralPage) {
      const allPlayers = career.clubData.flatMap((s) => s.players);

      if (type === "arrivals") {
        filteredPlayers = allPlayers.filter((p) => p.buy);
      } else {
        filteredPlayers = allPlayers.filter((p) => p.sell);
      }
    } else {
      const { startDate, endDate } = getSeasonDateRange(
        season.seasonNumber,
        career.createdAt,
        career.nation
      );

      if (type === "arrivals") {
        filteredPlayers = season.players.filter((p) => {
          const arrivalDate = p.contract?.[p.contract.length - 1]?.dataArrival;
          return (
            p.buy &&
            arrivalDate &&
            new Date(arrivalDate) >= startDate &&
            new Date(arrivalDate) <= endDate
          );
        });
      } else {
        filteredPlayers = season.players.filter((p) => {
          const exitDate = p.contract?.[p.contract.length - 1]?.dataExit;
          return (
            p.sell &&
            exitDate &&
            new Date(exitDate) >= startDate &&
            new Date(exitDate) <= endDate
          );
        });
      }
    }

    setPlayersToShow(filteredPlayers);
    setTransferType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    transferType,
    playersToShow,
    handleOpenTransfers,
    handleCloseModal,
  };
};
