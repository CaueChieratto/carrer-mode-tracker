import { useMemo } from "react";
import { SquadElements } from "../../common/elements/SquadElements";
import { ClubData } from "../../common/interfaces/club/clubData";
import { POSITION_DATA } from "../../common/types/Positions";
import Card from "../../ui/Card";
import Styles from "./SquadTab.module.css";
import { groupAndSortPlayersByPosition } from "../../common/helpers";

type SquadTabProps = {
  season: ClubData;
};

const SquadTab = ({ season }: SquadTabProps) => {
  const playersByGroupKey = useMemo(
    () => groupAndSortPlayersByPosition(season.players),
    [season.players]
  );

  return (
    <div className={Styles.container}>
      {POSITION_DATA.map((group) => {
        const filteredPlayers = playersByGroupKey.get(group.key) || [];

        return (
          <Card key={group.name} className={Styles.card}>
            <SquadElements.Header
              name={group.name}
              color={group.color}
              quantity={filteredPlayers.length}
            />
            {filteredPlayers.map((player) => (
              <SquadElements.Section {...player} key={player.id} />
            ))}
          </Card>
        );
      })}
    </div>
  );
};
export default SquadTab;
