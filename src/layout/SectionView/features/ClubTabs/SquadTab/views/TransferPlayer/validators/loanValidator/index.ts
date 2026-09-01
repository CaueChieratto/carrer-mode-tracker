import { FormValues, BooleanValues } from "../../types";

export const validateLoan = (
  formValues: FormValues,
  booleanValues: BooleanValues,
) => {
  const dateLoan = formValues.dateExit || "";

  if (booleanValues.isReturnLoan) {
    if (!dateLoan) {
      return {
        isValid: false,
        error: "Por favor, preencha a data de retorno.",
      };
    }
    return { isValid: true, data: { isReturning: true, dateLoan } };
  }

  const toClub = formValues.toClub || "";
  const loanDuration = formValues.loanDuration || "";
  const wagePercentage = formValues.wagePercentage || "";
  const buyOption = formValues.buyOption || "";

  if (!toClub || !dateLoan || !loanDuration || !wagePercentage) {
    return {
      isValid: false,
      error: "Por favor, preencha os campos obrigatórios de empréstimo.",
    };
  }

  return {
    isValid: true,
    data: {
      isReturning: false,
      dateLoan,
      toClub,
      loanDuration,
      wagePercentage,
      buyOption,
    },
  };
};
