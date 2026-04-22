import Form from "../../components/Form";
import FormSection from "../../components/FormSection";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import Load from "../../components/Load";
import HeaderSeason from "../../components/HeaderSeason";
import Navbar from "../../ui/Navbar";
import Styles from "../AddMatchStatsPlayer/AddMatchStatsPlayer.module.css";
import { useAddDetails } from "./hooks/useAddDetails";

export const AddDetails = () => {
  const {
    loading,
    isSaving,
    career,
    match,
    fields,
    formValues,
    handleInputChange,
    handleBooleanChange,
    saveDetails,
    backMatch,
  } = useAddDetails();

  if (loading || isSaving || !career) return <Load />;

  return (
    <SeasonThemeProvider career={career} careerId={career.id}>
      <HeaderSeason
        match={match}
        careerId={career.id}
        career={career}
        backSeasons={backMatch}
        titleText={`${match?.homeTeam} x ${match?.awayTeam}`}
      />
      <Navbar
        save={saveDetails}
        options={["", "Salvar", ""]}
        activeOption={1}
        onOptionClick={() => {}}
      />

      <div className={Styles.container}>
        <Form className={Styles.form}>
          {fields.map((section, index) => (
            <FormSection
              key={index}
              title={section.title}
              rows={section.fields}
              formValues={formValues}
              isEditing={true}
              onInputChange={handleInputChange}
              onBooleanChange={handleBooleanChange}
            />
          ))}
        </Form>
      </div>
    </SeasonThemeProvider>
  );
};
