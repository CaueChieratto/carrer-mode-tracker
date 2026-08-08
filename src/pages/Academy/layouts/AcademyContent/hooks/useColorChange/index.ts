import { useContext } from "react";
import { SeasonThemeContext } from "../../../../../../contexts/SeasonThemeContext";

export const useColorChange = () => {
  const seasonThemeContext = useContext(SeasonThemeContext);

  return () => {
    if (seasonThemeContext?.changeClubColor) {
      seasonThemeContext.changeClubColor();
    } else {
      console.warn(
        "SeasonThemeContext não está disponível nesta árvore de componentes.",
      );
    }
  };
};
