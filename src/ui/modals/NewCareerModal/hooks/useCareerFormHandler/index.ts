import { useInputStateCareer } from "../useInputStateCareer";
import { useSave } from "../../../../../common/hooks/Career/UseSave";

type useCareerFormHandlerProps = {
  setView?: (view: "titles" | "add" | "menu") => void;
};

export function useCareerFormHandler({ setView }: useCareerFormHandlerProps) {
  const { inputValue, setInputValue } = useInputStateCareer();
  const { saveCareer, saveTrophies } = useSave({ setView });

  return {
    inputValue,
    setInputValue,

    saveCareer,
    saveTrophies,
  };
}
