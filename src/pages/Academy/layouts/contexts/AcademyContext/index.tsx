import { createContext } from "react";
import { Career } from "../../../../../common/interfaces/Career";
import { DashboardCardConfig } from "../../AcademyContent/config";
import { AcademyPlayers } from "../../AcademyContent/interfaces/AcademyPlayers/AcademyPlayers";
import { AcademyTournaments } from "../../AcademyContent/interfaces/AcademyTournaments/AcademyTournaments";

export type AcademyContextData = {
  career: Career;
  seasonId: string;
  playersAcademy: AcademyPlayers[];
  allPlayersAcademy: AcademyPlayers[];
  tournamentsAcademy: AcademyTournaments[];
  activeCardIndex: number | null;
  selectedPlayer?: AcademyPlayers;
  selectedTournament?: AcademyTournaments;
  dashboardCards: DashboardCardConfig[];
  selectedTournamentId: string | null;
  isLoading: boolean;
  isAddingPlayer: boolean;
  isAddingTournament: boolean;
  isPromotingPlayer: boolean;
  isFocusedViewActive: boolean;
  isAnimationDisabled: boolean;
  setIsPromotingPlayer: (value: boolean) => void;
  setIsAddingPlayer: (value: boolean) => void;
  setSelectedTournamentId: (id: string | null) => void;
  setIsAddingTournament: (value: boolean) => void;
  setActiveCardIndex: (index: number) => void;
  onUpdatePlayer: (
    updatedPlayer: AcademyPlayers,
    isSilent?: boolean,
  ) => Promise<void>;
  onDeletePlayer: (playerId: string) => Promise<void>;
  onReleasePlayer: (
    player: AcademyPlayers,
    releaseDate: string,
  ) => Promise<void>;
  onUpdateTournament?: (
    updatedTournament: AcademyTournaments,
    isSilent?: boolean,
  ) => Promise<void>;
  onDeleteTournament?: (tournamentId: string) => Promise<void>;
  refetchPlayers: () => void;
  refetchTournaments?: () => void;
  back: () => void;
};

export const AcademyContext = createContext<AcademyContextData>(
  {} as AcademyContextData,
);
