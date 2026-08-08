import Button from "../../../../../../../../../components/Button";
import { FormInput } from "../../../../FormInput";
import { TournamentDataPayload } from "../../types/TournamentDataPayload";
import { TournamentFormTexts } from "../../types/TournamentFormTexts";
import { useTournamentForm } from "../../hooks/useTournamentForm";
import Styles from "../../../../Player/forms/components/PlayerForm/PlayerForm.module.css";
import { AcademyTournaments } from "../../../../../interfaces/AcademyTournaments/AcademyTournaments";

type TournamentFormProps = {
  texts: TournamentFormTexts;
  onSubmitData: (data: TournamentDataPayload) => Promise<void>;
  isEdit?: boolean;
  initialData?: Partial<AcademyTournaments>;
};

export const TournamentForm = (props: TournamentFormProps) => {
  const { isLoading, submit, formRows } = useTournamentForm(props);

  return (
    <form className={Styles.formContainer} onSubmit={submit}>
      {formRows.map((row, rowIndex) => {
        const rowClass =
          row.length === 3
            ? Styles.rowThree
            : row.length === 2
              ? Styles.row
              : "";
        return (
          <div className={rowClass || Styles.row} key={rowIndex}>
            {row.map((field) => {
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
