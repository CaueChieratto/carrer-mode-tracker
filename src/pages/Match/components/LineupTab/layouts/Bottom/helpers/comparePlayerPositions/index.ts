import {
  getGroupForPosition,
  POSITION_DATA,
} from "../../../../../../../../common/types/Positions";
import type { PlayerPosition } from "../../types";

export const comparePlayerPositions = (
  firstPosition: PlayerPosition | null | undefined,
  secondPosition: PlayerPosition | null | undefined,
): number => {
  if (!firstPosition || !secondPosition) {
    return 0;
  }

  const firstGroup = getGroupForPosition(firstPosition);
  const secondGroup = getGroupForPosition(secondPosition);

  if (!firstGroup || !secondGroup) {
    return 0;
  }

  const firstGroupIndex = POSITION_DATA.findIndex(
    (group) => group.key === firstGroup.key,
  );

  const secondGroupIndex = POSITION_DATA.findIndex(
    (group) => group.key === secondGroup.key,
  );

  if (firstGroupIndex !== secondGroupIndex) {
    return firstGroupIndex - secondGroupIndex;
  }

  const positionOrder = firstGroup.sortOrder || firstGroup.positions;

  const firstPositionIndex = positionOrder.indexOf(firstPosition);

  const secondPositionIndex = positionOrder.indexOf(secondPosition);

  const safeFirstPositionIndex =
    firstPositionIndex !== -1 ? firstPositionIndex : 999;

  const safeSecondPositionIndex =
    secondPositionIndex !== -1 ? secondPositionIndex : 999;

  return safeFirstPositionIndex - safeSecondPositionIndex;
};
