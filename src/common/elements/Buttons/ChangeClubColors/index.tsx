import { useContext } from "react";
import Button from "../../../../components/Button";
import { SeasonThemeContext } from "../../../../contexts/SeasonThemeContext";
import { IoColorPalette } from "react-icons/io5";

export const ChangeClubColors = () => {
  const { activeStyle, changeClubColor } = useContext(SeasonThemeContext)!;

  return (
    <Button
      shadow="yes"
      typeButton="addPlayer"
      fontSize="large"
      size="big"
      style={{
        backgroundColor: activeStyle.darkClubColor,
        color: activeStyle.color,
        fontWeight: activeStyle.fontWeight,
        border: activeStyle.border,
      }}
      onClick={changeClubColor}
    >
      Trocar Cores <IoColorPalette />
    </Button>
  );
};
