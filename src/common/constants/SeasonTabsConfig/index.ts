import { NavigateFunction } from "react-router-dom";
import GeneralTab from "../../../components/GeneralTab";
import SquadTab from "../../../components/SquadTab";
import { StatsTab_Club } from "../../../components/StatsTab_Club";
import { Buttons } from "../../elements/Buttons";
import { ClubData } from "../../interfaces/club/clubData";
import { Career } from "../../interfaces/Career";
import { Players } from "../../interfaces/playersInfo/players";
import InfoPlayerTab from "../../../components/InfoPlayerTab";
import TotalPlayerTab from "../../../components/DetailedPlayerSeasons/TotalPlayerTab";
import SeasonsPlayerTab from "../../../components/DetailedPlayerSeasons/SeasonsPlayerTab";

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
  isPlayer: boolean
): TabConfig[] => [
  {
    title: isPlayer ? "Jogador" : "Elenco",
    component: isPlayer ? InfoPlayerTab : SquadTab,
    actionButton: Buttons.AddSquadPlayer,
    action: () =>
      navigate(`/Career/${careerId}/Season/${seasonId}/AddPlayer?from=squad`),
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
