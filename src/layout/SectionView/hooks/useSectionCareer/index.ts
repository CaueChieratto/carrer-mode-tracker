import { useCallback, useEffect, useState } from "react";
import type { Career } from "../../../../common/interfaces/Career";
import { ServicePlayers } from "../../../../common/services/ServicePlayers";
import { ServiceMatches } from "../../features/ClubTabs/AllMatchesTab/views/AddMatches/services/ServiceMatches";
import {
  applyOptimisticUpdate,
  OptimisticUpdateData,
  replaceSeasonData,
} from "../../helpers/updateSectionCareer";
import { ServiceTable } from "../../features/ClubTabs/TableTab/views/AddTeamsToTable/services/ServiceTable";
import { TableRowData } from "../../../../common/interfaces/Table";

interface UseSectionCareerResult {
  localCareer: Career;
  refreshSeason: (targetSeasonId?: string) => Promise<void>;
  updateMatchesOptimistically: (
    optimisticData: OptimisticUpdateData,
    targetSeasonId?: string,
  ) => void;
}

export function useSectionCareer(
  career: Career,
  defaultSeasonId: string,
): UseSectionCareerResult {
  const [localCareer, setLocalCareer] = useState<Career>(career);

  useEffect(() => {
    setLocalCareer((previousCareer) => {
      if (previousCareer.id !== career.id) {
        return career;
      }

      return {
        ...career,
        clubData: career.clubData.map((incomingSeason) => {
          const localSeason = previousCareer.clubData.find(
            (season) => season.id === incomingSeason.id,
          );

          if (!localSeason) {
            return incomingSeason;
          }

          return {
            ...incomingSeason,
            table: localSeason.table ?? incomingSeason.table,
            matches: localSeason.matches ?? incomingSeason.matches,
            players: localSeason.players ?? incomingSeason.players,
            teams: localSeason.teams ?? incomingSeason.teams,
          };
        }),
      };
    });
  }, [career]);

  const refreshSeason = useCallback(
    async (targetSeasonId = defaultSeasonId) => {
      try {
        const [matches, players, tableData] = await Promise.all([
          ServiceMatches.getMatchesBySeason(career.id, targetSeasonId),
          ServicePlayers.getPlayersBySeason(career.id, targetSeasonId),
          ServiceTable.getTableBySeason(career.id, targetSeasonId),
        ]);

        setLocalCareer((currentCareer) =>
          replaceSeasonData(
            currentCareer,
            targetSeasonId,
            { matches, players, table: tableData as unknown as TableRowData[] },
            Date.now(),
          ),
        );
      } catch (erro) {
        console.error("Erro: ", erro);
      }
    },
    [career.id, defaultSeasonId],
  );

  const updateMatchesOptimistically = useCallback(
    (
      optimisticData: OptimisticUpdateData,
      targetSeasonId = defaultSeasonId,
    ) => {
      setLocalCareer((currentCareer) =>
        applyOptimisticUpdate(currentCareer, targetSeasonId, optimisticData),
      );
    },
    [defaultSeasonId],
  );

  return {
    localCareer,
    refreshSeason,
    updateMatchesOptimistically,
  };
}
