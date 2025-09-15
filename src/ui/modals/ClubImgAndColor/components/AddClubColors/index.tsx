import { Dispatch, SetStateAction } from "react";
import Input from "../../../../../components/Input";
import Label from "../../../../../components/Label";
import Styles from "./AddClubColors.module.css";

type AddClubColorsProps = {
  edit: boolean;
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: Dispatch<SetStateAction<string>>;
  setSecondaryColor: Dispatch<SetStateAction<string>>;
};

const AddClubColors = ({
  primaryColor,
  secondaryColor,
  setPrimaryColor,
  setSecondaryColor,
  edit,
}: AddClubColorsProps) => {
  return (
    <div className={Styles.container}>
      <p className={Styles.p}>
        {edit ? "Editar cores do clube" : "Adicionar cores ao clube"}
      </p>
      <div className={Styles.container_colors}>
        <Label htmlFor="primaryColor" className={Styles.container_color}>
          <h3 className={Styles.span}>Cor primaria</h3>
          <Input
            className={Styles.input}
            type="color"
            id="primaryColor"
            name="primaryColor"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
        </Label>
        <Label htmlFor="secondaryColor" className={Styles.container_color}>
          <h3 className={Styles.span}>Cor secundaria</h3>
          <Input
            className={Styles.input}
            type="color"
            id="secondaryColor"
            name="secondaryColor"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
          />
        </Label>
      </div>
    </div>
  );
};

export default AddClubColors;
