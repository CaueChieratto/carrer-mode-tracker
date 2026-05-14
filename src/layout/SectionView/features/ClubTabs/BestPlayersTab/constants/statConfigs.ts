import { AggregatedPlayerStats } from "../types/AggregatedPlayerStats";

export type StatConfig = {
  title: string;
  key: keyof AggregatedPlayerStats;
  isRating?: boolean;
  isAscending?: boolean;
  format?: (v: number) => string | number;
};

export const statConfigs: StatConfig[] = [
  {
    title: "Médias das notas",
    key: "avgRating",
    isRating: true,
    format: (v: number) => v.toFixed(2),
  },
  { title: "Gols", key: "goals" },
  { title: "Assistências", key: "assists" },
  { title: "Participação em gols", key: "goalParticipations" },
  {
    title: "Minutos jogados",
    key: "minutesPlayed",
    format: (v: number) => `${v}'`,
  },
  {
    title: "Gols por minutos",
    key: "goalFrequency",
    isAscending: true,
    format: (v: number) => `${Math.round(v)}'`,
  },
  {
    title: "Maior distância em um jogo",
    key: "maxDistanceKmInGame",
    format: (v: number) => `${v.toFixed(1)}km`,
  },
  {
    title: "Distância por jogo",
    key: "distanceKmPerGame",
    format: (v: number) => `${v.toFixed(1)}km`,
  },
  {
    title: "Distância total",
    key: "distanceKm",
    format: (v: number) => `${v.toFixed(1)}km`,
  },
  { title: "Finalizações", key: "totalFinishings" },
  {
    title: "Finalizações por jogo",
    key: "finishingsPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Finalizações certas", key: "finishingsOnTarget" },
  {
    title: "Finalizações certas por jogo",
    key: "finishingsOnTargetPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Finalizações erradas", key: "finishingsMissed" },
  {
    title: "Finalizações erradas por jogo",
    key: "finishingsMissedPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Passes", key: "totalPasses" },
  {
    title: "Passes por jogo",
    key: "passesPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Passes certos", key: "passesCompleted" },
  {
    title: "Passes certos por jogo",
    key: "passesCompletedPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Passes errados", key: "passesMissed" },
  {
    title: "Passes errados por jogo",
    key: "passesMissedPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Passes decisivos", key: "keyPasses" },
  {
    title: "Passes decisivos por jogo",
    key: "keyPassesPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Conduções", key: "totalDribbles" },
  {
    title: "Conduções por jogo",
    key: "dribblesPerGame",
    format: (v: number) => v.toFixed(1),
  },
  {
    title: "Conduções certas por jogo",
    key: "dribblesCompletedPerGame",
    format: (v: number) => v.toFixed(1),
  },
  {
    title: "Conduções erradas por jogo",
    key: "dribblesMissedPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Bolas recuperadas", key: "ballsRecovered" },
  {
    title: "Bolas recuperadas por jogo",
    key: "ballsRecoveredPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Bolas perdidas", key: "ballsLost" },
  {
    title: "Bolas perdidas por jogo",
    key: "ballsLostPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Cartões amarelos", key: "yellowCards" },
  {
    title: "Cartões amarelos por jogo",
    key: "yellowCardsPerGame",
    format: (v: number) => v.toFixed(1),
  },
  { title: "Cartões vermelhos", key: "redCards" },
  {
    title: "Cartões vermelhos por jogo",
    key: "redCardsPerGame",
    format: (v: number) => v.toFixed(1),
  },
];
