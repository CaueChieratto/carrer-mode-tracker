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
import { BestPlayersTab } from "../features/ClubTabs/BestPlayersTab";
import { CuriositiesTab } from "../features/ClubTabs/CuriositiesTab";
import { TableTab } from "../features/ClubTabs/TableTab";

export type TabConfig = {
  title: string;
  component: React.FC<{
    season: ClubData;
    career: Career;
    onOpenTransfers?: (type: "arrivals" | "exit") => void;
    isPlayer?: boolean;
    player?: Players;
    onAddBadge?: (teamName: string) => void;
    notSeason?: boolean;
  }>;
  actionButton?: React.FC<{ onClick?: () => void }>;
  action?: () => void;
};

export const getSeasonTabsConfig = (
  career: Career,
  seasonId: string,
  navigate: NavigateFunction,
  isPlayer: boolean,
  notSeason?: boolean,
): TabConfig[] => {
  const careerId = career.id;
  const hasAcademySaved = !!career.academy;

  return [
    {
      title: isPlayer ? "Jogador" : "Elenco",
      component: isPlayer ? InfoPlayerTab : SquadTab,
      actionButton: isPlayer && !notSeason ? undefined : Buttons.AddSquadPlayer,
      action:
        isPlayer && !notSeason
          ? undefined
          : () =>
              navigate(
                `/Career/${careerId}/Season/${seasonId}/AddPlayer?from=squad`,
              ),
    },
    {
      title: "Partidas",
      component: AllMatchesTab,
      actionButton: !isPlayer ? Buttons.AddMatches : undefined,
      action: !isPlayer
        ? () => navigate(`/Career/${careerId}/Season/${seasonId}/AddMatches`)
        : undefined,
    },
    !isPlayer && {
      title: "Classificação",
      component: TableTab,
      actionButton: Buttons.AddTeamsToTable,
      action: () =>
        navigate(`/Career/${careerId}/Season/${seasonId}/AddTeamsToTable`),
    },
    {
      title: isPlayer ? "Temporadas" : "Estatísticas",
      component: isPlayer ? SeasonsPlayerTab : StatsTab_Club,
      actionButton:
        isPlayer && !notSeason ? undefined : Buttons.AddPlayerSeason,
      action:
        isPlayer && !notSeason
          ? undefined
          : () =>
              navigate(
                `/Career/${careerId}/Season/${seasonId}/AddPlayer?from=stats`,
              ),
    },
    !isPlayer && {
      title: "Melhores Jogadores",
      component: BestPlayersTab,
      actionButton: Buttons.ChangeClubColors,
    },
    {
      title: isPlayer ? "Total" : "Geral",
      component: isPlayer ? TotalPlayerTab : GeneralTab,
      actionButton:
        isPlayer && !notSeason
          ? undefined
          : hasAcademySaved
            ? Buttons.EnterAcademy
            : Buttons.ChangeClubColors,
      action:
        hasAcademySaved && !(isPlayer && !notSeason)
          ? () =>
              navigate(`/Career/${careerId}/Academy`, {
                state: {
                  career,
                  seasonId,
                },
              })
          : undefined,
    },
    !isPlayer && {
      title: "Curiosidades",
      component: CuriositiesTab,
      actionButton: Buttons.ChangeClubColors,
    },
  ].filter(Boolean) as TabConfig[];
};
