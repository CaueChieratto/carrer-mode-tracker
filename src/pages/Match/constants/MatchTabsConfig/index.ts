import { NavigateFunction } from "react-router-dom";
import { Buttons } from "../../../../common/elements/Buttons";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Match } from "../../../../components/AllMatchesTab/types/Match";
import { LineupTab } from "../../components/LineupTab";
import { MatchStatsTab } from "../../components/MatchStatsTab";
import { MatchDetailsTab } from "../../components/MatchDetailsTab";

export type MatchTabConfig = {
  title: string;
  component: React.FC<{
    match: Match;
    season: ClubData;
    career: Career;
    onRegisterSave?: (fn: () => Promise<void> | void) => void;
    isFromGeral?: boolean;
  }>;
  actionButton?: React.FC<{ onClick?: () => void }>;
  action?: () => void;
};

export const getMatchTabsConfig = (
  careerId: string,
  seasonId: string,
  matchesId: string,
  navigate: NavigateFunction,
): MatchTabConfig[] => [
  {
    title: "Resultado",
    component: MatchDetailsTab,
    actionButton: Buttons.AddDetails,
    action: () =>
      navigate(
        `/Career/${careerId}/Season/${seasonId}/Match/${matchesId}/AddDetails`,
      ),
  },
  {
    title: "Formações",
    component: LineupTab,
    actionButton: Buttons.SaveFormation,
  },
  {
    title: "Estatísticas",
    component: MatchStatsTab,
    actionButton: Buttons.AddStatsMatch,
    action: () =>
      navigate(
        `/Career/${careerId}/Season/${seasonId}/Match/${matchesId}/AddStatsMatch`,
      ),
  },
];
