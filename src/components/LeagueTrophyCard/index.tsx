import { Dispatch, SetStateAction, useMemo } from "react";
import { ElementsCardTitles } from "../../common/elements/ElementsCardTitles";
import { Career } from "../../common/interfaces/Career";
import { Trophy } from "../../common/interfaces/club/trophy";
import Styles from "./LeagueTrophyCard.module.css";
import { ServiceCareer } from "../../common/services/ServiceCareer";
import { sortTrophySeasons } from "../../common/utils/Sorts";

type LeagueTrophyCardProps = {
  trophy: Trophy;
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  clubColor: string;
};

const LeagueTrophyCard = ({
  trophy,
  selectedCareer,
  setSelectedCareer,
  clubColor,
}: LeagueTrophyCardProps) => {
  const sortedSeasons = useMemo(
    () => sortTrophySeasons(trophy.seasons),
    [trophy.seasons]
  );

  return (
    <div className={Styles.titles}>
      <ElementsCardTitles.Images trophyImage={trophy.leagueImage} />
      <div className={Styles.container_season}>
        {sortedSeasons.map((season, index) => {
          const deleteSeason = async () => {
            const ok = confirm(
              `Deseja excluir permanentemente a temporada ${season}?`
            );
            if (!ok) return;

            const updatedTrophies = await ServiceCareer.removeSeason(
              selectedCareer.id,
              trophy.leagueName,
              season
            );

            setSelectedCareer({
              ...selectedCareer,
              trophies: updatedTrophies,
            });
          };
          return (
            <ElementsCardTitles.Span
              deleteSeason={deleteSeason}
              key={index}
              seasons={season}
              style={{ backgroundColor: clubColor, color: "white" }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LeagueTrophyCard;
