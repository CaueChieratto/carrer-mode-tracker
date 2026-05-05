import { useRef } from "react";
import { getAddPlayerConfig } from "../../constants/AddPlayerConfig";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { useModalManager } from "../../../../../../common/hooks/Modal/UseModalManager";
import { usePlayerActions } from "../../../../../../common/hooks/Players/UsePlayerActions";
import { usePlayerStats } from "../../../../../../common/hooks/Players/UsePlayerStats";
import { Career } from "../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";

type UseAddPlayersContentProps = {
  origin: string | null;
  careerId: string;
  seasonId: string;
  player?: Players;
  currentPlayers?: Players[];
  handleGoBack: () => void;
  career: Career;
  season: ClubData;
};

export const useAddPlayersContent = ({
  origin,
  careerId,
  seasonId,
  player,
  currentPlayers,
  handleGoBack,
  career,
  season,
}: UseAddPlayersContentProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const modalManager = useModalManager();

  const {
    isLoading: isActionsLoading,
    handleAddOrEditPlayer,
    handleDeletePlayer,
    handleSellPlayer,
    handleReturnLoanPlayer,
  } = usePlayerActions({
    careerId,
    seasonId,
    player,
    currentPlayers,
    onSuccess: handleGoBack,
    career,
    season,
  });

  const { handleStatsSave, isStatsLoading } = usePlayerStats({
    careerId,
    currentPlayers,
    handleGoBack,
  });

  const componentConfig = getAddPlayerConfig(
    player,
    handleAddOrEditPlayer,
    handleStatsSave,
  );

  const activeKey = origin && componentConfig[origin] ? origin : "squad";

  const {
    label: activeLabel,
    component: ActiveComponent,
    saveAction,
  } = componentConfig[activeKey];

  const handleSave = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      saveAction(formData);
    }
  };

  const isLoading = isActionsLoading || isStatsLoading;

  return {
    formRef,
    modalManager,
    isLoading,
    handleDeletePlayer,
    handleSellPlayer,
    handleReturnLoanPlayer,
    activeLabel,
    ActiveComponent,
    handleSave,
  };
};
