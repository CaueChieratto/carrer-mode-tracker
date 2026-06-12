import { PlayerStatsDisplay } from "../types";

type StatKey = keyof PlayerStatsDisplay;

interface StatItem {
  label: string;
  key: StatKey;
  isRating?: boolean;
}

interface StatCategory {
  title: string;
  stats: StatItem[];
}

export const getStatsCategories = (
  compareMode: "season" | "total" | "none",
): StatCategory[] => {
  const isTotal = compareMode === "total";

  const jogadorStats: StatItem[] = [
    { label: "Idade", key: "age" },
    { label: "Posição", key: "position" },
    { label: "Valor de mercado", key: "marketValue" },
    { label: "Salário semanal", key: "salary" },
  ];

  if (isTotal) {
    jogadorStats.push({ label: "Temporadas no clube", key: "seasonsAtClub" });
  }

  return [
    {
      title: "Jogador",
      stats: jogadorStats,
    },
    {
      title: "Geral",
      stats: [
        { label: "Partidas", key: "games" },
        { label: "Nota Média", key: "rating", isRating: true },
        { label: "Participação em gols (G/A)", key: "goalParticipations" },
        { label: "Gols", key: "goals" },
        { label: "Assistências", key: "assists" },
        { label: "Defesas (GOL)", key: "defenses" },
      ],
    },
    {
      title: "Ataque",
      stats: [
        { label: "Gols por minutos", key: "goalFrequency" },
        { label: "Assistências por minutos", key: "assistFrequency" },
        { label: "G/A por minutos", key: "participationFrequency" },
        { label: "Finalizações", key: "totalFinishings" },
        { label: "Finalizações por jogo", key: "finishingsPer90" },
        { label: "Finalizações certas", key: "finishingsOnTarget" },
        {
          label: "Finalizações certas por jogo",
          key: "finishingsOnTargetPer90",
        },
        { label: "Finalizações erradas", key: "finishingsMissed" },
        {
          label: "Finalizações erradas por jogo",
          key: "finishingsMissedPer90",
        },
      ],
    },
    {
      title: "Distribuição",
      stats: [
        { label: "Passes", key: "totalPasses" },
        { label: "Passes por jogo", key: "passesPer90" },
        { label: "Passes certos", key: "passesCompleted" },
        { label: "Passes certos por jogo", key: "passesCompletedPer90" },
        { label: "Passes errados", key: "passesMissed" },
        { label: "Passes errados por jogo", key: "passesMissedPer90" },
        { label: "Passes decisivos", key: "keyPasses" },
        { label: "Passes decisivos por jogo", key: "keyPassesPer90" },
        { label: "Conduções", key: "totalDribbles" },
        { label: "Conduções por jogo", key: "dribblesPer90" },
        { label: "Conduções certas", key: "dribblesCompleted" },
        { label: "Conduções certas por jogo", key: "dribblesCompletedPer90" },
        { label: "Conduções erradas", key: "dribblesMissed" },
        { label: "Conduções erradas por jogo", key: "dribblesMissedPer90" },
      ],
    },
    {
      title: "Defesa",
      stats: [
        { label: "Clean Sheets", key: "cleanSheets" },
        { label: "Bolas recuperadas", key: "ballsRecovered" },
        { label: "Bolas recuperadas por jogo", key: "ballsRecoveredPer90" },
        { label: "Bolas perdidas", key: "ballsLost" },
        { label: "Bolas perdidas por jogo", key: "ballsLostPer90" },
      ],
    },
    {
      title: "Disciplina & Presença",
      stats: [
        { label: "Minutos jogados", key: "minutesPlayed" },
        { label: "Maior distância em um jogo", key: "maxDistanceKmInGame" },
        { label: "Distância por 90 min", key: "distanceKmPer90" },
        { label: "Distância total", key: "distanceKm" },
        { label: "Cartões amarelos", key: "yellowCards" },
        { label: "Cartões amarelos por jogo", key: "yellowCardsPer90" },
        { label: "Cartões vermelhos", key: "redCards" },
        { label: "Cartões vermelhos por jogo", key: "redCardsPer90" },
        { label: "Gols contra", key: "ownGoals" },
      ],
    },
  ];
};
