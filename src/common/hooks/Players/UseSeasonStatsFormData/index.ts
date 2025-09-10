import { useMemo } from "react";
import { seasonsFormFields } from "../../../constants/SeasonsFormFields";
import { Career } from "../../../interfaces/Career";
import { ClubData } from "../../../interfaces/club/clubData";
import { Players } from "../../../interfaces/playersInfo/players";
import { LeagueStats } from "../../../interfaces/playersStats/leagueStats";
import { useLeagueOptions } from "../../UseLeagueOptions";
import { sortPlayersByPosition } from "../../../utils/Sorts";

type UseSeasonStatsFormDataProps = {
  career: Career;
  season: ClubData;
  player?: Players;
  leagues: LeagueStats[];
  originalLeagueNameToEdit: string | null;
};

export const useSeasonStatsFormData = ({
  career,
  season,
  player,
  leagues,
  originalLeagueNameToEdit,
}: UseSeasonStatsFormDataProps) => {
  const isEditing = !!player;
  const leagueNames = useLeagueOptions(career.nation);

  const playerNames = useMemo(() => {
    const players = season?.players ?? [];
    if (isEditing && player) {
      return [player.name];
    }
    const availablePlayers = players.filter(
      (p) => !p.sell && (!p.statsLeagues || p.statsLeagues.length === 0)
    );
    const sorted = sortPlayersByPosition(availablePlayers);
    return sorted.map((p) => p.name);
  }, [isEditing, player, season?.players]);

  const filteredLeagueNames = useMemo(() => {
    const existingLeagueNames = leagues.map((l) => l.leagueName);
    return leagueNames.filter(
      (name) =>
        !existingLeagueNames.includes(name) || name === originalLeagueNameToEdit
    );
  }, [leagueNames, leagues, originalLeagueNameToEdit]);

  const finalFormItems = useMemo(() => {
    const items = seasonsFormFields(
      filteredLeagueNames,
      playerNames as readonly string[]
    );
    if (!isEditing) {
      return items;
    }
    return items.map((section) => ({
      ...section,
      fields: section.fields.map((row) =>
        row.map((field) =>
          field.id === "playerName" ? { ...field, disabled: true } : field
        )
      ),
    }));
  }, [filteredLeagueNames, playerNames, isEditing]);

  return { finalFormItems };
};
