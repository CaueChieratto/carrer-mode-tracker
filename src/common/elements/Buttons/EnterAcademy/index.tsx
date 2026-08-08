import { useContext } from "react";
import Button from "../../../../components/Button";
import { SeasonThemeContext } from "../../../../contexts/SeasonThemeContext";
import { IoEnterOutline } from "react-icons/io5";

type EnterAcademyProps = {
  onClick?: () => void;
};

export const EnterAcademy = ({ onClick }: EnterAcademyProps) => {
  const { activeStyle } = useContext(SeasonThemeContext)!;

  return (
    <Button
      shadow="yes"
      typeButton="addPlayer"
      fontSize="large"
      size="big"
      onClick={onClick}
      style={{
        backgroundColor: activeStyle.darkClubColor,
        color: activeStyle.color,
        fontWeight: activeStyle.fontWeight,
        border: activeStyle.border,
      }}
    >
      Acessar Base <IoEnterOutline />
    </Button>
  );
};
