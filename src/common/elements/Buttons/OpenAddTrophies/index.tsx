import { Dispatch, SetStateAction } from "react";
import Button from "../../../../components/Button";

type OpenAddTrophiesProps = {
  setView: Dispatch<SetStateAction<"add" | "titles">>;
};

export const OpenAddTrophies = ({ setView }: OpenAddTrophiesProps) => (
  <Button
    fontSize="large"
    fontWeight="bold"
    typeButton="transparent"
    onClick={() => setView("add")}
  >
    Adicionar
  </Button>
);
