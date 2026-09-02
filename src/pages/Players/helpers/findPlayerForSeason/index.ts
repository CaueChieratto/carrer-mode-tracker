import type { CareerPlayer } from "../../types";
import type { FindPlayerForSeasonParams } from "../../types";
import { matchesPlayerIdentity } from "../matchesPlayerIdentity";

export const findPlayerForSeason = ({
  actualSeason,
  career,
  groupCareers,
  isFromGroup,
  playerId,
  season,
}: FindPlayerForSeasonParams): CareerPlayer | undefined => {
  let player = actualSeason?.players.find((item) => item.id === playerId);

  if (!player && career) {
    const referencePlayer = career.clubData
      .flatMap((item) => item.players)
      .find((item) => item.id === playerId);

    if (referencePlayer && actualSeason) {
      player = actualSeason.players.find((item) =>
        matchesPlayerIdentity(item, referencePlayer),
      );

      if (!player) {
        player = referencePlayer;
      }
    }
  }

  if (!player && season) {
    player = season.players.find((item) => item.id === playerId);
  }

  if (!player && isFromGroup) {
    player = groupCareers
      .flatMap((item) =>
        item.clubData.flatMap((clubSeason) => clubSeason.players),
      )
      .find((item) => item.id === playerId);
  }

  return player;
};
