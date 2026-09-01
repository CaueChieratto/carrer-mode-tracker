import { useMemo, useEffect } from "react";
import { getAvailableGoalOptions } from "../../helpers/getAvailableGoalOptions";
import { getSubstitutionData } from "../../helpers/getSubstitutionData";
import { isPlayerInLineup } from "../../helpers/isPlayerInLineup";
import { UseAddMatchStatsPlayerProps } from "../../types";
import { usePlayerStatsForm } from "../usePlayerStatsForm";
import { useSavePlayerStats } from "../useSavePlayerStats";

export const useAddMatchStatsPlayer = ({
  career,
  match,
  onClose,
  playerId,
  season,
  onSaved,
}: UseAddMatchStatsPlayerProps) => {
  const playerIsInLineup = useMemo(
    () => isPlayerInLineup(match, playerId),
    [match, playerId],
  );

  useEffect(() => {
    if (!playerIsInLineup) {
      onClose();
    }
  }, [playerIsInLineup, onClose]);

  const player = useMemo(
    () => season.players.find((currentPlayer) => currentPlayer.id === playerId),
    [season, playerId],
  );

  const isGoalkeeper = player?.position === "GOL" || player?.position === "GK";

  const substitutionData = useMemo(() => {
    if (!player) {
      return {
        isStarter: true,
        options: ["Nenhum"],
      };
    }

    return getSubstitutionData(match, season, player);
  }, [match, season, player]);

  const availableGoalsForAssist = useMemo(
    () =>
      getAvailableGoalOptions({
        player,
        players: season.players,
        playerStats: match.playerStats,
      }),
    [match.playerStats, player, season.players],
  );

  const {
    formValues,
    booleanValues,
    formFields,
    handleLocalBooleanChange,
    handleKeyDown,
    handleKeyUp,
    handleLocalInputChange,
  } = usePlayerStatsForm({
    match,
    season,
    playerId,
    playerIsInLineup,
    substitutionData,
    availableGoalsForAssist,
  });

  const { isSaving, savePlayerStats } = useSavePlayerStats({
    career,
    season,
    match,
    player,
    formValues,
    booleanValues,
    onSaved,
    onClose,
  });

  return {
    isSaving,
    player,
    isGoalkeeper,
    formFields,
    formValues,
    isPlayerInLineup: playerIsInLineup,
    handleLocalBooleanChange,
    handleKeyDown,
    handleKeyUp,
    handleLocalInputChange,
    savePlayerStats,
  };
};
