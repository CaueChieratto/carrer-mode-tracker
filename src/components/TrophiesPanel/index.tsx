import { Dispatch, SetStateAction } from "react";
import { Career } from "../../common/interfaces/Career";
import Styles from "./TrophiesPanel.module.css";
import { ColorsService } from "../../common/services/ColorsService";
import Card from "../../ui/Card";
import { ElementsCardTitles } from "../../common/elements/ElementsCardTitles";
import { useClubColors } from "../../common/hooks/Colors/UseClubColors";
import LeagueTrophyCard from "../LeagueTrophyCard";
import { useSlideUpModal } from "../../common/hooks/Career/UseSlideUpModal";

type TrophiesPanelProps = {
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
};

const TrophiesPanel = ({
  selectedCareer,
  setSelectedCareer,
}: TrophiesPanelProps) => {
  const { clubColor } = useClubColors(
    ColorsService.getColorSaved(selectedCareer.id) || "#ffffff",
  );

  const { sortedTrophies } = useSlideUpModal(selectedCareer);

  return (
    <div className={Styles.container_titles}>
      {sortedTrophies.map((trophy, index) => {
        return (
          <div key={index}>
            <Card className={Styles.card_titles}>
              <ElementsCardTitles.Title
                trophyName={trophy.leagueName}
                seasonsChampions={trophy.seasons.length}
                style={{ backgroundColor: clubColor, color: "white" }}
              />

              <LeagueTrophyCard
                trophy={trophy}
                selectedCareer={selectedCareer}
                setSelectedCareer={setSelectedCareer}
                clubColor={clubColor}
              />
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default TrophiesPanel;
