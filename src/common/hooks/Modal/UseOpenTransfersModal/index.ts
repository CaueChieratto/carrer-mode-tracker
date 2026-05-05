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
      const allPlayers = career.clubData.flatMap((s) => s.players || []);

      if (type === "arrivals") {
        filteredPlayers = allPlayers.filter((p) =>
          p.contract?.some((c) => c.fromClub),
        );
      } else {
        filteredPlayers = allPlayers.filter((p) =>
          p.contract?.some((c) => c.leftClub),
        );
      }
    } else {
      const { startDate, endDate } = getSeasonDateRange(
        season.seasonNumber,
        career.createdAt,
        career.nation,
      );

      if (type === "arrivals") {
        filteredPlayers = (season.players || []).filter((p) => {
          return p.contract?.some((c) => {
            if (!c.fromClub) return false;
            const arrivalDate = c.dataArrival || career.createdAt;
            return (
              new Date(arrivalDate) >= startDate &&
              new Date(arrivalDate) <= endDate
            );
          });
        });
      } else {
        filteredPlayers = (season.players || []).filter((p) => {
          return p.contract?.some((c) => {
            if (!c.leftClub) return false;
            const exitDate = c.dataExit || career.createdAt;
            return (
              new Date(exitDate) >= startDate && new Date(exitDate) <= endDate
            );
          });
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
