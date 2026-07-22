import { Dispatch, SetStateAction, useState } from "react";
import { Career } from "../../../../../../common/interfaces/Career";
import { ServiceSeasons } from "../../../../../../common/services/ServiceSeasons";

type UseSelectCurrencyParams = {
  career: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  onClose: () => void;
};

type UseSelectCurrencyReturn = {
  isSaving: boolean;
  selectedCurrency: string;
  setSelectedCurrency: Dispatch<SetStateAction<string>>;
  handleConfirm: () => Promise<void>;
};

export const useSelectCurrency = ({
  career,
  setSelectedCareer,
  onClose,
}: UseSelectCurrencyParams): UseSelectCurrencyReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    career.currency || "EUR",
  );

  const handleConfirm = async (): Promise<void> => {
    try {
      setIsSaving(true);
      await ServiceSeasons.updateCurrency(career.id, selectedCurrency);

      setSelectedCareer({ ...career, currency: selectedCurrency });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar moeda:", error);
      alert("Ocorreu um erro ao salvar a moeda selecionada.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    selectedCurrency,
    setSelectedCurrency,
    handleConfirm,
  };
};
