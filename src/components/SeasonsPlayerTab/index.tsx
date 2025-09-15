import { Career } from "../../common/interfaces/Career";
import { Players } from "../../common/interfaces/playersInfo/players";
// import { getContinentByCountry } from "../../common/services/GetContinentByCountry";

type SeasonsPlayerTabProps = {
  career: Career;
  player?: Players;
};

const SeasonsPlayerTab = ({ player, career }: SeasonsPlayerTabProps) => {
  // const playerId = player?.id;

  // const seasonsPlayerPlayed = career.clubData.filter((s) =>
  //   s.players.some((p) => p.id === playerId)
  // );

  // const playerDataPerSeason = seasonsPlayerPlayed.map((season) =>
  //   season.players.find((p) => p.id === playerId)
  // );

  // const getSeasonString = (seasonNumber: number): string => {
  //   const startYear =
  //     new Date(career.createdAt).getFullYear() + seasonNumber - 1;
  //   const continent = getContinentByCountry(career.nation);

  //   if (continent === "Europa") {
  //     const endYear = (startYear + 1).toString().slice(-2);
  //     return `${startYear.toString().slice(-2)}/${endYear}`;
  //   } else {
  //     return startYear.toString();
  //   }
  // };

  // const titlesBySeason = seasonsPlayerPlayed
  //   .map((season) => {
  //     const seasonStr = getSeasonString(season.seasonNumber);
  //     const trophiesWonInSeason = career.trophies
  //       .filter((trophy) => trophy.seasons.includes(seasonStr))
  //       .map((trophy) => ({ ...trophy, seasons: [seasonStr] }));
  //     return {
  //       seasonNumber: season.seasonNumber,
  //       trophies: trophiesWonInSeason,
  //     };
  //   })
  //   .filter((season) => season.trophies.length > 0);

  return (
    <div>
      {player?.name}
      {career.clubName}
    </div>
  );
};

export default SeasonsPlayerTab;
