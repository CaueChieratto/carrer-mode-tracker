import { useCallback, useRef, useEffect } from "react";
import { Form, useParams, useLocation } from "react-router-dom";
import Styles from "./AddTeamsToTable.module.css";
import { useTableTeamForm } from "./hooks/useTableTeamForm/index.ts";
import { useTableTeamActions } from "./hooks/useTableTeamActions/index.ts";
import { useSeasonData } from "../../common/hooks/Seasons/UseSeasonData/index.ts";
import { useForm } from "../../common/hooks/UseForm/index.ts";
import FormSection from "../../components/FormSection/index.tsx";
import HeaderSeason from "../../components/HeaderSeason/index.tsx";
import Load from "../../components/Load/index.tsx";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext/index.tsx";
import Navbar from "../../ui/Navbar/index.tsx";

export const AddTeamsToTable = () => {
  const { careerId, seasonId, teamId } = useParams<{
    careerId: string;
    seasonId: string;
    teamId?: string;
  }>();

  const { state } = useLocation();

  const formRef = useRef<HTMLFormElement>(null);
  const { career, season } = useSeasonData(careerId, seasonId);

  const {
    formValues,
    setFormValues,
    handleInputChange,
    handleKeyDown,
    handleKeyUp,
    handleBooleanChange,
  } = useForm();

  useEffect(() => {
    if (state?.teamToEdit) {
      const t = state.teamToEdit;

      const mapZoneToForm = (zone?: string) => {
        switch (zone) {
          case "first":
            return "Campeão";
          case "champions":
            return "Liga dos Campeões";
          case "europa":
            return "Liga Europeia";
          case "conference":
            return "Conference League";
          case "relegation":
            return "Rebaixamento";
          case "promotion":
            return "Acesso";
          case "promotion_playoff":
            return "Play-off para Promoção";
          default:
            return "Padrão";
        }
      };

      setFormValues({
        teamName: t.name,
        played: String(t.played),
        won: String(t.won),
        drawn: String(t.drawn),
        lost: String(t.lost),
        goalsFor: String(t.goalsFor),
        goalsAgainst: String(t.goalsAgainst),
        customZone: mapZoneToForm(t.customZone),
      });
    }
  }, [state?.teamToEdit, setFormValues]);

  const back = useCallback(() => {
    window.location.href = `/Career/${careerId}/Season/${seasonId}`;
  }, [careerId, seasonId]);

  const { formFields } = useTableTeamForm({
    career,
    season,
    formValues,
    setFormValues,
    isEditing: !!teamId,
  });

  const { isSaving, saveTableTeam, deleteTableTeam } = useTableTeamActions({
    careerId: careerId!,
    seasonId: seasonId!,
    teamId,
    career: career!,
    season: season!,
    formValues,
    onSuccess: back,
  });

  const actionClick = async (action: string) => {
    if (action === "DELETE_TEAM") {
      const confirmar = window.confirm(
        "Deseja realmente excluir este time da tabela?",
      );
      if (confirmar) {
        await deleteTableTeam();
      }
    }
  };

  if (!career || !season || isSaving) {
    return <Load />;
  }

  return (
    <SeasonThemeProvider career={career} careerId={career.id}>
      <HeaderSeason careerId={careerId!} career={career} backSeasons={back} />
      <Navbar
        save={saveTableTeam}
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
              onActionClick={actionClick}
              onInputChange={handleInputChange}
              isEditing={!!teamId}
              onBooleanChange={handleBooleanChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
            />
          ))}
        </Form>
      </div>
    </SeasonThemeProvider>
  );
};
