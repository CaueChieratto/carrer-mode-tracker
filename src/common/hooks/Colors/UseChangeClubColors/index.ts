import { Dispatch, SetStateAction } from "react";
import { Career } from "../../../interfaces/Career";
import { ColorsService } from "../../../services/ColorsService";

type changeProps = {
  colorDefault: string;
  primaryClubColor: string;
  secondaryClubColor: string;
  setColor: Dispatch<SetStateAction<string>>;
  selectedCareer: Career;
};

export function UseChange({
  colorDefault,
  primaryClubColor,
  secondaryClubColor,
  setColor,
  selectedCareer,
}: changeProps) {
  const newColor =
    colorDefault === primaryClubColor ? secondaryClubColor : primaryClubColor;

  setColor(newColor);
  ColorsService.saveColors(selectedCareer.id, newColor);
}
