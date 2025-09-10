import { useState } from "react";
import { formatDateInput } from "../../../utils/Date";

type UseSellPlayerFormProps = {
  onConfirm: (
    sellValue: string,
    toClub: string,
    dateExit: string
  ) => void | Promise<void>;
  closeModal: () => void;
};

export const useSellPlayerForm = ({
  onConfirm,
  closeModal,
}: UseSellPlayerFormProps) => {
  const [sellValue, setSellValue] = useState("");
  const [toClub, setToClub] = useState("");
  const [dateExit, setDateExit] = useState("");

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellValue || !toClub) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (sellValue && !/[kmb]$/i.test(sellValue.trim())) {
      alert(
        "O valor da venda deve terminar com 'k', 'm' ou 'b'. Ex: 150k, 50M, 1.2B"
      );
      return;
    }

    await onConfirm(sellValue, toClub, dateExit);
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
        setDateExit(formatDateInput(value));
        break;
      default:
        break;
    }
  };

  return {
    sellValue,
    toClub,
    dateExit,
    handleConfirm,
    handleInputChange,
  };
};
