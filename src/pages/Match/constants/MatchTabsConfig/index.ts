import { NavigateFunction } from "react-router-dom";
import { Buttons } from "../../../../common/elements/Buttons";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Match } from "../../../../components/AllMatchesTab/types/Match";
import { LineupTab } from "../../components/LineupTab";
import { MatchStatsTab } from "../../components/MatchStatsTab";

export type MatchTabConfig = {
  title: string;
  component: React.FC<{
    match: Match;
    season: ClubData;
    career: Career;
    onRegisterSave?: (fn: () => Promise<void> | void) => void;
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
    title: "Detalhes",
    component: MatchStatsTab,
    // actionButton: Buttons.AddResult,
    // action: navigate para page
  },
  {
    title: "Formações",
    component: LineupTab,
    actionButton: Buttons.SaveFormation,
    // action: n vai ter
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
