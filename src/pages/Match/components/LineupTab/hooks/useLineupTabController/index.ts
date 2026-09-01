import { useMemo } from "react";
import { buildEffectiveLineup } from "../../helpers/buildEffectiveLineup";
import { getMvpPlayerId } from "../../helpers/getMvpPlayerId";
import type { LineupTabProps } from "../../types";
import { useLineup } from "../useLineup";
import { useLineupPersistence } from "../useLineupPersistence";
import { usePlayerStatsNavigation } from "../usePlayerStatsNavigation";

type UseLineupTabControllerParams = Pick<
  LineupTabProps,
  "season" | "match" | "onRegisterSave" | "onOpenScreen" | "onSaved"
>;

export const useLineupTabController = ({
  season,
  match,
  onRegisterSave,
  onOpenScreen,
  onSaved,
}: UseLineupTabControllerParams) => {
  const effectiveLineup = useMemo(
    () => buildEffectiveLineup(match, season.matches),
    [match, season.matches],
  );

  const { buildSavedLineup, ...lineupState } = useLineup(
    season,
    effectiveLineup,
  );

  const { getSavedLineup } = useLineupPersistence({
    match,
    buildSavedLineup,
    onRegisterSave,
    onSaved,
  });

  const handlePlayerClick = usePlayerStatsNavigation({
    getSavedLineup,
    onOpenScreen,
  });

  const mvpId = useMemo(
    () => getMvpPlayerId(match.playerStats),
    [match.playerStats],
  );

  return {
    ...lineupState,
    playerStats: match.playerStats || [],
    mvpId,
    handlePlayerClick,
  };
};
