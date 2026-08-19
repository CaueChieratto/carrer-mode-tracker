import { useState, useEffect } from "react";
import { Career } from "../../../interfaces/Career";
import { ClubData } from "../../../interfaces/club/clubData";
import { LeagueStats } from "../../../interfaces/playersStats/leagueStats";
import { Stats } from "../../../interfaces/playersStats/stats";
import { leaguesByContinent } from "../../../utils/league";

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
    const selectedPlayerName = formValues.playerName;
    const selectedPlayer = season.players.find(
      (p) => p.name === selectedPlayerName && !p.sell,
    );

    if (selectedPlayer) {
      const backupKey = `stats_backup_${career.id}_${season.id}_${selectedPlayer.id}`;
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        setLeagues(JSON.parse(backup));
      } else {
        setLeagues(initialLeagues);
      }
    } else {
      setLeagues(initialLeagues);
    }
  }, [
    initialLeagues,
    formValues.playerName,
    career.id,
    season.id,
    season.players,
  ]);

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

    const selectedPlayer = season.players.find(
      (p) => p.name === playerName && !p.sell,
    );

    if (!selectedPlayer) {
      alert("Jogador não encontrado.");
      setIsLoading(false);
      return;
    }

    const allLeagues = Object.values(leaguesByContinent)
      .flatMap((continent) => Object.values(continent))
      .flat();

    const leagueData =
      season.leagues?.find((l) => l.name === leagueName) ||
      allLeagues.find((l) => l.name === leagueName);

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
          : l,
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
      setLeagues(updatedLeagues);
      const backupKey = `stats_backup_${career.id}_${season.id}_${selectedPlayer.id}`;
      localStorage.setItem(backupKey, JSON.stringify(updatedLeagues));
    } catch (error) {
      console.error("Falha ao salvar backup das estatísticas:", error);
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
