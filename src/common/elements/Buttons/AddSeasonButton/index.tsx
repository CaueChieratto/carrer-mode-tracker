import Button from "../../../../components/Button";
import { Career } from "../../../interfaces/Career";

type AddSeasonButtonProps = {
  clubColor: string;
  darkClubColor: string;
  career: Career;
  onAddSeason: (career: Career) => void;
};

export const AddSeasonButton = ({
  clubColor,
  darkClubColor,
  career,
  onAddSeason,
}: AddSeasonButtonProps) => (
  <Button
    style={{
      backgroundColor: clubColor,
      border: `1px solid ${darkClubColor}`,
    }}
    shadow="yes"
    isActive
    size="big"
    fontSize="large"
    fontWeight="bold"
    onClick={() => onAddSeason(career)}
  >
    Adicionar Temporada
  </Button>
);
