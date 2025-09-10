import { useState } from "react";
import { formatDateInput } from "../../../utils/Date";

export function useInputStateCareer() {
  const [inputValue, setInputValue] = useState("");

  return {
    inputValue,
    setInputValue,
    formatDateInput,
  };
}
