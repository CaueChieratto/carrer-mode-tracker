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
  }>;
  actionButton?: React.FC<{ onClick?: () => void }>;
  action?: () => void;
};

export const getMatchTabsConfig = (): MatchTabConfig[] => [
  {
    title: "Resultado",
    component: MatchStatsTab,
  },
  {
    title: "Formações",
    component: LineupTab,
    actionButton: Buttons.SaveFormation,
    action: () => console.log("teste"),
  },
  {
    title: "Estatísticas",
    component: MatchStatsTab,
  },
];
