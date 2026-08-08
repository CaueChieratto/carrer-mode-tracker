import { Career } from "../../../../../common/interfaces/Career";
import { getContinentByCountry } from "../../../../../common/services/GetContinentByCountry";

export const isEuropeanSeason = (career: Career): boolean => {
  const continent = getContinentByCountry(career.nation);
  return continent === "Europa";
};
