import Form from "../Form";
import FormSection from "../FormSection";
import Styles from "./AddSeason_Player.module.css";
import { Career } from "../../common/interfaces/Career";
import { Players } from "../../common/interfaces/playersInfo/players";
import { ModalType } from "../../common/types/enums/ModalType";
import { forwardRef, useRef } from "react";
import StatsLeagues_Form from "../StatsLeagues_Form";
import { useSeasonTheme } from "../../common/hooks/Seasons/UseSeasonTheme";
import { ClubData } from "../../common/interfaces/club/clubData";
import AddOrEditLeagueButton from "../../common/elements/Buttons/AddOrEditLeagueButton";
import { usePlayerSeasonStats } from "../../common/hooks/Players/UsePlayerSeasonStats";
import Load from "../Load";

type AddSeason_PlayerProps = {
  player?: Players;
  career: Career;
  season: ClubData;
  openModal: (modal: ModalType, career?: Career) => void;
};

const AddSeason_Player = forwardRef<HTMLFormElement, AddSeason_PlayerProps>(
  ({ career, season, player }, ref) => {
    const { clubColor } = useSeasonTheme();
    const leagueFormRef = useRef<HTMLDivElement>(null);
    const {
      formValues,
      booleanValues,
      leagues,
      isGoalkeeper,
      originalLeagueNameToEdit,
      finalFormItems,
      handleInputChange,
      handleBooleanChange,
      handleLeagueClick,
      handleAddOrEditLeague,
      isLoading,
    } = usePlayerSeasonStats({ career, season, player, leagueFormRef });

    return (
      <>
        <Form className={Styles.form} ref={ref}>
          {finalFormItems.map((item, index) => (
            <div key={index}>
              <FormSection
                ref={item.title === "Selecione a Liga" ? leagueFormRef : null}
                title={item.title}
                rows={item.fields}
                isGoalkeeper={isGoalkeeper}
                formValues={{
                  ...formValues,
                  ...Object.fromEntries(
                    Object.entries(booleanValues).map(([k, v]) => [
                      k,
                      String(v),
                    ])
                  ),
                }}
                onInputChange={handleInputChange}
                onBooleanChange={handleBooleanChange}
              />
              {item.title === "Selecione a Liga" && (
                <AddOrEditLeagueButton
                  isEditing={!!originalLeagueNameToEdit}
                  onClick={handleAddOrEditLeague}
                />
              )}
            </div>
          ))}
          <StatsLeagues_Form
            isGoalkeeper={isGoalkeeper}
            leagues={leagues}
            clubColor={clubColor}
            onLeagueClick={handleLeagueClick}
            originalLeagueNameToEdit={originalLeagueNameToEdit}
          />
        </Form>
        {isLoading && <Load />}
      </>
    );
  }
);

AddSeason_Player.displayName = "AddSeason_Player";

export default AddSeason_Player;
