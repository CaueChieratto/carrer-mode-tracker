import { useState } from "react";
import { useCareerFormHandler } from "../UseCareerFormHandler";

export const useNewCareerModal = (closeModal: () => void) => {
  const [load, setLoad] = useState(false);
  const { saveCareer, inputValue, setInputValue, formatDateInput } =
    useCareerFormHandler({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoad(true);
    try {
      await saveCareer(e, inputValue);
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro inesperado ao salvar a carreira.");
      }
      console.error(error);
    } finally {
      setLoad(false);
    }
  };

  return {
    load,
    inputValue,
    setInputValue,
    formatDateInput,
    handleSubmit,
  };
};
