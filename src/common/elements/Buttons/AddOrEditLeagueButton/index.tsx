import Button from "../../../../components/Button";
import ContainerButton from "../../../../components/ContainerButton";
import { useSeasonTheme } from "../../../hooks/Seasons/UseSeasonTheme";
import Styles from "../../../../components/AddSeason_Player/AddSeason_Player.module.css";

type AddOrEditLeagueButtonProps = {
  isEditing: boolean;
  onClick: () => void;
};

const AddOrEditLeagueButton = ({
  isEditing,
  onClick,
}: AddOrEditLeagueButtonProps) => {
  const { clubColor } = useSeasonTheme();

  return (
    <ContainerButton className={Styles.container_button}>
      <Button
        shadow="yes"
        size="big"
        fontSize="large"
        fontWeight="bold"
        type="button"
        onClick={onClick}
        style={{ border: `1px solid ${clubColor}`, color: clubColor }}
      >
        {isEditing ? "Salvar Alterações" : "Adicionar Liga"}
      </Button>
    </ContainerButton>
  );
};

export default AddOrEditLeagueButton;
