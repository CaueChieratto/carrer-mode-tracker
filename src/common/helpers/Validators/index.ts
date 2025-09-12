import { Players } from "../../interfaces/playersInfo/players";

export const validateMonetaryInput = (
  value: string | null,
  fieldName: string
): void => {
  if (value && !/[kmb]$/i.test(value.trim())) {
    throw new Error(
      `O campo "${fieldName}" deve terminar com 'k', 'm' ou 'b'. Ex: 50k, 10M, 1.2B`
    );
  }
};

export const validateCaptainLimit = (
  isBecomingCaptain: boolean,
  playerBeingEdited: Players | undefined,
  currentPlayers: Players[] = []
): void => {
  if (isBecomingCaptain && !playerBeingEdited?.captain) {
    const captainCount = currentPlayers.filter(
      (p) => p.captain && !p.sell
    ).length;
    if (captainCount >= 5) {
      throw new Error("Já existem 5 capitães. Não é possível adicionar mais.");
    }
  }
};

export const validateRequiredFields = (formData: FormData): void => {
  if (!formData.get("playerName"))
    throw new Error("O campo Nome é obrigatório.");
  if (!formData.get("overall"))
    throw new Error("O campo Overall é obrigatório.");
  if (!formData.get("sector")) throw new Error("O campo Setor é obrigatório.");
  if (!formData.get("position"))
    throw new Error("O campo Posição é obrigatório.");
};
