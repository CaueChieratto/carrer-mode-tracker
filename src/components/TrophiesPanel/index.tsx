import { Dispatch, SetStateAction } from "react";
import { Career } from "../../common/interfaces/Career";
import Styles from "./TrophiesPanel.module.css";
import { ColorsService } from "../../common/services/ColorsService";
import Card from "../../ui/Card";
import { ElementsCardTitles } from "../../common/elements/ElementsCardTitles";
import { useClubColors } from "../../common/hooks/Colors/UseClubColors";
import LeagueTrophyCard from "../LeagueTrophyCard";
import { useSlideUpModal } from "../../common/hooks/Career/UseSlideUpModal";

type GroupedCareer = Career & { groupedCareers?: Career[] };

type TrophiesPanelProps = {
  selectedCareer: GroupedCareer;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
};

const CareerTrophies = ({
  career,
  setSelectedCareer,
}: {
  career: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
}) => {
  const { clubColor } = useClubColors(
    ColorsService.getColorSaved(career.id) || "#ffffff",
  );
  const { sortedTrophies } = useSlideUpModal(career);

  const handleSetSelectedCareer = (action: SetStateAction<Career>) => {
    setSelectedCareer((prev) => {
      const prevExtended = prev as GroupedCareer;

      if (prevExtended.groupedCareers) {
        const updatedCareer =
          typeof action === "function" ? action(career) : action;

        const newGrouped = prevExtended.groupedCareers.map((c) =>
          c.id === updatedCareer.id ? updatedCareer : c,
        );

        return {
          ...prevExtended,
          groupedCareers: newGrouped,
        } as Career;
      }

      return typeof action === "function" ? action(prev) : action;
    });
  };

  return (
    <>
      {sortedTrophies.map((trophy, index) => (
        <div key={`${career.id}-${index}`}>
          <Card className={Styles.card_titles}>
            <ElementsCardTitles.Title
              trophyName={trophy.leagueName}
              seasonsChampions={trophy.seasons.length}
              style={{ backgroundColor: clubColor, color: "white" }}
            />
            <LeagueTrophyCard
              trophy={trophy}
              selectedCareer={career}
              setSelectedCareer={handleSetSelectedCareer}
              clubColor={clubColor}
            />
          </Card>
        </div>
      ))}
    </>
  );
};

const TrophiesPanel = ({
  selectedCareer,
  setSelectedCareer,
}: TrophiesPanelProps) => {
  const careersToRender = selectedCareer.groupedCareers || [selectedCareer];

  return (
    <div className={Styles.container_titles}>
      {careersToRender.map((career) => (
        <CareerTrophies
          key={career.id}
          career={career}
          setSelectedCareer={setSelectedCareer}
        />
      ))}
    </div>
  );
};

export default TrophiesPanel;
