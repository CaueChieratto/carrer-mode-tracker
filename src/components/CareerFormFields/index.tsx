import { useState } from "react";
import ContainerIcon from "../ContainerIcon";
import Input from "../Input";
import Label from "../Label";
import CustomSelect from "../CustomSelect";
import Styles from "./CareerFormFields.module.css";
import { createCareerFields } from "../../common/constants/CreateCareerFields";
import { leaguesByContinent } from "../../common/utils/Leagues";

const excludedRegions = ["UEFA", "Conmebol"];
const countryOptions = Object.values(leaguesByContinent)
  .flatMap((continent) => Object.keys(continent))
  .filter((region) => !excludedRegions.includes(region))
  .sort();

const CareerFormFields = () => {
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
