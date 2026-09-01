interface MatchFormValues {
  date: string;
  league: string;
  opponentTeam: string;
}

interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateMatchForm(values: MatchFormValues): ValidationResult {
  const { date, league, opponentTeam } = values;

  if (!date || !league || !opponentTeam) {
    return {
      valid: false,
      message: "Por favor, preencha todos os campos obrigatórios da partida.",
    };
  }

  const [dayStr, monthStr] = date.split("/");
  const day = Number(dayStr);
  const month = Number(monthStr);

  if (isNaN(day) || isNaN(month)) {
    return {
      valid: false,
      message: "Data inválida. Use o formato DD/MM.",
    };
  }

  return { valid: true };
}
