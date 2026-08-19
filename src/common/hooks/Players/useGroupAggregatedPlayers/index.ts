import { useState, useEffect } from "react";
import { Career } from "../../../interfaces/Career";
import { Players } from "../../../interfaces/playersInfo/players";
import { ServicePlayers } from "../../../services/ServicePlayers";

export const useGroupAggregatedPlayers = (
  career: Career,
  isGeralPage: boolean,
) => {
  const [groupPlayers, setGroupPlayers] = useState<Players[]>([]);
  const [isLoadingGroup, setIsLoadingGroup] = useState(isGeralPage);

  useEffect(() => {
    const groupId = career?.groupId;
    const createdAt = career?.createdAt;

    if (!isGeralPage || !groupId || !createdAt) {
      setIsLoadingGroup(false);
      return;
    }

    const fetchStats = async () => {
      setIsLoadingGroup(true);
      try {
        const aggregated = await ServicePlayers.getAggregatedGroupStats(
          groupId,
          createdAt,
        );

        setGroupPlayers(aggregated);
      } catch (error) {
        console.error("Erro ao buscar estatísticas globais do grupo:", error);
      } finally {
        setIsLoadingGroup(false);
      }
    };

    fetchStats();
  }, [career, isGeralPage]);

  return { groupPlayers, isLoadingGroup };
};
