import { useMemo } from "react";
import { getContinentByCountry } from "../../services/GetContinentByCountry";
import { leaguesByContinent } from "../../utils/Leagues";
import { sortLeaguesForSelect } from "../../utils/Sorts";

export const useLeagueOptions = (country: string) => {
  const continent = useMemo(() => getContinentByCountry(country), [country]);

  const leaguesOptions = useMemo(() => {
    if (!continent) return [];

    const countryLeagues = leaguesByContinent[continent]?.[country] || [];
    const continentSpecificLeagues = {
      Europa: leaguesByContinent["Europa"]?.["UEFA"] || [],
      América: leaguesByContinent["América"]?.["Conmebol"] || [],
    };

    const specificLeagues =
      continentSpecificLeagues[
        continent as keyof typeof continentSpecificLeagues
      ] || [];

    const allLeaguesNames = [...countryLeagues, ...specificLeagues].map(
      (league) => league.name
    );

    return sortLeaguesForSelect(allLeaguesNames);
  }, [continent, country]);

  return leaguesOptions;
};
