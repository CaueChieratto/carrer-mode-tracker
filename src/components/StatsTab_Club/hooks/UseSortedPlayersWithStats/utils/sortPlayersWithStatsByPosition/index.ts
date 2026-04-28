import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { POSITION_DATA } from "../../../../../../common/types/Positions";

export const sortPlayersWithStatsByPosition = (players: Players[]) => {
  return [...players].sort((a, b) => {
    const getIndices = (position: string) => {
      for (
        let groupIndex = 0;
        groupIndex < POSITION_DATA.length;
        groupIndex++
      ) {
        const group = POSITION_DATA[groupIndex];
        const positionIndex =
          group.sortOrder?.indexOf(position) ??
          (group.positions.includes(position) ? 0 : -1);
        if (positionIndex !== -1) {
          return { groupIndex, positionIndex };
        }
      }
      return { groupIndex: 99, positionIndex: 99 };
    };

    const aInfo = getIndices(a.position as string);
    const bInfo = getIndices(b.position as string);

    if (aInfo.groupIndex !== bInfo.groupIndex) {
      return aInfo.groupIndex - bInfo.groupIndex;
    }

    return aInfo.positionIndex - bInfo.positionIndex;
  });
};
