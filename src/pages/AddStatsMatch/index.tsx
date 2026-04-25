import Form from "../../components/Form";
import FormSection from "../../components/FormSection";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import Load from "../../components/Load";
import HeaderSeason from "../../components/HeaderSeason";
import Navbar from "../../ui/Navbar";
import Styles from "./AddStatsMatch.module.css";
import { useAddStatsMatch } from "./hooks/useAddStatsMatch";

export const AddStatsMatch = () => {
  const {
    loading,
    isSaving,
    career,
    match,
    fields,
    formValues,
    handleInputChange,
    saveStats,
    backMatch,
  } = useAddStatsMatch();

  if (loading || isSaving || !career) return <Load />;

  return (
    <SeasonThemeProvider career={career} careerId={career.id}>
      <HeaderSeason
        match={match}
        careerId={career.id}
        career={career}
        backSeasons={backMatch}
        titleText="Estatísticas da Partida"
      />

      <Navbar
        save={saveStats}
        options={["", "Salvar", ""]}
        activeOption={1}
        onOptionClick={() => {}}
      />

      <div className={Styles.container}>
        <Form className={Styles.form}>
          {fields.map((section, index) => (
            <FormSection
              isMatch
              key={index}
              title={section.title}
              rows={section.fields}
              formValues={formValues}
              isEditing={true}
              onInputChange={handleInputChange}
            />
          ))}
        </Form>
      </div>
    </SeasonThemeProvider>
  );
};
