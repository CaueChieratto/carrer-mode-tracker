import { useState, FormEvent } from "react";

export const useAsyncForm = <T>(
  onSubmit: (data: T) => Promise<void>,
  parseData: (formData: FormData) => T,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const parsed = parseData(new FormData(e.currentTarget));
      await onSubmit(parsed);
    } catch (error) {
      console.error("Erro ao submeter:", error);
      alert("Falha ao salvar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, submit };
};
