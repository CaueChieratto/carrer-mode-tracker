import { useState } from "react";

export function useSaveClick() {
  const [saveClick, setSaveClick] = useState(0);

  return {
    saveClick,
    setSaveClick,
  };
}
