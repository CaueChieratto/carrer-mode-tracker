import { useInputStateCareer } from "./UseInputStateCareer";
import { useSave } from "./UseSave";

type useCareerFormHandlerProps = {
  setView?: (view: "titles" | "add") => void;
};

export function useCareerFormHandler({ setView }: useCareerFormHandlerProps) {
  const { inputValue, setInputValue, formatDateInput } = useInputStateCareer();
  const { saveCareer, saveTrophies } = useSave({ setView });

  return {
    inputValue,
    setInputValue,
    formatDateInput,
    saveCareer,
    saveTrophies,
  };
}
