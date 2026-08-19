import { Dispatch, SetStateAction } from "react";
import Input from "../../../../../components/Input";
import Styles from "./AddClubColors.module.css";

type AddClubColorsProps = {
  edit: boolean;
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: Dispatch<SetStateAction<string>>;
  setSecondaryColor: Dispatch<SetStateAction<string>>;
};

const getContrastColor = (hexcolor: string) => {
  let hex = hexcolor.replace("#", "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

const AddClubColors = ({
  primaryColor,
  secondaryColor,
  setPrimaryColor,
  setSecondaryColor,
}: AddClubColorsProps) => {
  return (
    <div className={Styles.container}>
      <p className={Styles.section_title}>CORES DO CLUBE</p>

      <div className={Styles.container_colors}>
        <div className={Styles.color_item}>
          <span className={Styles.label_text}>Cor primária</span>
          <div
            className={Styles.color_picker_wrapper}
            style={{ backgroundColor: primaryColor }}
          >
            <span
              className={Styles.hex_value}
              style={{ color: getContrastColor(primaryColor) }}
            >
              {primaryColor.toUpperCase()}
            </span>
            <Input
              className={Styles.color_input}
              type="color"
              id="primaryColor"
              name="primaryColor"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
          </div>
        </div>

        <div className={Styles.color_item}>
          <span className={Styles.label_text}>Cor secundária</span>
          <div
            className={Styles.color_picker_wrapper}
            style={{ backgroundColor: secondaryColor }}
          >
            <span
              className={Styles.hex_value}
              style={{ color: getContrastColor(secondaryColor) }}
            >
              {secondaryColor.toUpperCase()}
            </span>
            <Input
              className={Styles.color_input}
              type="color"
              id="secondaryColor"
              name="secondaryColor"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClubColors;
