import {
  LeagueLevels,
  leagueLevelsInSelect,
} from "../../constants/LeagueLevels";
import { Career } from "../../interfaces/Career";
import { ClubData } from "../../interfaces/club/clubData";
import { Trophy } from "../../interfaces/club/trophy";
import { Players } from "../../interfaces/playersInfo/players";
import { LeagueStats } from "../../interfaces/playersStats/leagueStats";
import { POSITION_DATA } from "../../types/Positions";
import { calculateTotalStats } from "../PlayerStatsCalculator";

export const sortTrophies = (trophies: Career["trophies"]) => {
  return [...trophies].sort((a, b) => {
    const diffSeasons = b.seasons.length - a.seasons.length;
    if (diffSeasons !== 0) return diffSeasons;

    const levelA = LeagueLevels[a.leagueName] ?? 9999;
    const levelB = LeagueLevels[b.leagueName] ?? 9999;

    return levelA - levelB;
  });
};

export const sortedPlayers = (players: Players[]) => {
  return [...players].sort((a, b) => {
    if (b.ballonDor !== a.ballonDor) {
      return b.ballonDor - a.ballonDor;
    }

    const statsA = calculateTotalStats(a);
    const statsB = calculateTotalStats(b);

    if (statsB.goals !== statsA.goals) {
      return statsB.goals - statsA.goals;
    }
    if (statsB.assists !== statsA.assists) {
      return statsB.assists - statsA.assists;
    }
    if (statsB.cleanSheets !== statsA.cleanSheets) {
      return statsB.cleanSheets - statsA.cleanSheets;
    }

    return statsB.games - statsA.games;
  });
};

export const sortPlayersByContributions = (players: Players[]) => {
  return [...players].sort((a, b) => {
    if (b.ballonDor !== a.ballonDor) {
      return b.ballonDor - a.ballonDor;
    }

    const statsA = calculateTotalStats(a);
    const statsB = calculateTotalStats(b);

    let scoreA = 0;
    let scoreB = 0;

    if (a.position === "GOL") {
      scoreA = (statsA.cleanSheets || 0) * 0.8 + (statsA.assists || 0);
    } else {
      scoreA = (statsA.goals || 0) + (statsA.assists || 0);
    }

    if (b.position === "GOL") {
      scoreB = (statsB.cleanSheets || 0) * 0.8 + (statsB.assists || 0);
    } else {
      scoreB = (statsB.goals || 0) + (statsB.assists || 0);
    }

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    return (statsB.games || 0) - (statsA.games || 0);
  });
};

export const sortPlayersByPosition = (players: Players[]) => {
  const positionSortOrder = POSITION_DATA.slice().flatMap(
    (group) => group.sortOrder
  );

  return [...players].sort((a, b) => {
    const positionA = positionSortOrder.indexOf(a.position as string);
    const positionB = positionSortOrder.indexOf(b.position as string);
    if (positionA === -1) return 1;
    if (positionB === -1) return -1;
    return positionA - positionB;
  });
};

export const sortPlayersWithStatsByPosition = (players: Players[]) => {
  return [...players].sort((a, b) => {
    const getIndices = (position: string) => {
      for (
        let groupIndex = 0;
        groupIndex < POSITION_DATA.length;
        groupIndex++
      ) {
        const group = POSITION_DATA[groupIndex];
        const positionIndex =
          group.sortOrder?.indexOf(position) ??
          (group.positions.includes(position) ? 0 : -1);
        if (positionIndex !== -1) {
          return { groupIndex, positionIndex };
        }
      }
      return { groupIndex: 99, positionIndex: 99 };
    };

    const aInfo = getIndices(a.position as string);
    const bInfo = getIndices(b.position as string);

    if (aInfo.groupIndex !== bInfo.groupIndex) {
      return aInfo.groupIndex - bInfo.groupIndex;
    }

    return aInfo.positionIndex - bInfo.positionIndex;
  });
};

export const sortTrophySeasons = (seasons: Trophy["seasons"]) => {
  return [...seasons].sort((a, b) => {
    const yearA = parseInt(a.split("/")[0], 10);
    const yearB = parseInt(b.split("/")[0], 10);
    return yearA - yearB;
  });
};

export const sortSeasonsByNumber = (seasons: ClubData[]) => {
  return [...seasons].sort((a, b) => a.seasonNumber - b.seasonNumber);
};

export const sortPlayersByPositionWithinGroup = (
  players: Players[],
  sortOrder: string[]
) => {
  return [...players].sort((a, b) => {
    const indexA = sortOrder.indexOf(a.position as string);
    const indexB = sortOrder.indexOf(b.position as string);
    return indexA - indexB;
  });
};

export const sortTransfersByValue = (
  players: Players[],
  type: "arrivals" | "exit"
) => {
  const isArrival = type === "arrivals";

  return [...players].sort((a, b) => {
    const contractA = a.contract[a.contract.length - 1];
    const contractB = b.contract[b.contract.length - 1];

    const valueA = isArrival ? contractA.buyValue : contractA.sellValue;
    const valueB = isArrival ? contractB.buyValue : contractB.sellValue;

    const numValueA = typeof valueA === "number" ? valueA : 0;
    const numValueB = typeof valueB === "number" ? valueB : 0;

    if (numValueB !== numValueA) {
      return numValueB - numValueA;
    }

    const dateA = isArrival ? contractA.dataArrival : contractA.dataExit;
    const dateB = isArrival ? contractB.dataArrival : contractB.dataExit;

    const timeA = dateA ? new Date(dateA).getTime() : 0;
    const timeB = dateB ? new Date(dateB).getTime() : 0;

    return timeB - timeA;
  });
};

export const sortLeaguesByLevel = (leagues: LeagueStats[]) => {
  return [...leagues].sort((a, b) => {
    const levelA = LeagueLevels[a.leagueName] ?? 999;
    const levelB = LeagueLevels[b.leagueName] ?? 999;
    return levelA - levelB;
  });
};

export const sortLeaguesForSelect = (leagueNames: string[]) => {
  return [...leagueNames].sort((a, b) => {
    const levelA = leagueLevelsInSelect[a] ?? 999;
    const levelB = leagueLevelsInSelect[b] ?? 999;
    return levelA - levelB;
  });
};
