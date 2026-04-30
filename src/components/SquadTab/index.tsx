import { useMemo } from "react";
import { SquadElements } from "./elements/SquadElements";
import { ClubData } from "../../common/interfaces/club/clubData";
import Card from "../../ui/Card";
import Styles from "./SquadTab.module.css";
import { Career } from "../../common/interfaces/Career";
import { ContainerClubContent } from "../ContainerClubContent";
import { ButtonsSwitch } from "../AllMatchesTab/components/ButtonsSwitch";
import { POSITION_DATA } from "../../common/types/Positions";
import { useSquadSort } from "./hooks/useSquadSort";
import { buildSquadData } from "./helpers/buildSquadData";
import { buildSquadCopyText } from "./helpers/buildSquadCopyText";
import { SORTS_OPTIONS } from "./constants/SORTS_OPTIONS";
import { useClubColors } from "../../common/hooks/Colors/UseClubColors";
import { ColorsService } from "../../common/services/ColorsService";

type SquadTabProps = {
  season: ClubData;
  career: Career;
};

const SquadTab = ({ season, career }: SquadTabProps) => {
  const { sortOption, isAsc, handleSortChange } = useSquadSort();

  const { clubColor } = useClubColors(
    ColorsService.getColorSaved(career.id) || "#ffffff",
  );

  const isGrouped =
    sortOption === "Ordenar por padrão" || sortOption.includes("(Agrupado)");

  const criteria = sortOption.split(" (")[0];

  const { groupedData, flatData } = useMemo(() => {
    return buildSquadData(season.players, criteria, isAsc);
  }, [season.players, criteria, isAsc]);

  const copySquad = async () => {
    if (!flatData.length) return;

    const text = buildSquadCopyText(flatData);

    navigator.clipboard.writeText(text);
    alert("Elenco copiado com sucesso!");
  };

  return (
    <ContainerClubContent>
      <ButtonsSwitch
        selectOptions={SORTS_OPTIONS}
        selectValue={sortOption}
        onSelectChange={handleSortChange}
        onClickCopy={copySquad}
      />

      {isGrouped ? (
        POSITION_DATA.map((group) => {
          const players = groupedData.get(group.key) || [];

          return (
            <Card key={group.name} className={Styles.card}>
              <SquadElements.Header
                name={group.name}
                color={group.color}
                quantity={players.length}
              />

              {players.map((player) => (
                <SquadElements.Section {...player} key={player.id} />
              ))}
            </Card>
          );
        })
      ) : (
        <Card className={Styles.card}>
          <SquadElements.Header name={sortOption} color={clubColor} />

          {flatData.map((player) => (
            <SquadElements.Section {...player} key={player.id} />
          ))}
        </Card>
      )}
    </ContainerClubContent>
  );
};

export default SquadTab;
