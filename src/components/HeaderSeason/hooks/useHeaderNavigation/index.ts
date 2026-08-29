import { useLocation, useNavigate, useParams } from "react-router-dom";

type UseHeaderNavigationProps = {
  careerId: string;
  backSeasons?: () => void;
  isPlayer?: boolean;
};

export const useHeaderNavigation = ({
  careerId,
  backSeasons,
  isPlayer,
}: UseHeaderNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seasonId } = useParams<{ seasonId?: string }>();

  const handleGoBack = () => {
    const searchParams = new URLSearchParams(location.search);
    const fromPlayerId = searchParams.get("playerId");
    const isFromGeral = searchParams.get("fromGeral") === "true";
    const isFromSeasonPlayer = searchParams.get("fromSeasonPlayer") === "true";
    const fromGroup = searchParams.get("fromGroup") === "true";
    const groupIdFromSearch = searchParams.get("groupId");

    if (fromPlayerId) {
      if (isFromSeasonPlayer && seasonId) {
        navigate(
          `/Career/${careerId}/Season/${seasonId}/Player/${fromPlayerId}`,
        );
        return;
      }
      if (isFromGeral) {
        navigate(`/Career/${careerId}/Geral/Player/${fromPlayerId}`);
        return;
      }
      if (seasonId) {
        navigate(
          `/Career/${careerId}/Season/${seasonId}/EditPlayer/${fromPlayerId}`,
        );
        return;
      }
      navigate(`/Career/${careerId}`);
      return;
    }

    if (backSeasons) {
      backSeasons();
      return;
    }

    if (isPlayer) {
      if (fromGroup && groupIdFromSearch) {
        navigate(`/CareerGroup/${groupIdFromSearch}/Geral`);
        return;
      }
      if (location.pathname.includes("/Geral")) {
        navigate(`/Career/${careerId}/Geral`);
      } else if (seasonId) {
        navigate(`/Career/${careerId}/Season/${seasonId}`);
      } else {
        navigate(`/Career/${careerId}`);
      }
      return;
    }

    if (
      location.pathname.includes("/CareerGroup") &&
      location.pathname.includes("/Geral")
    ) {
      navigate("/CareersPage");
      return;
    }

    navigate(`/Career/${careerId}`);
  };

  return { handleGoBack };
};
