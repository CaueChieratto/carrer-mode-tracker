import { useParams, useNavigate } from "react-router-dom";
import { useSeasonData } from "../../../common/hooks/Seasons/UseSeasonData";

export const useMatchData = () => {
  const { careerId, seasonId, matchesId } = useParams<{
    careerId: string;
    seasonId: string;
    matchesId: string;
  }>();
  const navigate = useNavigate();

  const { career, season, loading } = useSeasonData(careerId, seasonId);
  const match = season?.matches?.find((m) => m.matchesId === matchesId);

  const goBack = () => {
    navigate(`/Career/${careerId}/Season/${seasonId}`);
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
  };
};
