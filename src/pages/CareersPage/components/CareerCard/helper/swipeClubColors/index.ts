import { Dispatch, SetStateAction } from "react";
import { Career } from "../../../../../../common/interfaces/Career";
import { ColorsService } from "../../../../../../common/services/ColorsService";

type changeProps = {
  colorDefault: string;
  primaryClubColor: string;
  secondaryClubColor: string;
  setColor: Dispatch<SetStateAction<string>>;
  selectedCareer: Career;
};

export function swipeClubColors({
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
