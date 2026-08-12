import Styles from "./FormInput.module.css";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  isLarge?: boolean;
};

export const FormInput = ({ label, isLarge, ...props }: FormInputProps) => {
  return (
    <div
      className={Styles.inputGroup}
      style={isLarge ? { justifyContent: "flex-end" } : {}}
    >
      <label>{label}</label>
      <input {...props} />
    </div>
  );
};
