import { useNavigate, useParams } from "react-router-dom";

type UseMatchNavigationParams = {
  seasonId: string;
  matchId: string;
  isGeralPage: boolean;
};

export const useMatchNavigation = ({
  seasonId,
  matchId,
  isGeralPage,
}: UseMatchNavigationParams) => {
  const { careerId, seasonId: paramSeasonId } = useParams();
  const navigate = useNavigate();

  const currentSeasonId = paramSeasonId || seasonId;

  const buildUrl = (path: string) => {
    const base = `/Career/${careerId}/Season/${currentSeasonId}/${path}/${matchId}`;
    return isGeralPage ? `${base}?fromGeral=true` : base;
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
