import { ReactNode } from "react";
import { TransferPlayerContext } from "../context";
import { useTransferForm } from "../../hooks/useTransferForm";
import { Career } from "../../../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../../../common/interfaces/club/clubData";
import { Players } from "../../../../../../../../../common/interfaces/playersInfo/players";

type ProviderProps = {
  career: Career;
  season: ClubData;
  player: Players;
  mode?: "transfer" | "loan";
  onClose: () => void;
  children: ReactNode;
};

export const TransferPlayerProvider = ({
  career,
  season,
  player,
  mode,
  onClose,
  children,
}: ProviderProps) => {
  const transferForm = useTransferForm({
    careerId: career.id,
    season,
    career,
    player,
    currentPlayers: season.players,
    handleGoBack: onClose,
    initialMode: mode,
  });

  return (
    <TransferPlayerContext.Provider
      value={{ career, season, player, onClose, ...transferForm }}
    >
      {children}
    </TransferPlayerContext.Provider>
  );
};
