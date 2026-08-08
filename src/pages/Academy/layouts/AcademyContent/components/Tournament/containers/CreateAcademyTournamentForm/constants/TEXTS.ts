import { TournamentFormTexts } from "../../../forms/types/TournamentFormTexts";

export const getTournamentTexts = (
  tournamentName: string,
): TournamentFormTexts => ({
  dateLabel: `Data de Início: ${tournamentName}`,
  datePlaceholder: "DD/MM",
  submitText: `Adicionar ${tournamentName}`,
  loadingText: "Adicionando...",
});
