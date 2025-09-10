import { forwardRef } from "react";
import { useSeasonTheme } from "../../common/hooks/Seasons/UseSeasonTheme";
import { ModalType } from "../../common/types/enums/ModalType";
import ContainerIcon from "../ContainerIcon";
import FieldRenderer from "../FieldRenderer";
import Label from "../Label";
import Styles from "./FormSection.module.css";

export type Field = {
  id: string;
  name: string;
  icon: React.ReactNode;
  checkbox?: boolean;
  inputType?: string;
  placeholder?: string;
  options?: readonly string[];
  disabled?: boolean;
  transform?: "uppercase" | "capitalize";
  maxLength?: number;
  max?: number;
  min?: number;
  note?: string;
  isSigningOnly?: boolean;
  editOnly?: boolean;
  addOnly?: boolean;
};

export type FormSectionProps = {
  title: string;
  rows: readonly (readonly Field[])[];
  formValues?: Record<string, string>;
  isGoalkeeper?: boolean;
  isEditing?: boolean;
  onInputChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: Field
  ) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBooleanChange?: (name: string, value: boolean) => void;
  onActionClick?: (modal: ModalType) => void;
};

const filterRowsByState = (
  rows: readonly (readonly Field[])[],
  isEditing?: boolean,
  formValues?: Record<string, string>,
  isGoalkeeper?: boolean
) => {
  const isSigning = formValues?.["isSigning"] === "true";

  return rows
    .map((fields) =>
      fields.filter((field) => {
        if (field.addOnly && isEditing) return false;
        if (field.editOnly && !isEditing) return false;
        if (field.isSigningOnly && !isSigning) return false;
        if (isGoalkeeper) {
          if (field.id === "goals") return false;
        } else {
          if (field.id === "cleanSheets") return false;
        }
        return true;
      })
    )
    .filter((fields) => fields.length > 0);
};

const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(
  (props, ref) => {
    const {
      title,
      rows,
      isEditing,
      isGoalkeeper,
      onActionClick,
      formValues,
      onInputChange,
      onKeyDown,
      onKeyUp,
      onBooleanChange,
    } = props;

    const { clubColor } = useSeasonTheme();

    const visibleRows = filterRowsByState(
      rows,
      isEditing,
      formValues,
      isGoalkeeper
    );

    if (visibleRows.length === 0) {
      return null;
    }

    return (
      <>
        <h2 className={Styles.section_title} ref={ref}>
          {title}
        </h2>
        <div className={Styles.form_section}>
          {visibleRows.map((fields, rowIndex) => (
            <div
              key={rowIndex}
              className={fields.length > 1 ? Styles.form_row : ""}
            >
              {fields.map((field) => (
                <div key={field.id} className={Styles.form_group}>
                  <Label htmlFor={field.id} className={Styles.label}>
                    <ContainerIcon className={Styles.icon}>
                      {field.icon}
                    </ContainerIcon>
                    {field.name}
                  </Label>
                  <FieldRenderer
                    onActionClick={onActionClick}
                    field={field}
                    formValues={formValues}
                    clubColor={clubColor}
                    isSelectDisabled={field.disabled}
                    onInputChange={onInputChange}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    onBooleanChange={onBooleanChange}
                  />
                  {field.note && <p className={Styles.note}>{field.note}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    );
  }
);

export default FormSection;
