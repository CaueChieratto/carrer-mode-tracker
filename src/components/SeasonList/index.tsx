import { useMemo } from "react";
import { TbHandClick } from "react-icons/tb";
import { useSeasons } from "../../common/hooks/Seasons/UseSeasons";
import { ClubData } from "../../common/interfaces/club/clubData";
import SeasonCard from "../../ui/SeasonCard";
import Styles from "./SeasonList.module.css";
import { sortSeasonsByNumber } from "../../common/utils/Sorts";

type SeasonListProps = {
  clubData: ClubData[];
  careerId: string;
};

const SeasonList = ({ clubData, careerId }: SeasonListProps) => {
  const { handleNavigateToSeason, handleDeleteSeason, handleNavigateToGeral } =
    useSeasons(careerId);

  const sortedClubData = useMemo(
    () => sortSeasonsByNumber(clubData),
    [clubData]
  );

  return (
    <section className={Styles.container_card}>
      {sortedClubData.map((season) => (
        <SeasonCard
          key={season.id}
          season={season}
          onNavigate={() => handleNavigateToSeason(season.id)}
          onDelete={() => handleDeleteSeason(season.id, season.seasonNumber)}
        />
      ))}

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
