import { useContext } from "react";
import { SeasonThemeContext } from "../../../../contexts/SeasonThemeContext";

export const useSeasonTheme = () => {
  const context = useContext(SeasonThemeContext);
  if (context === undefined) {
    throw new Error(
      "useSeasonTheme deve ser usado dentro de um SeasonThemeProvider"
    );
  }
  return context;
};
