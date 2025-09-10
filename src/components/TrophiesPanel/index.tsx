import { Dispatch, SetStateAction } from "react";
import { Career } from "../../common/interfaces/Career";
import ContainerButton from "../ContainerButton";
import Styles from "./TrophiesPanel.module.css";
import { GiTrophiesShelf } from "react-icons/gi";
import { ColorsService } from "../../common/services/ColorsService";
import Card from "../../ui/Card";
import { ElementsCardTitles } from "../../common/elements/ElementsCardTitles";
import { useClubColors } from "../../common/hooks/Colors/UseClubColors";
import AddTrophies from "../../ui/modals/AddTrophies";
import LeagueTrophyCard from "../LeagueTrophyCard";
import { useSlideUpModal } from "../../common/hooks/Career/UseSlideUpModal";
import { Buttons } from "../../common/elements/Buttons";

type TrophiesPanelProps = {
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
};

const TrophiesPanel = ({
  selectedCareer,
  setSelectedCareer,
}: TrophiesPanelProps) => {
  const country = selectedCareer.nation;

  const { clubColor, darkClubColor } = useClubColors(
    ColorsService.getColorSaved(selectedCareer.id) || "#ffffff"
  );

  const { view, setView, sortedTrophies } = useSlideUpModal(selectedCareer);

  return (
    <>
      {view === "titles" && (
        <>
          <ContainerButton
            className={Styles.container_button}
            style={{
              backgroundColor: clubColor,
              border: `1px solid ${darkClubColor}`,
            }}
          >
            <Buttons.OpenAddTrophies setView={setView} />
            <GiTrophiesShelf size={18} color="white" />
          </ContainerButton>
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
        </>
      )}
      {view === "add" && (
        <div className={Styles.container_add_trophies}>
          <AddTrophies
            country={country}
            careerId={selectedCareer.id}
            setView={setView}
            selectedCareer={selectedCareer}
            setSelectedCareer={setSelectedCareer}
          ></AddTrophies>
        </div>
      )}
    </>
  );
};

export default TrophiesPanel;
