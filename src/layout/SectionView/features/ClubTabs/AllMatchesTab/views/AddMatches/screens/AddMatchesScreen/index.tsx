import { useCallback, useRef } from "react";
import Form from "../../../../../../../../../components/Form";
import FormSection from "../../../../../../../../../components/FormSection";
import Load from "../../../../../../../../../components/Load";
import Styles from "./AddMatchesScreen.module.css";
import HeaderSeason from "../../../../../../../../../components/HeaderSeason";
import Navbar from "../../../../../../../../../ui/Navbar";
import { useMatchActions } from "../../hooks/useMatchActions";
import { useMatchForm } from "../../hooks/useMatchForm";
import { useAddMatchesContext } from "../../contexts/context";

export const AddMatchesScreen = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    career,
    matchesId,
    onClose,
    formValues,
    handleInputChange,
    handleKeyDown,
    handleKeyUp,
    handleBooleanChange,
  } = useAddMatchesContext();

  const { formFields } = useMatchForm();
  const { isSaving, saveMatch, deleteMatch } = useMatchActions();

  const handleActionClick = useCallback(
    (action: string) => {
      if (action === "DELETE_MATCH") deleteMatch();
    },
    [deleteMatch],
  );

  if (isSaving) {
    return <Load />;
  }

  return (
    <>
      <HeaderSeason
        careerId={career.id}
        career={career}
        backSeasons={onClose}
      />
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
    </>
  );
};
