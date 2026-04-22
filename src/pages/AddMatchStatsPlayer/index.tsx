import { useRef } from "react";
import Form from "../../components/Form";
import FormSection from "../../components/FormSection";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import Load from "../../components/Load";
import HeaderSeason from "../../components/HeaderSeason";
import Navbar from "../../ui/Navbar";
import Styles from "./AddMatchStatsPlayer.module.css";
import { useAddMatchStatsPlayer } from "./hooks/useAddMatchStatsPlayer";

export const AddMatchStatsPlayer = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    loading,
    isSaving,
    career,
    player,
    isGoalkeeper,
    formFields,
    formValues,

    handleLocalBooleanChange,
    handleKeyDown,
    handleKeyUp,
    handleLocalInputChange,
    savePlayerStats,
    backMatch,
    isPlayerInLineup,
  } = useAddMatchStatsPlayer();

  if (loading || isSaving || !career || !player || !isPlayerInLineup) {
    return <Load />;
  }

  return (
    <SeasonThemeProvider career={career} careerId={career.id}>
      <HeaderSeason
        careerId={career.id}
        career={career}
        backSeasons={backMatch}
        titleText={player.name}
      />

      <Navbar
        save={savePlayerStats}
        options={["", "Salvar", ""]}
        activeOption={1}
        onOptionClick={() => {}}
      />

      <div className={Styles.container}>
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
    </SeasonThemeProvider>
  );
};
