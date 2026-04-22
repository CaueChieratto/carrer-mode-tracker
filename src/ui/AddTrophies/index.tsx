import { Dispatch, SetStateAction } from "react";
import ContainerForm from "../../components/ContainerForm";
import Form from "../../components/Form";
import CustomSelect from "../../components/CustomSelect";
import Button from "../../components/Button";
import { Career } from "../../common/interfaces/Career";
import { useClubColors } from "../../common/hooks/Colors/UseClubColors";
import { useAddTrophies } from "../../common/hooks/Career/UseAddTrophies";
import { ColorsService } from "../../common/services/ColorsService";
import Styles from "./AddTrophies.module.css";
import { ClubData } from "../../common/interfaces/club/clubData";
import { FaTimes } from "react-icons/fa";

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

  const {
    selectedTrophies,
    selectValue,
    addTrophy,
    removeTrophy,
    leaguesOptions,
    saveTrophies,
    isSaving,
  } = useAddTrophies({
    setView,
    careerId,
    selectedCareer,
    setSelectedCareer,
    season,
    seasonName,
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
      <Form
        className={Styles.form_container}
        onSubmit={(event) =>
          saveTrophies(event, careerId, selectedTrophies, seasonName)
        }
      >
        <div className={Styles.wrapper}>
          <div className={Styles.header}>
            <h2 className={Styles.title}>Adicionar Títulos</h2>
            <p className={Styles.subtitle}>Escolha os torneios conquistados</p>
          </div>

          <div className={Styles.select_wrapper}>
            <CustomSelect
              name="trophiesQuickSelect"
              options={leaguesOptions}
              value={selectValue}
              placeholder={
                leaguesOptions.length > 0
                  ? "Buscar e adicionar título..."
                  : "Todos os títulos adicionados"
              }
              onChange={(e) => addTrophy(e.target.value)}
              disabled={leaguesOptions.length === 0}
            />
          </div>

          <div className={Styles.grid_scroll}>
            <div className={Styles.leagues_grid}>
              {selectedTrophies.length > 0 ? (
                selectedTrophies.map((trophyName) => {
                  const leagueObj = season.leagues?.find(
                    (l) => l.name === trophyName,
                  );

                  return (
                    <div key={trophyName} className={Styles.league_card}>
                      <button
                        type="button"
                        onClick={() => removeTrophy(trophyName)}
                        className={Styles.remove_button}
                      >
                        <FaTimes />
                      </button>

                      {leagueObj?.trophy && (
                        <div className={Styles.container_league_img}>
                          <img
                            src={leagueObj.trophy}
                            alt={trophyName}
                            className={Styles.league_img}
                          />
                        </div>
                      )}

                      <span className={Styles.league_name}>{trophyName}</span>
                    </div>
                  );
                })
              ) : (
                <p className={Styles.empty}>Nenhum título selecionado ainda.</p>
              )}
            </div>
          </div>
        </div>

        <div className={Styles.footer}>
          <Button
            type="submit"
            disabled={isSaving}
            style={{
              backgroundColor: clubColor,
              color: "var(--blackColor)",
              border: `1px solid ${clubColor}`,
            }}
          >
            {isSaving
              ? "Salvando..."
              : `Confirmar títulos: (${selectedTrophies.length})`}
          </Button>

          <button
            type="button"
            onClick={() => setView("menu")}
            className={Styles.back}
          >
            Voltar
          </button>
        </div>
      </Form>
    </ContainerForm>
  );
};

export default AddTrophies;
