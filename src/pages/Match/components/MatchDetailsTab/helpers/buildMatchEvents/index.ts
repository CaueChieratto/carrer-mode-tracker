import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../components/AllMatchesTab/types/Match";
import { MatchEvent, PeriodKey } from "../../types";

export const buildMatchEvents = (match: Match, season: ClubData) => {
  let mvpPlayerName = "Nenhum";
  let mvpRating = 0;

  const rawEvents: MatchEvent[] = [];
  const goalsList: { playerName: string; time: number }[] = [];

  let mockTime = 10;

  if (match.playerStats) {
    match.playerStats.forEach((stat) => {
      const player = season.players.find((p) => p.id === stat.playerId);
      if (!player) return;

      if (stat.rating > mvpRating) {
        mvpRating = stat.rating;
        mvpPlayerName = player.name;
      }

      if (stat.goals > 0) {
        for (let i = 0; i < stat.goals; i++) {
          mockTime = mockTime >= 85 ? 15 : mockTime + 15;
          const time = mockTime;

          rawEvents.push({
            id: `goal-${stat.playerId}-${i}`,
            type: "goal",
            time,
            period: time > 45 ? "2T" : "1T",
            mainPlayer: player.name,
          });
          goalsList.push({ playerName: player.name, time });
        }
      }

      if (stat.redCard && stat.yellowCard) {
        mockTime += 5;
        rawEvents.push({
          id: `2y-${stat.playerId}`,
          type: "second_yellow",
          time: mockTime,
          period: mockTime > 45 ? "2T" : "1T",
          mainPlayer: player.name,
        });
      } else if (stat.redCard) {
        mockTime += 5;
        rawEvents.push({
          id: `r-${stat.playerId}`,
          type: "red_card",
          time: mockTime,
          period: mockTime > 45 ? "2T" : "1T",
          mainPlayer: player.name,
        });
      } else if (stat.yellowCard) {
        mockTime += 5;
        rawEvents.push({
          id: `y-${stat.playerId}`,
          type: "yellow_card",
          time: mockTime,
          period: mockTime > 45 ? "2T" : "1T",
          mainPlayer: player.name,
        });
      }

      if (stat.substituteIn && stat.substituteIn !== "Nenhum") {
        const isStarter = [
          match.lineup?.goalkeeper?.playerId,
          ...(match.lineup?.lines?.flat().map((s) => s.playerId) || []),
        ].includes(player.id);

        if (isStarter) {
          const subTime = stat.minutesPlayed || 45;

          rawEvents.push({
            id: `sub-${stat.playerId}`,
            type: "sub",
            time: subTime,
            period: subTime > 45 ? "2T" : "1T",
            mainPlayer: stat.substituteIn,
            secondaryPlayer: `Saiu: ${player.name}`,
          });
        }
      }
    });
  }

  const sortedEvents = [...rawEvents].sort((a, b) => b.time - a.time);

  const eventsByPeriod: Record<PeriodKey, MatchEvent[]> = {
    PEN: sortedEvents.filter((e) => e.period === "PEN"),
    ET: sortedEvents.filter((e) => e.period === "ET"),
    "2T": sortedEvents.filter((e) => e.period === "2T"),
    "1T": sortedEvents.filter((e) => e.period === "1T"),
  };

  const periods: { key: PeriodKey; label: string }[] = [];
  if (eventsByPeriod["PEN"].length > 0)
    periods.push({ key: "PEN", label: "Pênaltis" });
  if (eventsByPeriod["ET"].length > 0)
    periods.push({ key: "ET", label: "Prorrogação" });
  if (eventsByPeriod["2T"].length > 0)
    periods.push({ key: "2T", label: "2º Tempo" });
  if (eventsByPeriod["1T"].length > 0)
    periods.push({ key: "1T", label: "1º Tempo" });

  if (periods.length === 0 && sortedEvents.length > 0) {
    periods.push({ key: "1T", label: "1º Tempo" });
  }

  return {
    mvpPlayerName,
    mvpRating: mvpRating > 0 ? Number(mvpRating.toFixed(1)) : null,
    eventsByPeriod,
    periods,
    goalsList: goalsList.sort((a, b) => a.time - b.time),
  };
};
