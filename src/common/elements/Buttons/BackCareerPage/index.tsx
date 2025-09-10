import Button from "../../../../components/Button";

type BackCareerPageProps = {
  goBack: () => void;
  clubColor: string;
  darkClubColor: string;
};

export const BackCareerPage = ({
  clubColor,
  darkClubColor,
  goBack,
}: BackCareerPageProps) => (
  <Button
    size="small"
    isActive
    fontSize="large"
    fontWeight="bold"
    onClick={goBack}
    style={{
      backgroundColor: clubColor,
      border: `1px solid ${darkClubColor}`,
    }}
  >
    Voltar
  </Button>
);
