import { Dispatch, SetStateAction } from "react";
import { Career } from "../../../common/interfaces/Career";
import Button from "../../../components/Button";
import AddTrophies from "../../AddTrophies";
import Styles from "./SeasonConfigs.module.css";
import { IoOptionsOutline } from "react-icons/io5";
import { GiTrophiesShelf } from "react-icons/gi";
import { CardsModal } from "./components/CardsModal";
import { SelectLeagues } from "../../../components/SelectLeagues";
import { useSeasonConfigs } from "./hooks/useSeasonConfigs";
import { SEASON_ENTER_LABEL } from "./constants/seasonLabels";
import { ClubData } from "../../../common/interfaces/club/clubData";

type SeasonConfigsProps = {
  career: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  onNavigate: () => void;
  seasonName: string;
  season: ClubData;
};

export const SeasonConfigs = ({
  career,
  setSelectedCareer,
  onNavigate,
  seasonName,
  season,
}: SeasonConfigsProps) => {
  const {
    view,
    setView,
    currentSeasonId,
    country,
    selectedLeagues,
    setSelectedLeagues,
    clubColor,
    darkClubColor,
    canProceed,
  } = useSeasonConfigs({ career, setSelectedCareer });

  return (
    <>
      {view === "menu" && (
        <div className={Styles.container}>
          <div className={Styles.grid}>
            <CardsModal
              icon={<IoOptionsOutline className={Styles.icon} />}
              label="Selecionar"
              title="Ligas"
              onClick={() => setView("selecting")}
              clubColor={clubColor}
              darkClubColor={darkClubColor}
            />

            {canProceed && (
              <CardsModal
                icon={<GiTrophiesShelf className={Styles.icon} />}
                label="Adicionar"
                title="Títulos"
                onClick={() => setView("add")}
                clubColor={clubColor}
                darkClubColor={darkClubColor}
              />
            )}
          </div>

          {canProceed && (
            <Button
              className={Styles.button}
              onClick={onNavigate}
              style={{
                backgroundColor: clubColor,
                border: `1px solid ${darkClubColor}`,
              }}
            >
              {SEASON_ENTER_LABEL}
            </Button>
          )}
        </div>
      )}

      {view === "selecting" && (
        <SelectLeagues
          careerId={career.id}
          nation={country}
          selectedLeagues={selectedLeagues}
          setSelectedLeagues={setSelectedLeagues}
          onClose={() => setView("menu")}
          clubColor={clubColor}
          seasonId={currentSeasonId}
          career={career}
          setSelectedCareer={setSelectedCareer}
        />
      )}

      {view === "add" && (
        <div className={Styles.container_add_trophies}>
          <AddTrophies
            season={season}
            careerId={career.id}
            setView={() => setView("menu")}
            selectedCareer={career}
            setSelectedCareer={setSelectedCareer}
            seasonName={seasonName}
          />
        </div>
      )}
    </>
  );
};
