import { useState, useEffect } from "react";
import { Career } from "../../../interfaces/Career";
import { ClubData } from "../../../interfaces/club/clubData";
import { LeagueStats } from "../../../interfaces/playersStats/leagueStats";
import { Stats } from "../../../interfaces/playersStats/stats";
import { ServicePlayers } from "../../../services/ServicePlayers";
import { leaguesByContinent } from "../../../utils/Leagues";

type UseLeagueStatsManagerProps = {
  career: Career;
  season: ClubData;
  formValues: Record<string, string>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  initialLeagues: LeagueStats[];
};

export const useLeagueStatsManager = ({
  career,
  season,
  formValues,
  setFormValues,
  initialLeagues,
}: UseLeagueStatsManagerProps) => {
  const [leagues, setLeagues] = useState<LeagueStats[]>([]);
  const [originalLeagueNameToEdit, setOriginalLeagueNameToEdit] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLeagues(initialLeagues);
  }, [initialLeagues]);

  const handleAddOrEditLeague = async () => {
    setIsLoading(true);
    const {
      playerName,
      leagueName,
      games,
      goals,
      assists,
      rating,
      cleanSheets,
    } = formValues;

    if (!playerName || !leagueName) {
      alert("Selecione um jogador e uma liga.");
      setIsLoading(false);
      return;
    }

    const selectedPlayer = season.players.find((p) => p.name === playerName);
    if (!selectedPlayer) {
      alert("Jogador não encontrado.");
      setIsLoading(false);
      return;
    }

    const allLeagues = Object.values(leaguesByContinent)
      .flatMap((continent) => Object.values(continent))
      .flat();
    const leagueData = allLeagues.find((l) => l.name === leagueName);
    if (!leagueData) {
      alert("Liga não encontrada.");
      setIsLoading(false);
      return;
    }

    const newStats: Stats = {
      games: parseInt(games, 10) || 0,
      goals: parseInt(goals, 10) || 0,
      assists: parseInt(assists, 10) || 0,
      rating: parseFloat(rating) || 0,
      cleanSheets: parseInt(cleanSheets, 10) || 0,
    };

    let updatedLeagues: LeagueStats[];

    if (originalLeagueNameToEdit) {
      updatedLeagues = leagues.map((l) =>
        l.leagueName === originalLeagueNameToEdit
          ? {
              ...l,
              leagueName: leagueName,
              leagueImage: leagueData.logo,
              stats: newStats,
            }
          : l
      );
    } else {
      const newLeague: LeagueStats = {
        leagueName: leagueData.name,
        leagueImage: leagueData.logo,
        stats: newStats,
      };
      updatedLeagues = [...leagues, newLeague];
    }

    try {
      await ServicePlayers.updatePlayerStatsLeagues(
        career,
        season.id,
        selectedPlayer.id,
        updatedLeagues
      );
      setLeagues(updatedLeagues);
    } catch (error) {
      console.error("Falha ao salvar estatísticas da liga:", error);
      alert("Falha ao salvar estatísticas da liga.");
    } finally {
      setFormValues((prev) => ({
        ...prev,
        leagueName: "",
        games: "",
        goals: "",
        assists: "",
        rating: "",
        cleanSheets: "",
      }));
      setOriginalLeagueNameToEdit(null);
      setIsLoading(false);
    }
  };

  return {
    leagues,
    originalLeagueNameToEdit,
    setOriginalLeagueNameToEdit,
    handleAddOrEditLeague,
    isLoading,
  };
};
