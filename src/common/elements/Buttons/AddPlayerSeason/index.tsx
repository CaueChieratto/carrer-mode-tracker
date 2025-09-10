import { useContext } from "react";
import Button from "../../../../components/Button";
import { IoMdPersonAdd } from "react-icons/io";
import { SeasonThemeContext } from "../../../../contexts/SeasonThemeContext";

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
        color: activeStyle.clubColor,
        fontWeight: activeStyle.fontWeight,
        border: activeStyle.border,
      }}
    >
      Adicionar Jogador <IoMdPersonAdd />
    </Button>
  );
};
