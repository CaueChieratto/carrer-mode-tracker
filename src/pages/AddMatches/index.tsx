import { useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Form from "../../components/Form";
import FormSection from "../../components/FormSection";
import { useForm } from "../../common/hooks/UseForm";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import Load from "../../components/Load";
import Styles from "./AddMatches.module.css";
import { useSeasonData } from "../../common/hooks/Seasons/UseSeasonData/index.ts";
import HeaderSeason from "../../components/HeaderSeason/index.tsx";
import Navbar from "../../ui/Navbar/index.tsx";
import { ModalType } from "../../common/types/enums/ModalType.ts";
import { useMatchActions } from "./hooks/useMatchActions/index.ts";
import { useMatchForm } from "./hooks/useMatchForm/index.ts";

export const AddMatches = () => {
  const { careerId, seasonId, matchesId } = useParams<{
    careerId: string;
    seasonId: string;
    matchesId?: string;
  }>();

  const formRef = useRef<HTMLFormElement>(null);

  const { career, season } = useSeasonData(careerId, seasonId);

  const {
    formValues,
    setFormValues,
    booleanValues,
    handleInputChange,
    handleKeyDown,
    handleKeyUp,
    handleBooleanChange,
  } = useForm();

  const back = useCallback(() => {
    window.location.href = `/Career/${careerId}/Season/${seasonId}`;
  }, [careerId, seasonId]);

  const { formFields } = useMatchForm({
    matchesId,
    season,
    career,
    setFormValues,
    handleBooleanChange,
  });

  const { isSaving, saveMatch, deleteMatch } = useMatchActions({
    careerId: careerId!,
    seasonId: seasonId!,
    matchesId,
    career: career!,
    season: season!,
    formValues: formValues as {
      date: string;
      league: string;
      opponentTeam: string;
    },
    booleanValues,
    onSuccess: back,
  });

  const handleActionClick = useCallback(
    (action: ModalType | string) => {
      if (action === "DELETE_MATCH") {
        deleteMatch();
      }
    },
    [deleteMatch],
  );

  if (!career || !season || isSaving) {
    return <Load />;
  }

  return (
    <SeasonThemeProvider career={career} careerId={career.id}>
      <HeaderSeason careerId={careerId!} career={career} backSeasons={back} />
      <Navbar
        save={saveMatch}
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
              isEditing={!!matchesId}
              onActionClick={handleActionClick}
              onInputChange={handleInputChange}
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
