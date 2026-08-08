import Styles from "./FormInput.module.css";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const FormInput = ({ label, ...props }: FormInputProps) => {
  return (
    <div className={Styles.inputGroup}>
      <label>{label}</label>
      <input {...props} />
    </div>
  );
};
