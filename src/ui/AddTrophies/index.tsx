import { Dispatch, SetStateAction } from "react";
import ContainerForm from "../../components/ContainerForm";
import Form from "../../components/Form";
import Label from "../../components/Label";
import CustomSelect from "../../components/CustomSelect";
import { HiOutlineSelector } from "react-icons/hi";
import ContainerIcon from "../../components/ContainerIcon";
import { Career } from "../../common/interfaces/Career";
import { useClubColors } from "../../common/hooks/Colors/UseClubColors";
import { useAddTrophies } from "../../common/hooks/Career/UseAddTrophies";
import { Buttons } from "../../common/elements/Buttons";
import { ColorsService } from "../../common/services/ColorsService";
import Styles from "./AddTrophies.module.css";
import { ClubData } from "../../common/interfaces/club/clubData";

type AddTrophiesProps = {
  setView: Dispatch<SetStateAction<"titles" | "add" | "menu">>;
  careerId: string;
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  seasonName: string;
  season: ClubData;
};

const AddTrophies = ({
  setView,
  careerId,
  selectedCareer,
  setSelectedCareer,
  seasonName,
  season,
}: AddTrophiesProps) => {
  const { clubColor, darkClubColor } = useClubColors(
    ColorsService.getColorSaved(selectedCareer.id) || "#ffffff",
  );

  const { selectedLeague, setSelectedLeague, leaguesOptions, saveTrophies } =
    useAddTrophies({
      setView,
      careerId,
      selectedCareer,
      setSelectedCareer,
      season,
    });

  return (
    <ContainerForm
      className={Styles.container}
      style={
        {
          "--club-color": clubColor,
          "--club-color-dark": darkClubColor,
        } as React.CSSProperties
      }
    >
      <div className={Styles.header}>
        <span className={Styles.label}>Adicionar</span>
        <span className={Styles.title}>Títulos</span>
      </div>

      <Form
        className={Styles.form}
        onSubmit={(event) =>
          saveTrophies(event, careerId, selectedLeague, seasonName)
        }
      >
        <Label htmlFor="league" className={Styles.field}>
          <ContainerIcon className={Styles.icon}>
            <HiOutlineSelector size={18} />
          </ContainerIcon>

          <CustomSelect
            name="league"
            options={leaguesOptions}
            value={selectedLeague}
            placeholder="Selecione uma liga"
            onChange={(e) => setSelectedLeague(e.target.value)}
            className={Styles.select}
          />
        </Label>

        <Buttons.AddTrophies
          clubColor={clubColor}
          darkClubColor={darkClubColor}
        />
      </Form>

      <button
        type="button"
        onClick={() => setView("menu")}
        className={Styles.back}
      >
        Voltar
      </button>
    </ContainerForm>
  );
};

export default AddTrophies;
