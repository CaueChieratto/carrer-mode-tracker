import { useNavigate, useParams } from "react-router-dom";

type UseMatchNavigationParams = {
  seasonId: string;
  matchId: string;
  isGeralPage: boolean;
  playerId?: string;
};

export const useMatchNavigation = ({
  seasonId,
  matchId,
  isGeralPage,
  playerId,
}: UseMatchNavigationParams) => {
  const { careerId, seasonId: paramSeasonId } = useParams();
  const navigate = useNavigate();

  const currentSeasonId = paramSeasonId || seasonId;

  const buildUrl = (path: string) => {
    const base = `/Career/${careerId}/Season/${currentSeasonId}/${path}/${matchId}`;
    const params = new URLSearchParams();

    if (isGeralPage) params.append("fromGeral", "true");
    if (playerId) params.append("playerId", playerId);

    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const goToEdit = () => {
    navigate(buildUrl("AddMatches"));
  };

  const goToMatch = () => {
    navigate(buildUrl("Match"));
  };

  return {
    goToEdit,
    goToMatch,
  };
};
