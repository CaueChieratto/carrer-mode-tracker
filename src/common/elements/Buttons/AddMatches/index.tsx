import { useContext } from "react";
import Button from "../../../../components/Button";
import { SeasonThemeContext } from "../../../../contexts/SeasonThemeContext";
import { GiSoccerKick } from "react-icons/gi";

type AddMatchesProps = {
  onClick?: () => void;
};

export const AddMatches = ({ onClick }: AddMatchesProps) => {
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
      Adicionar partida <GiSoccerKick />
    </Button>
  );
};
