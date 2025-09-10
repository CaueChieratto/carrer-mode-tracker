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
  clubColor?: string;
  darkClubColor?: string;
};

const SellFormField = ({
  id,
  name,
  icon,
  placeholder,
  value,
  onChange,
  clubColor,
  darkClubColor,
}: SellFormFieldProps) => {
  const iconAndTextColor = clubColor;

  return (
    <ContainerForm className={Styles.form_group}>
      <Label
        htmlFor={id}
        className={Styles.label}
        style={{ color: iconAndTextColor }}
      >
        {name}
      </Label>
      <Label
        htmlFor={id}
        className={Styles.input_wrapper}
        style={{ borderColor: darkClubColor }}
      >
        <ContainerIcon
          className={Styles.icon}
          style={{ color: iconAndTextColor }}
        >
          {icon}
        </ContainerIcon>
        <Input
          id={id}
          name={id}
          className={Styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={
            clubColor
              ? ({ "--club-color": clubColor } as React.CSSProperties)
              : undefined
          }
        />
      </Label>
    </ContainerForm>
  );
};

export default SellFormField;
