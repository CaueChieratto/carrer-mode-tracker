import { useState } from "react";

export function useInputStateCareer() {
  const [inputValue, setInputValue] = useState("");

  return {
    inputValue,
    setInputValue,
  };
}
