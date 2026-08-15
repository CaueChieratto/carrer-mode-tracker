import { arrayMove } from "@dnd-kit/sortable";
import { League } from "../../../../../../../../../common/interfaces/League";

export const reorderLeagues = (
  leagues: League[],
  activeId: string,
  overId: string,
): League[] => {
  const oldIndex = leagues.findIndex((league) => league.name === activeId);
  const newIndex = leagues.findIndex((league) => league.name === overId);

  if (oldIndex === -1 || newIndex === -1) {
    return leagues;
  }

  return arrayMove(leagues, oldIndex, newIndex).map((item, index) => ({
    ...item,
    order: index,
  }));
};
