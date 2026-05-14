import { NavigateFunction } from "react-router-dom";
import { Buttons } from "../../../common/elements/Buttons";
import { Career } from "../../../common/interfaces/Career";
import { ClubData } from "../../../common/interfaces/club/clubData";
import { Players } from "../../../common/interfaces/playersInfo/players";
import { AllMatchesTab } from "../features/ClubTabs/AllMatchesTab";
import InfoPlayerTab from "../features/PlayerTabs/InfoPlayerTab";
import SeasonsPlayerTab from "../features/PlayerTabs/SeasonsPlayerTab";
import TotalPlayerTab from "../features/PlayerTabs/TotalPlayerTab";
import GeneralTab from "../features/ClubTabs/GeneralTab";
import SquadTab from "../features/ClubTabs/SquadTab";
import { StatsTab_Club } from "../features/ClubTabs/StatsTab_Club";

export type TabConfig = {
  title: string;
  component: React.FC<{
    season: ClubData;
    career: Career;
    onOpenTransfers?: (type: "arrivals" | "exit") => void;
    isPlayer?: boolean;
    player?: Players;
  }>;
  actionButton?: React.FC<{ onClick?: () => void }>;
  action?: () => void;
};

export const getSeasonTabsConfig = (
  careerId: string,
  seasonId: string,
  navigate: NavigateFunction,
  isPlayer: boolean,
): TabConfig[] => [
  {
    title: isPlayer ? "Jogador" : "Elenco",
    component: isPlayer ? InfoPlayerTab : SquadTab,
    actionButton: Buttons.AddSquadPlayer,
    action: () =>
      navigate(`/Career/${careerId}/Season/${seasonId}/AddPlayer?from=squad`),
  },
  {
    title: isPlayer ? "Partidas" : "Partidas",
    component: isPlayer ? AllMatchesTab : AllMatchesTab,
    actionButton: Buttons.AddMatches,
    action: () => navigate(`/Career/${careerId}/Season/${seasonId}/AddMatches`),
  },
  {
    title: isPlayer ? "Temporadas" : "Estatísticas",
    component: isPlayer ? SeasonsPlayerTab : StatsTab_Club,
    actionButton: Buttons.AddPlayerSeason,
    action: () =>
      navigate(`/Career/${careerId}/Season/${seasonId}/AddPlayer?from=stats`),
  },
  {
    title: isPlayer ? "Total" : "Geral",
    component: isPlayer ? TotalPlayerTab : GeneralTab,
    actionButton: Buttons.ChangeClubColors,
  },
];
