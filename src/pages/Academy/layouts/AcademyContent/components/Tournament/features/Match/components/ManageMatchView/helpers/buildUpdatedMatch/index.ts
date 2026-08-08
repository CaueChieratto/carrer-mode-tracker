import { AcademyMatches } from "../../../../../../../../interfaces/AcademyTournaments/AcademyMatches/AcademyMatches";
import { PlayerMatchesStats } from "../../../../../../../../interfaces/AcademyTournaments/AcademyMatches/PlayerMatchesStats";
import { AcademyPlayers } from "../../../../../../../../interfaces/AcademyPlayers/AcademyPlayers";

const parseStat = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return Number(value);
};

export const buildUpdatedMatch = (
  match: AcademyMatches,
  currentLineup: PlayerMatchesStats[],
  currentUGoals: number | string,
  currentOGoals: number | string,
  isFinishing: boolean,
  playersAcademy: AcademyPlayers[],
): AcademyMatches => {
  const oppGoalsNum = Number(currentOGoals) || 0;

  return {
    ...match,
    userGoals: Number(currentUGoals) || 0,
    opponentGoals: oppGoalsNum,
    lineup: currentLineup.map((p) => {
      const player = playersAcademy.find((acad) => acad.id === p.playerId);
      const isGol = player?.position === "GOL";

      return {
        ...p,
        goals: parseStat(p.goals),
        assists: parseStat(p.assists),
        rating: parseStat(p.rating),
        defesas: isGol ? parseStat(p.defesas) : null,
        cleanSheets: isGol ? (oppGoalsNum === 0 ? 1 : 0) : null,
      };
    }),
    ...(isFinishing ? { result: "FINISHED" } : {}),
  };
};
