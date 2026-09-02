import { useState } from "react";
import ContainerIcon from "../../../../../components/ContainerIcon";
import Input from "../../../../../components/Input";
import Label from "../../../../../components/Label";
import CustomSelect from "../../../../../components/CustomSelect";
import Styles from "./CareerFormFields.module.css";
import { createCareerFields } from "../../constants/CreateCareerFields";
import { leaguesByContinent } from "../../../../../common/utils/league";
import { formatDateInput } from "../../../../../common/utils/Date";

const excludedRegions = ["UEFA", "Conmebol", "AFC"];
const countryOptions = Object.values(leaguesByContinent)
  .flatMap((continent) => Object.keys(continent))
  .filter((region) => !excludedRegions.includes(region))
  .sort();

type CareerFormFieldsProps = {
  inputValue?: string;
  setInputValue?: (value: string) => void;
};

const CareerFormFields = ({
  inputValue,
  setInputValue,
}: CareerFormFieldsProps) => {
  const [nationValue, setNationValue] = useState("");

  const handleNationChange = (e: {
    target: { name: string; value: string };
  }) => {
    setNationValue(e.target.value);
  };

  return (
    <>
      {createCareerFields.map((field) => (
        <div key={field.name}>
          <Label htmlFor={field.name}>
            <ContainerIcon className={Styles.icon}>{field.icon}</ContainerIcon>

            {field.name === "nation" ? (
              <>
                <CustomSelect
                  name={field.name}
                  options={countryOptions}
                  value={nationValue}
                  placeholder={field.placeholder}
                  onChange={handleNationChange}
                  className={Styles.select}
                />
                <input type="hidden" name={field.name} value={nationValue} />
              </>
            ) : field.name === "createdAt" ? (
              <Input
                id={field.name}
                name={field.name}
                className={Styles.input}
                type="text"
                placeholder={field.placeholder}
                value={inputValue || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = formatDateInput(e.target.value);
                  setInputValue?.(value);
                }}
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                className={Styles.input}
                type="text"
                placeholder={field.placeholder}
              />
            )}
          </Label>
        </div>
      ))}
    </>
  );
};

export default CareerFormFields;
