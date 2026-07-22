export const buildConfirmLabel = (isSaving: boolean, count: number): string =>
  isSaving ? "Salvando..." : `Confirmar Ligas (${count})`;
