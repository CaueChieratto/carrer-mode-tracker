import { NavigateFunction } from "react-router-dom";
import GeneralTab from "../../../components/GeneralTab";
import SquadTab from "../../../components/SquadTab";
import { StatsTab_Club } from "../../../components/StatsTab_Club";
import { Buttons } from "../../elements/Buttons";
import { ClubData } from "../../interfaces/club/clubData";

export type TabConfig = {
  title: string;
  component: React.FC<{
    season: ClubData;
    onOpenTransfers?: (type: "arrivals" | "exit") => void;
  }>;
  actionButton?: React.FC<{ onClick?: () => void }>;
  action?: () => void;
};

export const getSeasonTabsConfig = (
  careerId: string,
  seasonId: string,
  navigate: NavigateFunction
): TabConfig[] => [
  {
    title: "Elenco",
    component: SquadTab,
    actionButton: Buttons.AddSquadPlayer,
    action: () =>
      navigate(`/Career/${careerId}/Season/${seasonId}/AddPlayer?from=squad`),
  },
  {
    title: "Estatísticas",
    component: StatsTab_Club,
    actionButton: Buttons.AddPlayerSeason,
    action: () =>
      navigate(`/Career/${careerId}/Season/${seasonId}/AddPlayer?from=stats`),
  },
  {
    title: "Geral",
    component: GeneralTab,
    actionButton: Buttons.ChangeClubColors,
  },
];
