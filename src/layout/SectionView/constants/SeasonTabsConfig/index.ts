import { NavigateFunction } from "react-router-dom";
import { Buttons } from "../../../../common/elements/Buttons";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { AllMatchesTab } from "../../../../components/AllMatchesTab";
import InfoPlayerTab from "../../../../components/DetailedPlayerSeasons/InfoPlayerTab";
import SeasonsPlayerTab from "../../../../components/DetailedPlayerSeasons/SeasonsPlayerTab";
import TotalPlayerTab from "../../../../components/DetailedPlayerSeasons/TotalPlayerTab";
import GeneralTab from "../../../../components/GeneralTab";
import SquadTab from "../../../../components/SquadTab";
import { StatsTab_Club } from "../../../../components/StatsTab_Club";

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
