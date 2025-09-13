import ContainerIcon from "../ContainerIcon";
import Input from "../Input";
import Label from "../Label";
import Styles from "./CareerFormFields.module.css";
import { createCareerFields } from "../../common/constants/CreateCareerFields";

const CareerFormFields = () => (
  <>
    {createCareerFields.map((field) => (
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
