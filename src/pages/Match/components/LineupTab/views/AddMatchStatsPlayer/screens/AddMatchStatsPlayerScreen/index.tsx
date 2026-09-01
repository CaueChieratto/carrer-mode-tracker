import { useRef } from "react";
import Form from "../../../../../../../../components/Form";
import FormSection from "../../../../../../../../components/FormSection";
import Load from "../../../../../../../../components/Load";
import HeaderSeason from "../../../../../../../../components/HeaderSeason";
import Navbar from "../../../../../../../../ui/Navbar";
import { Career } from "../../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../../../common/interfaces/Match";
import Styles from "./AddMatchStatsPlayerScreen.module.css";
import { useAddMatchStatsPlayer } from "../../hooks/useAddMatchStatsPlayer";

type AddMatchStatsPlayerScreenProps = {
  career: Career;
  season: ClubData;
  match: Match;
  playerId: string;
  onClose: () => void;
  onSaved?: (match: Partial<Match>) => void;
};

export const AddMatchStatsPlayerScreen = ({
  career,
  season,
  match,
  playerId,
  onClose,
  onSaved,
}: AddMatchStatsPlayerScreenProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    isSaving,
    player,
    isGoalkeeper,
    formFields,
    formValues,
    isPlayerInLineup,
    handleLocalBooleanChange,
    handleKeyDown,
    handleKeyUp,
    handleLocalInputChange,
    savePlayerStats,
  } = useAddMatchStatsPlayer({
    career,
    season,
    match,
    playerId,
    onClose,
    onSaved,
  });

  if (isSaving || !player || !isPlayerInLineup) {
    return <Load />;
  }

  return (
    <>
      <HeaderSeason
        careerId={career.id}
        career={career}
        backSeasons={onClose}
        titleText={player.name}
      />

      <Navbar
        save={savePlayerStats}
        options={["", "Salvar", ""]}
        activeOption={1}
        onOptionClick={() => {}}
      />

      <div className={Styles.container} style={{ paddingBottom: "350px" }}>
        <Form className={Styles.form} ref={formRef}>
          {formFields.map((section, index) => (
            <FormSection
              key={index}
              title={section.title}
              rows={section.fields}
              formValues={formValues}
              isEditing={true}
              isGoalkeeper={isGoalkeeper}
              onBooleanChange={handleLocalBooleanChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onInputChange={handleLocalInputChange}
            />
          ))}
        </Form>
      </div>
    </>
  );
};
