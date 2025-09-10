import {
  createContext,
  useMemo,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useClubColors } from "../../common/hooks/Colors/UseClubColors";
import { Career } from "../../common/interfaces/Career";
import { ColorsService } from "../../common/services/ColorsService";

type ActiveStyle = {
  backgroundColor: string;
  color: string;
  fontWeight: number;
  border: string;
  clubColor: string;
  darkClubColor: string;
};

type SeasonThemeContextType = {
  activeStyle: ActiveStyle;
  clubColor: string;
  darkClubColor: string;
  career: Career;
  changeClubColor: () => void;
};

export const SeasonThemeContext = createContext<
  SeasonThemeContextType | undefined
>(undefined);

export const SeasonThemeProvider = ({
  children,
  career,
}: {
  career: Career;
  careerId: string;
  children: ReactNode;
}) => {
  const [currentColor, setCurrentColor] = useState(
    ColorsService.getColorSaved(career?.id || "default") ||
      career.colorsTeams[0] ||
      "#ffffff"
  );

  const { clubColor, darkClubColor } = useClubColors(currentColor);

  useEffect(() => {
    const savedColor =
      ColorsService.getColorSaved(career?.id || "default") ||
      career.colorsTeams[0] ||
      "#ffffff";
    setCurrentColor(savedColor);
  }, [career]);

  const changeClubColor = useCallback(() => {
    const currentIndex = career.colorsTeams.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % career.colorsTeams.length;
    const newColor = career.colorsTeams[nextIndex];
    setCurrentColor(newColor);
    ColorsService.saveColors(career.id, newColor);
  }, [currentColor, career.id, career.colorsTeams]);

  const activeStyle = useMemo(() => {
    return {
      backgroundColor: clubColor,
      color: "white",
      fontWeight: 600,
      border: `1px solid ${darkClubColor}`,
      clubColor: clubColor,
      darkClubColor: darkClubColor,
    };
  }, [clubColor, darkClubColor]);

  const contextValue = useMemo(
    () => ({
      activeStyle,
      clubColor,
      darkClubColor,
      career,
      changeClubColor,
    }),
    [activeStyle, clubColor, darkClubColor, career, changeClubColor]
  );

  return (
    <SeasonThemeContext.Provider value={contextValue}>
      {children}
    </SeasonThemeContext.Provider>
  );
};
