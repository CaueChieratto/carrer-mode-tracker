export type League = {
  name: string;
  trophy: string;
  logo: string;
};

export type CountryLeagues = {
  [country: string]: League[];
};

export type ContinentLeagues = {
  [continent: string]: CountryLeagues;
};

export const leaguesByContinent: ContinentLeagues = {
  Europa: {
    UEFA: [
      {
        name: "Champions League",
        logo: "/images/leagues/uefa/championsLeague.png",
        trophy: "/images/trophies/uefa/championsLeague.png",
      },
      {
        name: "Europa League",
        logo: "/images/leagues/uefa/europaLeague.png",
        trophy: "/images/trophies/uefa/europaLeague.png",
      },
      {
        name: "Conference League",
        logo: "/images/leagues/uefa/conferenceLeague.png",
        trophy: "/images/trophies/uefa/conferenceLeague.png",
      },
      {
        name: "UEFA Super Cup",
        logo: "/images/leagues/uefa/uefaSupercopa.png",
        trophy: "/images/trophies/uefa/uefaSupercopa.png",
      },
    ],
    Espanha: [
      {
        name: "La Liga",
        logo: "/images/leagues/spain/laliga.png",
        trophy: "/images/trophies/spain/laliga.png",
      },
      {
        name: "Copa do Rey",
        logo: "/images/leagues/spain/copaDoRey.png",
        trophy: "/images/trophies/spain/copaDoRey.png",
      },
      {
        name: "Supercopa",
        logo: "/images/leagues/spain/supercopa.png",
        trophy: "/images/trophies/spain/supercopa.png",
      },
      {
        name: "La liga 2",
        logo: "/images/leagues/spain/laliga2.png",
        trophy: "/images/trophies/spain/laliga2.png",
      },
    ],
    Inglaterra: [
      {
        name: "Premier League",
        logo: "/images/leagues/england/premierLeague.png",
        trophy: "/images/trophies/england/premierLeague.png",
      },
      {
        name: "FA Cup",
        logo: "/images/leagues/england/faCup.png",
        trophy: "/images/trophies/england/faCup.png",
      },
      {
        name: "Carabao Cup",
        logo: "/images/leagues/england/carabao.png",
        trophy: "/images/trophies/england/carabao.png",
      },
      {
        name: "Community Shield",
        logo: "/images/leagues/england/communityShield.png",
        trophy: "/images/trophies/england/communityShield.png",
      },
      {
        name: "Championship",
        logo: "/images/leagues/england/championship.png",
        trophy: "/images/trophies/england/championship.png",
      },
      {
        name: "League One",
        logo: "/images/leagues/england/leagueOne.png",
        trophy: "/images/trophies/england/leagueOne.png",
      },
      {
        name: "League Two",
        logo: "/images/leagues/england/leagueTwo.png",
        trophy: "/images/trophies/england/leagueTwo.png",
      },
      {
        name: "BSM",
        logo: "/images/leagues/england/bsm.png",
        trophy: "/images/trophies/england/bsm.png",
      },
    ],
    Alemanha: [
      {
        name: "Bundesliga",
        logo: "/images/leagues/germany/bundesliga.png",
        trophy: "/images/trophies/germany/bundesliga.png",
      },
      {
        name: "DFB-Pokal",
        logo: "/images/leagues/germany/pokal.png",
        trophy: "/images/trophies/germany/pokal.png",
      },
      {
        name: "Supercup",
        logo: "/images/leagues/germany/supercopa.png",
        trophy: "/images/trophies/germany/supercopa.png",
      },
      {
        name: "Bundesliga 2",
        logo: "/images/leagues/germany/bundesliga2.png",
        trophy: "/images/trophies/germany/bundesliga2.png",
      },
      {
        name: "3. Liga",
        logo: "/images/leagues/germany/3liga.png",
        trophy: "/images/trophies/germany/3liga.png",
      },
    ],
  },
  América: {
    Conmebol: [
      {
        name: "Libertadores",
        logo: "/images/leagues/conmebol/libertadores.png",
        trophy: "/images/trophies/conmebol/libertadores.png",
      },
      {
        name: "Sul Americana",
        logo: "/images/leagues/conmebol/sulamericana.png",
        trophy: "/images/trophies/conmebol/sulamericana.png",
      },
    ],
    Brasil: [
      {
        name: "Brasileirão",
        logo: "/images/leagues/brasil/brasileirao.png",
        trophy: "/images/trophies/brasil/brasileirao.png",
      },
      {
        name: "Copa do Brasil",
        logo: "/images/leagues/brasil/copaDoBrasil.png",
        trophy: "/images/trophies/brasil/copaDoBrasil.png",
      },
    ],
  },
};
