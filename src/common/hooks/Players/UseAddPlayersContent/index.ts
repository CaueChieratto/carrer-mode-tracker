import { useRef } from "react";
import { getAddPlayerConfig } from "../../../constants/AddPlayerConfig";
import { Players } from "../../../interfaces/playersInfo/players";
import { useModalManager } from "../../Modal/UseModalManager";
import { usePlayerActions } from "../UsePlayerActions";
import { usePlayerStats } from "../UsePlayerStats";

type UseAddPlayersContentProps = {
  origin: string | null;
  careerId: string;
  seasonId: string;
  player?: Players;
  currentPlayers?: Players[];
  handleGoBack: () => void;
};

export const useAddPlayersContent = ({
  origin,
  careerId,
  seasonId,
  player,
  currentPlayers,
  handleGoBack,
}: UseAddPlayersContentProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const modalManager = useModalManager();

  const {
    isLoading: isActionsLoading,
    handleAddOrEditPlayer,
    handleDeletePlayer,
    handleSellPlayer,
  } = usePlayerActions({
    careerId,
    seasonId,
    player,
    currentPlayers,
    onSuccess: handleGoBack,
  });

  const { handleStatsSave, isStatsLoading } = usePlayerStats({
    careerId,
    currentPlayers,
    handleGoBack,
  });

  const componentConfig = getAddPlayerConfig(
    player,
    handleAddOrEditPlayer,
    handleStatsSave
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
    activeLabel,
    ActiveComponent,
    handleSave,
  };
};
