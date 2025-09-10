import { useMemo } from "react";
import { getContinentByCountry } from "../../services/GetContinentByCountry";
import { leaguesByContinent } from "../../utils/Leagues";

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

    return [...countryLeagues, ...specificLeagues].map((league) => league.name);
  }, [continent, country]);

  return leaguesOptions;
};
