import Button from "../Button";
import Styles from "./FormSection.module.css";

type FormSegmentedControlProps = {
  name: string;
  clubColor: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  action?: () => void;
};

const FormSegmentedControl = ({
  name,
  value,
  clubColor,
  onChange,
  action,
}: FormSegmentedControlProps) => (
  <div className={Styles.segmented_control}>
    <input type="hidden" name={name} value={String(value)} />
    {action ? (
      <Button
        type="button"
        style={{ backgroundColor: clubColor, color: "white", flex: 1 }}
        onClick={action}
      >
        Sim
      </Button>
    ) : (
      <>
        <Button
          type="button"
          className={!value ? Styles.active : ""}
          style={!value ? { backgroundColor: clubColor } : {}}
          onClick={() => onChange?.(false)}
        >
          Não
        </Button>
        <Button
          type="button"
          className={value ? Styles.active : ""}
          style={value ? { backgroundColor: clubColor } : {}}
          onClick={() => onChange?.(true)}
        >
          Sim
        </Button>
      </>
    )}
  </div>
);

export default FormSegmentedControl;
