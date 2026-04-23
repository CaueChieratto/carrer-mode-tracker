import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSeasonData } from "../../../common/hooks/Seasons/UseSeasonData";

export const useMatchData = () => {
  const { careerId, seasonId, matchesId } = useParams<{
    careerId: string;
    seasonId: string;
    matchesId: string;
  }>();

  const navigate = useNavigate();
  const location = useLocation();

  const isFromGeral = location.search.includes("fromGeral=true");

  const { career, season, loading } = useSeasonData(careerId, seasonId);
  const match = season?.matches?.find((m) => m.matchesId === matchesId);

  const goBack = () => {
    if (isFromGeral) {
      navigate(`/Career/${careerId}/Geral`);
    } else {
      navigate(`/Career/${careerId}/Season/${seasonId}`);
    }
  };

  const backMatch = () => {
    navigate(`/Career/${careerId}/Season/${seasonId}/match/${matchesId}`);
  };

  return {
    careerId,
    seasonId,
    matchesId,
    career,
    season,
    match,
    loading,
    goBack,
    backMatch,
    isFromGeral,
  };
};
