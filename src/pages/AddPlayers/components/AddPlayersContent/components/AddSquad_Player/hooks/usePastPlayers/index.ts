import { useState, useEffect } from "react";
import { Career } from "../../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../../common/interfaces/club/clubData";
import { Players } from "../../../../../../../../common/interfaces/playersInfo/players";
import { ServicePlayers } from "../../../../../../../../common/services/ServicePlayers";

export const usePastPlayers = (
  career: Career,
  season: ClubData,
  isEditing: boolean,
) => {
  const [pastPlayers, setPastPlayers] = useState<Players[]>([]);
  const [pastPlayerOptions, setPastPlayerOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchPastPlayers = async () => {
      if (career?.groupId && career?.createdAt && career?.id) {
        const cacheKey = `pastPlayers_${career.groupId}_${career.id}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        let playersToProcess: Players[] = [];

        if (cachedData) {
          playersToProcess = JSON.parse(cachedData) as Players[];
        } else {
          try {
            playersToProcess = await ServicePlayers.getPastGroupPlayers(
              career.groupId,
              career.createdAt,
              career.id,
            );
            sessionStorage.setItem(cacheKey, JSON.stringify(playersToProcess));
          } catch (error) {
            console.error("Erro: ", error);
          }
        }

        const currentActivePlayers = season.players
          .filter((p) => !p.sell)
          .map((p) => p.name.trim().toLowerCase());

        const availablePastPlayers = playersToProcess.filter(
          (p) => !currentActivePlayers.includes(p.name.trim().toLowerCase()),
        );

        setPastPlayers(availablePastPlayers);
        setPastPlayerOptions(availablePastPlayers.map((p) => p.name));
      }
    };

    if (!isEditing) {
      fetchPastPlayers();
    }
  }, [career, isEditing, season.players]);

  return { pastPlayers, pastPlayerOptions };
};
