import { useMemo } from "react";
import { CareerGroup } from "../../../../../../common/interfaces/CareerGroup";

export const useCareerGroupData = (save: CareerGroup) => {
  return useMemo(() => {
    const sortedCareers = [...save.careers].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const currentId = sortedCareers[sortedCareers.length - 1]?.id;

    const totalTrophies = save.careers.reduce((acc, career) => {
      return (
        acc + career.trophies.reduce((sum, t) => sum + t.seasons.length, 0)
      );
    }, 0);

    const startYear = sortedCareers.length
      ? new Date(sortedCareers[0].createdAt).getFullYear()
      : 0;

    const endYear = sortedCareers.length
      ? new Date(
          sortedCareers[sortedCareers.length - 1].createdAt,
        ).getFullYear()
      : 0;

    return {
      sortedCareers,
      currentId,
      totalTrophies,
      startYear,
      endYear,
    };
  }, [save]);
};
