import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../components/AllMatchesTab/types/Match";
import { MatchEvent, PeriodKey } from "../../types";

export const buildMatchEvents = (match: Match, season: ClubData) => {
  const lineup = match?.lineup;

  const mvpPlayerName =
    lineup?.lines?.[0]?.playerName ||
    season.players?.[0]?.name ||
    "Lamine Yamal";

  const p1 = lineup?.lines?.[0]?.playerName || "Jogador 1";
  const p2 = lineup?.lines?.[1]?.playerName || "Jogador 2";
  const p3 = lineup?.lines?.[2]?.playerName || "Jogador 3";
  const p4 = lineup?.lines?.[3]?.playerName || "Jogador 4";
  const sub1 = lineup?.bench?.[0]?.playerName || "Reserva 1";

  const rawEvents: MatchEvent[] = [
    {
      id: "e1",
      type: "goal",
      time: 45,
      period: "1T",
      mainPlayer: p1,
      secondaryPlayer: "Assist: " + p2,
    },
    {
      id: "e2",
      type: "yellow_card",
      time: 65,
      period: "2T",
      mainPlayer: p2,
      secondaryPlayer: "Falta",
    },
    {
      id: "e3",
      type: "sub",
      time: 73,
      period: "2T",
      mainPlayer: sub1,
      secondaryPlayer: p3,
    },
    {
      id: "e4",
      type: "sub",
      time: 86,
      period: "2T",
      mainPlayer: p4,
      secondaryPlayer: p1,
    },
  ];

  const sortedEvents = [...rawEvents].sort((a, b) => b.time - a.time);

  const eventsByPeriod: Record<PeriodKey, MatchEvent[]> = {
    PEN: sortedEvents.filter((e) => e.period === "PEN"),
    ET: sortedEvents.filter((e) => e.period === "ET"),
    "2T": sortedEvents.filter((e) => e.period === "2T"),
    "1T": sortedEvents.filter((e) => e.period === "1T"),
  };

  const periods: { key: PeriodKey; label: string }[] = [
    { key: "PEN", label: "PEN 2 - 4" },
    { key: "ET", label: "ET 1 - 0" },
    { key: "2T", label: "F2ºT 0 - 2" },
    { key: "1T", label: "INT 0 - 1" },
  ];

  return {
    mvpPlayerName,
    eventsByPeriod,
    periods,
  };
};
