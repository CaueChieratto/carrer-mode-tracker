import { useState } from "react";
import { formatDateInputShort } from "../../../utils/Date";

type UseSellPlayerFormProps = {
  isLoan?: boolean;
  onConfirm: (
    sellValue: string,
    toClub: string,
    dateExit: string,
    loanDuration?: string,
    wagePercentage?: string,
  ) => void | Promise<void>;
  closeModal: () => void;
  initialValues?: {
    sellValue: string;
    toClub: string;
    dateExit: string;
    loanDuration: string;
    wagePercentage: string;
  };
};

export const useSellPlayerForm = ({
  isLoan,
  onConfirm,
  closeModal,
  initialValues,
}: UseSellPlayerFormProps) => {
  const [sellValue, setSellValue] = useState(initialValues?.sellValue || "");
  const [toClub, setToClub] = useState(initialValues?.toClub || "");
  const [dateExit, setDateExit] = useState(initialValues?.dateExit || "");
  const [loanDuration, setLoanDuration] = useState(
    initialValues?.loanDuration || "",
  );
  const [wagePercentage, setWagePercentage] = useState(
    initialValues?.wagePercentage || "",
  );

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoan) {
      if (!toClub || !dateExit || !loanDuration || !wagePercentage) {
        alert("Por favor, preencha os campos obrigatórios de empréstimo.");
        return;
      }
    } else {
      if (!sellValue || !toClub || !dateExit) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
    }

    if (sellValue && !/[kmb]$/i.test(sellValue.trim())) {
      alert(
        "O valor da venda deve terminar com 'k', 'm' ou 'b'. Ex: 150k, 50M, 1.2B",
      );
      return;
    }

    await onConfirm(sellValue, toClub, dateExit, loanDuration, wagePercentage);
    closeModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "sellValue":
        setSellValue(value);
        break;
      case "toClub":
        setToClub(value);
        break;
      case "dateExit":
        setDateExit(formatDateInputShort(value));
        break;
      case "loanDuration":
        setLoanDuration(value);
        break;
      case "wagePercentage":
        setWagePercentage(value);
        break;
      default:
        break;
    }
  };

  return {
    sellValue,
    toClub,
    dateExit,
    loanDuration,
    wagePercentage,
    handleConfirm,
    handleInputChange,
  };
};
