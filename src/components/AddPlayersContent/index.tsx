import { useParams } from "react-router-dom";
import { Career } from "../../common/interfaces/Career";
import Navbar from "../../ui/Navbar";
import HeaderSeason from "../HeaderSeason";
import Styles from "./AddPlayersContent.module.css";
import { Players } from "../../common/interfaces/playersInfo/players";
import Load from "../Load";
import ModalManager from "../../common/constants/ModalManager";
import { useSeasonTheme } from "../../common/hooks/Seasons/UseSeasonTheme";
import { ClubData } from "../../common/interfaces/club/clubData";
import { useAddPlayersContent } from "../../common/hooks/Players/UseAddPlayersContent";

type AddPlayersContentProps = {
  origin: string | null;
  handleGoBack: () => void;
  career: Career;
  season: ClubData;
  careerId: string;
  playerName?: string;
  player?: Players;
  currentPlayers?: Players[];
};

const AddPlayersContent = ({
  origin,
  handleGoBack,
  career,
  season,
  careerId,
  player,
  currentPlayers,
  playerName,
}: AddPlayersContentProps) => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const { clubColor, darkClubColor } = useSeasonTheme();
  const {
    formRef,
    modalManager,
    isLoading,
    handleDeletePlayer,
    handleSellPlayer,
    activeLabel,
    ActiveComponent,
    handleSave,
  } = useAddPlayersContent({
    origin,
    careerId,
    seasonId: seasonId!,
    player,
    currentPlayers,
    handleGoBack,
    career,
    season,
  });

  const {
    activeModal,
    closeModal,
    openModal,
    selectedCareer,
    setSelectedCareer,
  } = modalManager;

  return (
    <>
      <HeaderSeason
        career={career}
        careerId={careerId}
        backSeasons={handleGoBack}
        player={playerName}
      />
      <Navbar
        save={handleSave}
        options={["", activeLabel, ""]}
        activeOption={1}
        onOptionClick={() => {}}
      />
      <div className={Styles.container}>
        <div className={Styles.form_container}>
          <ActiveComponent
            ref={formRef}
            player={player}
            career={career}
            season={season}
            openModal={openModal}
          />
        </div>
      </div>
      {isLoading && <Load />}
      <ModalManager
        activeModal={activeModal}
        onClose={closeModal}
        onConfirm={handleDeletePlayer}
        onSellConfirm={handleSellPlayer}
        selectedCareer={selectedCareer!}
        setSelectedCareer={setSelectedCareer}
        player={player}
        clubColor={clubColor}
        darkClubColor={darkClubColor}
      />
    </>
  );
};

export default AddPlayersContent;
