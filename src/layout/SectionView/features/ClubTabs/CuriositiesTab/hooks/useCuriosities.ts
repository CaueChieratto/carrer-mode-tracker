import { useMemo } from "react";
import { Match } from "../../AllMatchesTab/types/Match";
import { Career } from "../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";

type OpponentGoal = {
  player?: string;
  minute?: string | number;
};

type OpponentAssist = {
  player?: string;
  goalReference?: string;
};

export const useCuriosities = (
  career: Career,
  season: ClubData,
  isGeralPage: boolean,
) => {
  const data = useMemo(() => {
    const matches: Match[] = isGeralPage
      ? career.clubData.flatMap((s) => s.matches || [])
      : season.matches || [];

    const finishedMatches = matches.filter((m) => m.status === "FINISHED");
    if (finishedMatches.length === 0) return { highlights: [], rankings: null };

    const playerMap = new Map<string, string>();
    const seasons = isGeralPage ? career.clubData : [season];
    seasons.forEach((s) => {
      s.players?.forEach((p) => playerMap.set(p.id, p.name));
    });

    const getPlayerName = (id?: string) => {
      if (!id) return "Desconhecido";
      return playerMap.get(id) || id;
    };

    let biggestWin = { diff: 0, text: "-" };
    let worstLoss = { diff: 0, text: "-" };
    let highestPossession = { val: 0, text: "-" };

    const opponentStats: Record<
      string,
      { wins: number; losses: number; games: number }
    > = {};
    const scoreFrequency: Record<string, number> = {};
    const opponentMatchGoals: Record<string, Set<string>> = {};

    let currentUnbeaten = 0;
    let maxUnbeaten = 0;
    let currentWinless = 0;
    let maxWinless = 0;

    let currentHomeUnbeaten = 0;
    let maxHomeUnbeaten = 0;

    let currentAwayUnbeaten = 0;
    let maxAwayUnbeaten = 0;

    let craziestMatch = { goals: 0, text: "-" };

    const teamGoalsMinute: Record<number, number> = {};
    const concededGoalsMinute: Record<number, number> = {};
    const opponentScorers: Record<string, number> = {};
    const teamDuos: Record<string, number> = {};
    const opponentDuos: Record<string, number> = {};
    const playerGoalMinutes: Record<string, number> = {};
    const playerAssistMinutes: Record<string, number> = {};

    finishedMatches.forEach((m, index) => {
      const isHome = m.homeTeam === career.clubName;
      const opponentName = isHome ? m.awayTeam : m.homeTeam;
      const myScore = isHome ? m.homeScore || 0 : m.awayScore || 0;
      const oppScore = isHome ? m.awayScore || 0 : m.homeScore || 0;
      const diff = myScore - oppScore;
      const scoreText = `${myScore}x${oppScore} vs ${opponentName}`;
      const totalGoals = myScore + oppScore;

      if (!opponentStats[opponentName]) {
        opponentStats[opponentName] = { wins: 0, losses: 0, games: 0 };
      }
      opponentStats[opponentName].games++;

      if (diff > 0) opponentStats[opponentName].wins++;
      if (diff < 0) opponentStats[opponentName].losses++;

      const scoreKey = `${myScore}x${oppScore}`;
      scoreFrequency[scoreKey] = (scoreFrequency[scoreKey] || 0) + 1;

      if (totalGoals > craziestMatch.goals) {
        craziestMatch = { goals: totalGoals, text: scoreText };
      }

      if (diff >= 0) {
        currentUnbeaten++;
        maxUnbeaten = Math.max(maxUnbeaten, currentUnbeaten);
      } else {
        currentUnbeaten = 0;
      }

      if (diff <= 0) {
        currentWinless++;
        maxWinless = Math.max(maxWinless, currentWinless);
      } else {
        currentWinless = 0;
      }

      if (isHome) {
        if (diff >= 0) {
          currentHomeUnbeaten++;
          maxHomeUnbeaten = Math.max(maxHomeUnbeaten, currentHomeUnbeaten);
        } else {
          currentHomeUnbeaten = 0;
        }
      } else {
        if (diff >= 0) {
          currentAwayUnbeaten++;
          maxAwayUnbeaten = Math.max(maxAwayUnbeaten, currentAwayUnbeaten);
        } else {
          currentAwayUnbeaten = 0;
        }
      }

      if (diff > biggestWin.diff) biggestWin = { diff, text: scoreText };
      if (diff < worstLoss.diff) worstLoss = { diff, text: scoreText };

      const myPossession = isHome
        ? m.homePossession || 0
        : m.awayPossession || 0;
      if (myPossession > highestPossession.val) {
        highestPossession = {
          val: myPossession,
          text: `${myPossession}% vs ${opponentName}`,
        };
      }

      m.playerStats?.forEach((p) => {
        const playerName = getPlayerName(p.playerId);

        p.goalMinutes?.forEach((min) => {
          teamGoalsMinute[min] = (teamGoalsMinute[min] || 0) + 1;
          const key = `${playerName} (${min}')`;
          playerGoalMinutes[key] = (playerGoalMinutes[key] || 0) + 1;
        });

        if (p.assistTargets?.length) {
          p.assistTargets.forEach((targetStr) => {
            const parts = targetStr.split(" - ");
            const targetName = parts[0]?.trim();
            const minStr = parts[1];
            const minute = minStr ? minStr.replace("'", "").trim() : "0";

            if (minute !== "0") {
              const key = `${playerName} (${minute}')`;
              playerAssistMinutes[key] = (playerAssistMinutes[key] || 0) + 1;
            }

            if (targetName) {
              const duoKey = `${targetName} (Ass: ${playerName})`;
              teamDuos[duoKey] = (teamDuos[duoKey] || 0) + 1;
            }
          });
        }
      });

      if (m.opponentEvents) {
        const events = Array.isArray(m.opponentEvents)
          ? m.opponentEvents[0]
          : m.opponentEvents;

        const matchId = String(index);

        if (events) {
          const oppGoals: OpponentGoal[] = events.goals || [];
          const oppAssists: OpponentAssist[] = events.assists || [];

          oppGoals.forEach((goal) => {
            if (goal.player) {
              opponentScorers[goal.player] =
                (opponentScorers[goal.player] || 0) + 1;

              if (!opponentMatchGoals[goal.player]) {
                opponentMatchGoals[goal.player] = new Set();
              }
              opponentMatchGoals[goal.player].add(matchId);
            }

            const minute = Number(goal.minute);

            if (!Number.isNaN(minute)) {
              concededGoalsMinute[minute] =
                (concededGoalsMinute[minute] || 0) + 1;
            }
          });

          oppAssists.forEach((assist) => {
            if (assist.player && assist.goalReference) {
              const scorerName = assist.goalReference.split(" - ")[0];
              if (scorerName) {
                const duoKey = `${scorerName.trim()} (Ass: ${assist.player})`;
                opponentDuos[duoKey] = (opponentDuos[duoKey] || 0) + 1;
              }
            }
          });
        }
      }
    });

    const favoriteOpponent = Object.entries(opponentStats).sort(
      (a, b) => b[1].wins - a[1].wins,
    )[0];

    const worstOpponent = Object.entries(opponentStats).sort(
      (a, b) => b[1].losses - a[1].losses,
    )[0];

    const getTopN = (record: Record<string | number, number>, n = 5) =>
      Object.entries(record)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([label, count]) => ({ label: String(label), count }));

    const reincidents = Object.entries(opponentMatchGoals)
      .map(([player, matches]) => ({ label: player, count: matches.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const highlights = [
      { label: "Massacre Histórico", value: biggestWin.text },
      { label: "Dia Para Esquecer", value: worstLoss.text },
      { label: "Donos da Bola (Maior Posse)", value: highestPossession.text },
      {
        label: "Adversário Favorito",
        value: favoriteOpponent
          ? `${favoriteOpponent[0]} (${favoriteOpponent[1].wins} vitórias)`
          : "-",
      },
      {
        label: "Pedra no Sapato",
        value: worstOpponent
          ? `${worstOpponent[0]} (${worstOpponent[1].losses} derrotas)`
          : "-",
      },
      { label: "Maior Série Invicta", value: `${maxUnbeaten} jogos` },
      { label: "Maior Jejum", value: `${maxWinless} jogos` },
      { label: "Jogo Mais Maluco", value: craziestMatch.text },
      {
        label: "Sequência invicta em casa",
        value: `${maxHomeUnbeaten} jogos`,
      },
      {
        label: "Sequência invicta fora",
        value: `${maxAwayUnbeaten} jogos`,
      },
    ].filter((h) => h.value !== "-" && h.value !== "0 jogos");

    return {
      highlights,
      rankings: {
        topScoringMinutes: getTopN(teamGoalsMinute),
        topConcedingMinutes: getTopN(concededGoalsMinute),
        topPlayerGoalMinutes: getTopN(playerGoalMinutes),
        topPlayerAssistMinutes: getTopN(playerAssistMinutes),
        topOpponentScorers: getTopN(opponentScorers),
        topTeamDuos: getTopN(teamDuos),
        topOpponentDuos: getTopN(opponentDuos),
        topReincidents: reincidents,
        topScores: getTopN(scoreFrequency),
        topOpponents: Object.entries(opponentStats)
          .sort((a, b) => b[1].games - a[1].games)
          .slice(0, 5)
          .map(([label, v]) => ({ label, count: v.games })),
      },
    };
  }, [career, season, isGeralPage]);

  return data;
};
