import { useMemo } from "react";
import { TbHandClick } from "react-icons/tb";
import { useSeasons } from "../../common/hooks/Seasons/UseSeasons";
import { ClubData } from "../../common/interfaces/club/clubData";
import SeasonCard from "../../ui/SeasonCard";
import Styles from "./SeasonList.module.css";
import { sortSeasonsByNumber } from "../../common/utils/Sorts";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";
import { ModalType } from "../../common/types/enums/ModalType";
import ModalManager from "../../common/constants/ModalManager";
import { Career } from "../../common/interfaces/Career";

type SeasonListProps = {
  clubData: ClubData[];
  careerId: string;
  career: Career;
};

const SeasonList = ({ clubData, careerId, career }: SeasonListProps) => {
  const { handleNavigateToSeason, handleDeleteSeason, handleNavigateToGeral } =
    useSeasons(careerId);

  const {
    activeModal,
    openModal,
    closeModal,
    selectedSeason,
    selectedCareer,
    setSelectedCareer,
  } = useModalManager();

  const sortedClubData = useMemo(
    () => sortSeasonsByNumber(clubData),
    [clubData],
  );

  return (
    <section className={Styles.container_card}>
      {sortedClubData.map((season) => (
        <SeasonCard
          key={season.id}
          season={season}
          onClick={() => openModal(ModalType.SEASON_CONFIGS, undefined, season)}
          onDelete={() => handleDeleteSeason(season.id, season.seasonNumber)}
        />
      ))}

      {activeModal !== ModalType.NONE && (
        <ModalManager
          activeModal={activeModal}
          selectedCareer={selectedCareer}
          setSelectedCareer={setSelectedCareer}
          selectedSeason={selectedSeason}
          onClose={closeModal}
          onNavigateSeason={handleNavigateToSeason}
          career={career}
        />
      )}

      <div
        className={Styles.card}
        onClick={() => handleNavigateToGeral(careerId)}
      >
        <h1 className={Styles.general}>Geral</h1>
        <TbHandClick />
      </div>
    </section>
  );
};

export default SeasonList;
