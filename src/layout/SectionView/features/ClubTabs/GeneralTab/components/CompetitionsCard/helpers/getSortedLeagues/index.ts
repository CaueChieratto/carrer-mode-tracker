import { League } from "../../../../../../../../../common/interfaces/League";

export const getSortedLeagues = (leagues: League[]): League[] => {
  return [...leagues].sort(
    (firstLeague, secondLeague) =>
      (firstLeague.order || 0) - (secondLeague.order || 0),
  );
};
