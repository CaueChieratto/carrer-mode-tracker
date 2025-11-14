import { Dispatch, SetStateAction } from "react";
import ContainerForm from "../../../components/ContainerForm";
import Form from "../../../components/Form";
import Label from "../../../components/Label";
import Select from "../../../components/Select";
import Styles from "./AddTrophies.module.css";
import { HiOutlineSelector } from "react-icons/hi";
import { IoCalendar } from "react-icons/io5";
import ContainerIcon from "../../../components/ContainerIcon";
import { Career } from "../../../common/interfaces/Career";
import { useClubColors } from "../../../common/hooks/Colors/UseClubColors";
import { useAddTrophies } from "../../../common/hooks/Career/UseAddTrophies";
import { Buttons } from "../../../common/elements/Buttons";
import { Inputs } from "../../../common/elements/Inputs";
import { ColorsService } from "../../../common/services/ColorsService";

type AddTrophiesProps = {
  setView: Dispatch<SetStateAction<"titles" | "add">>;
  careerId: string;
  country: string;
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
};

const AddTrophies = ({
  setView,
  careerId,
  country,
  selectedCareer,
  setSelectedCareer,
}: AddTrophiesProps) => {
  const { clubColor, darkClubColor } = useClubColors(
    ColorsService.getColorSaved(selectedCareer.id) || "#ffffff"
  );
  const {
    selectedLeague,
    setSelectedLeague,
    season,
    handleSeasonChange,
    leaguesOptions,
    saveTrophies,
  } = useAddTrophies({
    setView,
    careerId,
    country,
    selectedCareer,
    setSelectedCareer,
  });

  return (
    <ContainerForm>
      <Form onSubmit={(event) => saveTrophies(event, careerId, selectedLeague)}>
        <h1 style={{ color: clubColor }}>Adicionar Novo Título</h1>
        <Label
          htmlFor="league"
          style={{ border: `1px solid ${darkClubColor}`, paddingLeft: "45px" }}
        >
          <ContainerIcon>
            <HiOutlineSelector color={clubColor} size={20} />
          </ContainerIcon>
          <Select
            id="league"
            name="league"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            style={{ color: clubColor }}
          >
            <option value="" disabled>
              Selecione uma liga
            </option>
            {leaguesOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Label>
        <Label
          htmlFor="season"
          style={
            {
              alignItems: "flex-start",
              border: `1px solid ${darkClubColor}`,
              paddingLeft: "45px",
              "--club-color": clubColor,
            } as React.CSSProperties
          }
        >
          <ContainerIcon>
            <IoCalendar color={clubColor} size={20} />
          </ContainerIcon>
          <Inputs.AddTrophies
            className={Styles.input_placeholder}
            clubColor={clubColor}
            onChange={handleSeasonChange}
            season={season}
          />
        </Label>
        <Buttons.AddTrophies
          clubColor={clubColor}
          darkClubColor={darkClubColor}
        />
      </Form>
    </ContainerForm>
  );
};

export default AddTrophies;
