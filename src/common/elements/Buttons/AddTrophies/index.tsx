import Button from "../../../../components/Button";

type AddTrophiesProps = {
  clubColor: string;
  darkClubColor: string;
};

export const AddTrophies = ({ clubColor, darkClubColor }: AddTrophiesProps) => (
  <Button
    type="submit"
    isActive
    fontSize="large"
    fontWeight="bold"
    size="big"
    style={{
      backgroundColor: clubColor,
      border: `1px solid ${darkClubColor}`,
    }}
  >
    Salvar
  </Button>
);
