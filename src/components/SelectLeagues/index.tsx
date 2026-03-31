import { Dispatch, SetStateAction } from "react";
import { League } from "../../common/utils/Leagues";
import { Career } from "../../common/interfaces/Career";
import Button from "../Button";
import CustomSelect from "../CustomSelect";
import Styles from "./SelectLeagues.module.css";
import { FaTimes } from "react-icons/fa";
import { useSelectLeagues } from "./hooks/useSelectLeagues";
import { buildConfirmLabel } from "./helpers/buildConfirmLabel";

type SelectLeaguesProps = {
  careerId: string;
  nation: string;
  selectedLeagues: League[];
  setSelectedLeagues: (leagues: League[]) => void;
  onClose: () => void;
  clubColor?: string;
  career: Career;
  seasonId: string;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
};

export const SelectLeagues = ({
  nation,
  selectedLeagues,
  setSelectedLeagues,
  onClose,
  clubColor,
  career,
  seasonId,
  setSelectedCareer,
}: SelectLeaguesProps) => {
  const {
    isSaving,
    selectValue,
    leaguesOptions,
    handleSelectChange,
    handleConfirm,
    removeLeague,
  } = useSelectLeagues({
    nation,
    career,
    seasonId,
    selectedLeagues,
    setSelectedLeagues,
    setSelectedCareer,
    onClose,
  });

  console.log(career);

  return (
    <div
      className={Styles.container}
      style={
        {
          "--club-color": clubColor,
        } as React.CSSProperties
      }
    >
      <div className={Styles.wrapper}>
        <div className={Styles.header}>
          <h2 className={Styles.title}>Selecionar Ligas</h2>
          <p className={Styles.subtitle}>Escolha os torneios da temporada</p>
        </div>

        <div className={Styles.select_wrapper}>
          <CustomSelect
            name="leagueQuickSelect"
            options={leaguesOptions}
            value={selectValue}
            placeholder={
              leaguesOptions.length > 0
                ? "Buscar e adicionar liga..."
                : "Todas as ligas adicionadas"
            }
            onChange={handleSelectChange}
            disabled={leaguesOptions.length === 0}
          />
        </div>

        <div className={Styles.grid_scroll}>
          <div className={Styles.leagues_grid}>
            {selectedLeagues.length > 0 ? (
              selectedLeagues.map((league) => (
                <div key={league.name} className={Styles.league_card}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLeague(league.name);
                    }}
                    className={Styles.remove_button}
                  >
                    <FaTimes />
                  </button>

                  <div className={Styles.container_league_img}>
                    <img
                      src={league.logo}
                      alt={league.name}
                      className={Styles.league_img}
                    />
                  </div>

                  <span className={Styles.league_name}>{league.name}</span>
                </div>
              ))
            ) : (
              <p className={Styles.empty}>Nenhuma liga selecionada ainda.</p>
            )}
          </div>
        </div>
      </div>

      <div className={Styles.footer}>
        <Button
          onClick={handleConfirm}
          disabled={isSaving}
          style={{
            backgroundColor: clubColor,
            color: "var(--blackColor)",
            border: `1px solid ${clubColor}`,
          }}
        >
          {buildConfirmLabel(isSaving, selectedLeagues.length)}
        </Button>

        <button type="button" onClick={onClose} className={Styles.back}>
          Voltar
        </button>
      </div>
    </div>
  );
};
