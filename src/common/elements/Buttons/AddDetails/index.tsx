import { useContext } from "react";
import Button from "../../../../components/Button";
import { SeasonThemeContext } from "../../../../contexts/SeasonThemeContext";

type AddDetailsProps = {
  onClick?: () => void;
};

export const AddDetails = ({ onClick }: AddDetailsProps) => {
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
      Adicionar resultado
    </Button>
  );
};
