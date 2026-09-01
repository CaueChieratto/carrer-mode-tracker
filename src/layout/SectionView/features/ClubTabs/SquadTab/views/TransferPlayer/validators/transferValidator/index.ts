import { FormValues, BooleanValues } from "../../types";

export const validateTransfer = (
  formValues: FormValues,
  booleanValues: BooleanValues,
) => {
  const dateExit = formValues.dateExit || "";
  let toClub = formValues.toClub || "";
  let sellValue = formValues.sellValue || "";

  if (booleanValues.isRetirement) {
    toClub = "Aposentadoria";
    sellValue = "0";
  } else if (booleanValues.isEndContract) {
    toClub = "Fim de Contrato";
    sellValue = "0";
  }

  if (!dateExit) {
    return { isValid: false, error: "Por favor, preencha a data da saída." };
  }

  if (!booleanValues.isRetirement && !booleanValues.isEndContract) {
    if (!sellValue || !toClub) {
      return { isValid: false, error: "Por favor, preencha todos os campos." };
    }

    if (sellValue && !/[kmb]$/i.test(sellValue.trim()) && sellValue !== "0") {
      return {
        isValid: false,
        error:
          "O valor da venda deve terminar com 'k', 'm' ou 'b'. Ex: 150k, 50M, 1.2B",
      };
    }
  }

  return { isValid: true, data: { sellValue, toClub, dateExit } };
};
