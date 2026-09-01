import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../../common/services/Firebase";
import { useSeasonData } from "../../../../common/hooks/Seasons/UseSeasonData";
import { Match } from "../../../../common/interfaces/Match";
import { PlayerMatchStat } from "../../../../common/interfaces/PlayerMatchStat";

export const useMatchData = () => {
  const { careerId, seasonId, matchesId } = useParams<{
    careerId: string;
    seasonId: string;
    matchesId: string;
  }>();

  const navigate = useNavigate();
  const location = useLocation();
  const isFromGeral = location.search.includes("fromGeral=true");

  const {
    career,
    season,
    loading: seasonLoading,
  } = useSeasonData(careerId, seasonId);
  const initialMatch = season?.matches?.find((m) => m.matchesId === matchesId);

  const [match, setMatch] = useState<Match | undefined>(initialMatch);
  const [loading, setLoading] = useState(true);

  const fetchSubcollectionStats = useCallback(async () => {
    if (seasonLoading) return;

    if (!initialMatch || !careerId || !seasonId || !matchesId) {
      setMatch(initialMatch);
      setLoading(false);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setMatch(initialMatch);
      setLoading(false);
      return;
    }

    try {
      const statsRef = collection(
        db,
        `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/matches/${matchesId}/playerStats`,
      );
      const statsSnap = await getDocs(statsRef);
      const subcollectionStats = statsSnap.docs.map(
        (doc) => doc.data() as PlayerMatchStat,
      );

      if (subcollectionStats.length === 0) {
        setMatch(initialMatch);
      } else {
        const statsMap = new Map<string, PlayerMatchStat>();

        if (initialMatch.playerStats) {
          initialMatch.playerStats.forEach((stat) =>
            statsMap.set(stat.playerId, stat),
          );
        }

        subcollectionStats.forEach((stat) => statsMap.set(stat.playerId, stat));

        setMatch({
          ...initialMatch,
          playerStats: Array.from(statsMap.values()),
        });
      }
    } catch (error) {
      console.error("Erro ao buscar as estatísticas da subcoleção:", error);
      setMatch(initialMatch);
    } finally {
      setLoading(false);
    }
  }, [initialMatch, careerId, seasonId, matchesId, seasonLoading]);

  useEffect(() => {
    fetchSubcollectionStats();
  }, [fetchSubcollectionStats]);

  const goBack = () => {
    if (isFromGeral) {
      navigate(`/Career/${careerId}/Geral`);
    } else {
      navigate(`/Career/${careerId}/Season/${seasonId}`);
    }
  };

  const updateLocalMatch = useCallback((updatedFields: Partial<Match>) => {
    setMatch((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  }, []);

  return {
    careerId,
    matchesId,
    career,
    season,
    match,
    loading: seasonLoading || loading,
    goBack,
    isFromGeral,
    updateLocalMatch,
  };
};
