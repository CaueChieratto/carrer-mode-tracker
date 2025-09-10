import { useContext } from "react";
import Button from "../../../../components/Button";
import { IoMdPersonAdd } from "react-icons/io";
import { SeasonThemeContext } from "../../../../contexts/SeasonThemeContext";

type AddSquadPlayerProps = {
  onClick?: () => void;
};

export const AddSquadPlayer = ({ onClick }: AddSquadPlayerProps) => {
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
      Adicionar Jogador <IoMdPersonAdd />
    </Button>
  );
};
