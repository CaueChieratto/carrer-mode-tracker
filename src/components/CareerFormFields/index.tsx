import { BiWorld } from "react-icons/bi";
import { GiCheckedShield } from "react-icons/gi";
import { GrUserManager } from "react-icons/gr";
import ContainerIcon from "../ContainerIcon";
import Input from "../Input";
import Label from "../Label";
import Styles from "./CareerFormFields.module.css";

const formFields = [
  {
    name: "club",
    icon: <GiCheckedShield size={15} />,
    placeholder: "Clube",
  },
  {
    name: "nation",
    icon: <BiWorld size={15} />,
    placeholder: "País",
  },
  {
    name: "manager",
    icon: <GrUserManager size={15} />,
    placeholder: "Técnico",
  },
];

const CareerFormFields = () => (
  <>
    {formFields.map((field) => (
      <div key={field.name}>
        <Label htmlFor={field.name}>
          <ContainerIcon className={Styles.icon}>{field.icon}</ContainerIcon>
          <Input
            id={field.name}
            name={field.name}
            className={Styles.input}
            type="text"
            placeholder={field.placeholder}
          />
        </Label>
      </div>
    ))}
  </>
);

export default CareerFormFields;
