import { useContext } from "react";
import Button from "../../../../components/Button";
import { SeasonThemeContext } from "../../../../contexts/SeasonThemeContext";
import { BiShieldAlt } from "react-icons/bi";

type AddTeamsToTableProps = {
  onClick?: () => void;
};

export const AddTeamsToTable = ({ onClick }: AddTeamsToTableProps) => {
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
      Adicionar times <BiShieldAlt />
    </Button>
  );
};
