import { useMemo } from "react";
import { AcademyPlayers } from "../../../../interfaces/AcademyPlayers/AcademyPlayers";
import { AcademyTournaments } from "../../../../interfaces/AcademyTournaments/AcademyTournaments";
import { isEuropeanSeason } from "../../../../utils/isEuropeanSeason";
import { Career } from "../../../../../../../../common/interfaces/Career";
import { extractDateInfo } from "../../helpers/extractDateInfo";
import { formatFeedText } from "../../helpers/formatFeedText";
import { FeedEvent } from "../../types/FeedEvent";

export const useAcademyFeed = (
  career: Career,
  players: AcademyPlayers[],
  tournaments: AcademyTournaments[],
) => {
  return useMemo(() => {
    const feed: FeedEvent[] = [];
    const isEurope = isEuropeanSeason(career);
    const academyNickname = career.academy!.nickname;
    const academyName = career.academy!.name;

    players.forEach((player) => {
      player.evolutionHistory?.forEach((history) => {
        const { day, monthWeight, formattedDate } = extractDateInfo(
          history.date,
          isEurope,
        );
        const type = history.changedAttribute || "default";
        const { professional, social } = formatFeedText(
          type,
          history.description,
          academyNickname,
          academyName,
        );

        feed.push({
          id: history.id,
          type,
          title: player.name,
          subtitle: professional,
          socialSubtitle: social,
          time: formattedDate,
          monthWeight,
          day,
          details: {
            oldValue: history.oldValue,
            newValue: history.newValue,
          },
        });
      });
    });

    tournaments.forEach((tourn) => {
      const finishedMatches =
        tourn.matches?.filter((m) => m.result === "FINISHED") || [];
      const lastMatchId =
        finishedMatches.length > 0
          ? finishedMatches[finishedMatches.length - 1].id
          : null;

      if (tourn.isFinished && finishedMatches.length === 0) {
        const { day, monthWeight, formattedDate } = extractDateInfo(
          tourn.date,
          isEurope,
        );
        const isChampion = tourn.isChampion;
        feed.push({
          id: `${tourn.id}-result`,
          type: "tournament",
          title: tourn.name,
          subtitle: isChampion
            ? "Conclusão de torneio: Campeão"
            : `Conclusão de torneio: ${tourn.tournamentResult}.`,
          socialSubtitle: isChampion
            ? "🏆 CAMPEÃO! Conquistou o título do torneio!"
            : `🏆 Fim de torneio: ${tourn.tournamentResult}.`,
          time: formattedDate,
          monthWeight,
          day,
          details: {
            tournamentResult: tourn.tournamentResult,
          },
        });
      }

      finishedMatches.forEach((match) => {
        const { day, monthWeight, formattedDate } = extractDateInfo(
          match.date,
          isEurope,
        );
        const userG = Number(match.userGoals) || 0;
        const oppG = Number(match.opponentGoals) || 0;

        let profResult = "Empate";
        let socialResult = "🤝 Empate";

        if (userG > oppG) {
          profResult = "Vitória";
          socialResult = "🔥 Vitória incrível!";
        } else if (userG < oppG) {
          profResult = "Derrota";
          socialResult = "🔻 Derrota";
        }

        const isDecisiveMatch = tourn.isFinished && match.id === lastMatchId;
        const tournResult = tourn.isChampion
          ? "Campeão"
          : tourn.tournamentResult;

        let subtitle = `${profResult} — ${userG} x ${oppG} vs ${match.opponentTeam}`;
        let socialSubtitle = `${socialResult} ${userG} x ${oppG} vs ${match.opponentTeam}!`;

        if (isDecisiveMatch) {
          subtitle += ` (${tournResult})`;
          socialSubtitle += ` 🏆 ${tournResult}!`;
        }

        feed.push({
          id: match.id,
          type: "match",
          title: tourn.name,
          subtitle: subtitle,
          socialSubtitle: socialSubtitle,
          time: formattedDate,
          monthWeight,
          day,
          details: {
            opponentTeam: match.opponentTeam,
            userGoals: userG,
            opponentGoals: oppG,
            lineup: match.lineup,
            tournamentResult: isDecisiveMatch ? tournResult : undefined,
          },
        });
      });
    });

    return feed.sort((a, b) => {
      if (a.monthWeight !== b.monthWeight) {
        return b.monthWeight - a.monthWeight;
      }
      return b.day - a.day;
    });
  }, [career, players, tournaments]);
};
