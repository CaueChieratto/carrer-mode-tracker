import { useClubColors } from "../../../../common/hooks/Colors/UseClubColors";
import { Career } from "../../../../common/interfaces/Career";
import { ColorsService } from "../../../../common/services/ColorsService";
import BottomMenu from "../../../../ui/BottomMenu";
import Styles from "./AcademyContent.module.css";
import { AcademyContentHeader } from "./ui/AcademyContentHeader";
import { useColorChange } from "./hooks/useColorChange";
import { AcademyContentView } from "./views/AcademyContentView";
import { AcademyProvider } from "../contexts/AcademyProvider";

type AcademyContentProps = {
  career: Career;
  seasonId: string;
};

export const AcademyContent = ({ career, seasonId }: AcademyContentProps) => {
  const colorChange = useColorChange();
  const savedColor = ColorsService.getColorSaved(career?.id);
  const { clubColor, darkClubColor } = useClubColors(
    savedColor ?? career?.colorsTeams,
  );

  return (
    <AcademyProvider career={career} seasonId={seasonId}>
      <div
        className={Styles.container}
        style={
          {
            "--club-color": clubColor,
            "--club-color-dark": darkClubColor,
          } as React.CSSProperties
        }
      >
        <AcademyContentHeader
          clubColor={clubColor}
          darkClubColor={darkClubColor}
        />

        <AcademyContentView />
      </div>

      <BottomMenu changeClubColor={colorChange} />
    </AcademyProvider>
  );
};
