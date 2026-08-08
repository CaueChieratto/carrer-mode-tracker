import { IconType } from "react-icons";
import { FaFutbol, FaHandsHelping, FaStar, FaTshirt } from "react-icons/fa";
import { TournamentStats, TotalStats } from "../../types";

type StringOrNumberKeys<T> = {
  [K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

export interface StatConfig<T> {
  id: string;
  icon: IconType;
  dataKey: StringOrNumberKeys<T>;
  label: string;
  useColor?: boolean;
}

export const TOURNAMENT_STATS_CARDS: StatConfig<TournamentStats>[] = [
  {
    id: "matches",
    icon: FaTshirt,
    dataKey: "matchesPlayed",
    label: "Partidas",
  },
  { id: "goals", icon: FaFutbol, dataKey: "goals", label: "Gols" },
  {
    id: "assists",
    icon: FaHandsHelping,
    dataKey: "assists",
    label: "Assistências",
  },
  {
    id: "rating",
    icon: FaStar,
    dataKey: "averageRating",
    label: "Média",
    useColor: true,
  },
];

export const GENERAL_STATS_CARDS: StatConfig<TotalStats>[] = [
  {
    id: "total-matches",
    icon: FaTshirt,
    dataKey: "matchesPlayed",
    label: "Partidas Totais",
  },
  {
    id: "total-goals",
    icon: FaFutbol,
    dataKey: "totalGoals",
    label: "Gols Totais",
  },
  {
    id: "total-assists",
    icon: FaHandsHelping,
    dataKey: "totalAssists",
    label: "Assistências Totais",
  },
  {
    id: "total-rating",
    icon: FaStar,
    dataKey: "averageRating",
    label: "Média Geral",
    useColor: true,
  },
];
