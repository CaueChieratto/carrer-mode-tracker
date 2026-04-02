import { useContext } from "react";
import Button from "../../../../components/Button";
import { SeasonThemeContext } from "../../../../contexts/SeasonThemeContext";
import { BsGraphUp } from "react-icons/bs";

type AddPlayerSeasonProps = {
  onClick?: () => void;
};

export const AddPlayerSeason = ({ onClick }: AddPlayerSeasonProps) => {
  const { activeStyle } = useContext(SeasonThemeContext)!;

  return (
    <Button
      shadow="yes"
      typeButton="addPlayer"
      size="big"
      fontSize="large"
      onClick={onClick}
      style={{
        backgroundColor: activeStyle.darkClubColor,
        color: activeStyle.color,
        fontWeight: activeStyle.fontWeight,
        border: activeStyle.border,
      }}
    >
      Adicionar estatísticas <BsGraphUp />
    </Button>
  );
};
