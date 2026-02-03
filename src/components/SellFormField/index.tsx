import ContainerForm from "../ContainerForm";
import ContainerIcon from "../ContainerIcon";
import Input from "../Input";
import Label from "../Label";
import Styles from "./SellFormField.module.css";

type SellFormFieldProps = {
  id: string;
  name: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SellFormField = ({
  id,
  name,
  icon,
  placeholder,
  value,
  onChange,
}: SellFormFieldProps) => {
  return (
    <ContainerForm className={Styles.form_group}>
      <Label htmlFor={id} className={Styles.label}>
        {name}
      </Label>
      <Label htmlFor={id} className={Styles.input_wrapper}>
        <ContainerIcon className={Styles.icon}>{icon}</ContainerIcon>
        <Input
          id={id}
          name={id}
          className={Styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </Label>
    </ContainerForm>
  );
};

export default SellFormField;
