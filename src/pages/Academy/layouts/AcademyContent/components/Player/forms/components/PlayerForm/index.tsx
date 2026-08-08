import Styles from "./PlayerForm.module.css";
import Button from "../../../../../../../../../components/Button";
import CustomSelect from "../../../../../../../../../components/CustomSelect";
import { FormInput } from "../../../../FormInput";
import { PlayerDataPayload } from "../../types/PlayerDataPayload";
import { PlayerFormTexts } from "../../types/PlayerFormTexts";
import { usePlayerForm } from "../../hooks/usePlayerForm";
import SearchableSelect from "../../../../../../../../../components/SearchableSelect";

type PlayerFormProps = {
  texts: PlayerFormTexts;
  onSubmitData: (data: PlayerDataPayload) => Promise<void>;
  initialData?: Partial<PlayerDataPayload>;
  isEvolution?: boolean;
};

export const PlayerForm = (props: PlayerFormProps) => {
  const { isLoading, sector, position, submit, formRows } =
    usePlayerForm(props);

  return (
    <form className={Styles.formContainer} onSubmit={submit}>
      <input type="hidden" name="sector" value={sector} />
      <input type="hidden" name="position" value={position} />

      {formRows.map((row, rowIndex) => {
        const visibleFields = row.filter(
          (field) => !(props.isEvolution && field.hideOnEvolution),
        );

        const rowClass =
          row.length === 3
            ? Styles.rowThree
            : row.length === 2
              ? Styles.row
              : "";

        if (visibleFields.length === 0) return null;

        return (
          <div className={rowClass} key={rowIndex}>
            {visibleFields.map((field) => {
              if (field.fieldType === "select") {
                return (
                  <div className={Styles.wrapper} key={field.name}>
                    <label className={Styles.label}>{field.label}</label>
                    <CustomSelect
                      name={field.name}
                      options={field.options || []}
                      value={field.value || ""}
                      placeholder={field.placeholder}
                      className={Styles.selectTrigger}
                      onChange={field.onChange || (() => {})}
                      disabled={field.disabled}
                    />
                  </div>
                );
              }

              if (field.fieldType === "searchable-select") {
                return (
                  <div className={Styles.wrapper} key={field.name}>
                    <label className={Styles.label}>{field.label}</label>
                    <SearchableSelect
                      name={field.name}
                      options={field.options || []}
                      value={field.value || ""}
                      placeholder={field.placeholder}
                      onChange={field.onChange || (() => {})}
                      disabled={field.disabled}
                      className={Styles.selectTrigger}
                    />
                  </div>
                );
              }

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { label, hideOnEvolution, fieldType, ...inputProps } =
                field;

              return (
                <FormInput key={field.name} label={label} {...inputProps} />
              );
            })}
          </div>
        );
      })}

      <Button className={Styles.submitBtn} type="submit" disabled={isLoading}>
        {isLoading ? props.texts.loadingText : props.texts.submitText}
      </Button>
    </form>
  );
};
