import { MatchFormTexts } from "../../types/MatchFormTexts";
import { useMatchForm } from "../../hooks/useMatchForm";
import Styles from "../../../../../../Player/forms/components/PlayerForm/PlayerForm.module.css";
import Button from "../../../../../../../../../../../components/Button";
import SearchableSelect from "../../../../../../../../../../../components/SearchableSelect";
import { AcademyMatches } from "../../../../../../../interfaces/AcademyTournaments/AcademyMatches/AcademyMatches";
import { FormInput } from "../../../../../../FormInput";
import { MatchDataPayload } from "../../types/MatchDataPayload";

type MatchFormProps = {
  texts: MatchFormTexts;
  teamOptions: string[];
  statusOptions: string[];
  onSubmitData: (data: MatchDataPayload) => Promise<void>;
  initialData?: Partial<AcademyMatches>;
};

export const MatchForm = (props: MatchFormProps) => {
  const { isLoading, submit, formRows, opponentTeam, status } =
    useMatchForm(props);

  return (
    <form className={Styles.formContainer} onSubmit={submit}>
      <input type="hidden" name="opponentTeam" value={opponentTeam} />
      <input type="hidden" name="status" value={status} />

      {formRows.map((row, rowIndex) => {
        const rowClass = row.length === 2 ? Styles.row : "";
        return (
          <div className={rowClass || Styles.row} key={rowIndex}>
            {row.map((field) => {
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
                      className={Styles.selectTrigger}
                    />
                  </div>
                );
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { label, fieldType, hideOnEvolution, ...inputProps } =
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
