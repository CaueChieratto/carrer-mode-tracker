import { Dispatch, SetStateAction } from "react";
import { AcademyPlayers } from "../../interfaces/AcademyPlayers/AcademyPlayers";
import { AcademyTournaments } from "../../interfaces/AcademyTournaments/AcademyTournaments";
import { AcademyService } from "../../services/AcademyService";

type UseAcademyActionsProps = {
  careerId: string;
  seasonId: string;
  selectedPlayerId: string | null;
  selectedTournamentId: string | null;
  refetchPlayers: (isSilentUpdate?: boolean) => void;
  refetchTournaments?: (isSilentUpdate?: boolean) => void;
  playerClick: (id: string, forceOpen?: boolean) => void;
  tournamentClick: (id: string, forceOpen?: boolean) => void;
  setPlayersAcademy: Dispatch<SetStateAction<AcademyPlayers[]>>;
  setTournamentsAcademy: Dispatch<SetStateAction<AcademyTournaments[]>>;
  back: () => void;
};

export const useAcademyActions = ({
  careerId,
  seasonId,
  selectedPlayerId,
  selectedTournamentId,
  refetchPlayers,
  refetchTournaments,
  tournamentClick,
  playerClick,
  setPlayersAcademy,
  setTournamentsAcademy,
  back,
}: UseAcademyActionsProps) => {
  const handleTournamentClick = (id: string, forceOpen?: boolean) => {
    tournamentClick(id, forceOpen);
    if (selectedTournamentId === id && !forceOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlayerClick = (id: string, forceOpen?: boolean) => {
    playerClick(id, forceOpen);
    if (selectedPlayerId === id && !forceOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updatePlayer = async (
    updatedPlayer: AcademyPlayers,
    isSilent?: boolean,
  ) => {
    setPlayersAcademy((prev) =>
      prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
    );

    try {
      await AcademyService.updatePlayerAcademy(
        careerId,
        seasonId,
        updatedPlayer,
      );
      refetchPlayers(true);

      if (!isSilent) {
        back();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      refetchPlayers();
      console.error("Erro ao atualizar jogador:", error);
      alert("Falha ao atualizar o jogador. Tente novamente.");
    }
  };

  const releasePlayer = async (player: AcademyPlayers, releaseDate: string) => {
    setPlayersAcademy((prev) => prev.filter((p) => p.id !== player.id));

    try {
      await AcademyService.releasePlayerAcademy(
        careerId,
        seasonId,
        player,
        releaseDate,
      );
      refetchPlayers(true);
      back();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      refetchPlayers();
      console.error("Erro ao dispensar jogador:", error);
      alert("Falha ao dispensar o jogador. Tente novamente.");
    }
  };

  const deletePlayer = async (playerId: string) => {
    setPlayersAcademy((prev) => prev.filter((p) => p.id !== playerId));

    try {
      await AcademyService.deletePlayerAcademy(careerId, seasonId, playerId);
      refetchPlayers(true);
      back();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      refetchPlayers();
      console.error("Erro ao deletar jogador:", error);
      alert("Falha ao deletar o jogador. Tente novamente.");
    }
  };

  const updateTournament = async (
    updatedTournament: AcademyTournaments,
    isSilent?: boolean,
  ) => {
    setTournamentsAcademy((prev) =>
      prev.map((t) => (t.id === updatedTournament.id ? updatedTournament : t)),
    );

    try {
      await AcademyService.updateTournamentAcademy(
        careerId,
        seasonId,
        updatedTournament,
      );
      if (refetchTournaments) refetchTournaments(true);

      if (!isSilent) {
        back();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      if (refetchTournaments) refetchTournaments();
      console.error("Erro ao atualizar torneio:", error);
    }
  };

  const deleteTournament = async (tournamentId: string) => {
    setTournamentsAcademy((prev) => prev.filter((t) => t.id !== tournamentId));

    try {
      await AcademyService.deleteTournamentAcademy(
        careerId,
        seasonId,
        tournamentId,
      );
      if (refetchTournaments) refetchTournaments(true);

      back();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (refetchTournaments) refetchTournaments();
      console.error("Erro ao deletar torneio:", error);
      alert("Falha ao deletar o torneio. Tente novamente.");
    }
  };

  return {
    handlePlayerClick,
    handleTournamentClick,
    updatePlayer,
    releasePlayer,
    deletePlayer,
    updateTournament,
    deleteTournament,
  };
};
