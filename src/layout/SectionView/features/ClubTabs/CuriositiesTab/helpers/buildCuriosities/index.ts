import { Match } from "../../../AllMatchesTab/types/Match";
import { CuriositiesData, OpponentAssist, OpponentGoal } from "../../types";

export const buildCuriosities = (
  finishedMatches: Match[],
  clubName: string,
  getPlayerName: (id?: string) => string,
): CuriositiesData => {
  if (finishedMatches.length === 0) return { highlights: [], rankings: null };

  let biggestWin = { diff: 0, text: "-" };
  let worstLoss = { diff: 0, text: "-" };
  let highestPossession = { val: 0, text: "-" };

  const opponentStats: Record<
    string,
    { wins: number; losses: number; games: number }
  > = {};
  const scoreFrequency: Record<string, number> = {};
  const scoreFrequencyWhenScoring: Record<string, number> = {};
  const opponentMatchGoals: Record<string, Set<string>> = {};

  let currentUnbeaten = 0,
    maxUnbeaten = 0;
  let currentWinless = 0,
    maxWinless = 0;
  let currentHomeUnbeaten = 0,
    maxHomeUnbeaten = 0;
  let currentAwayUnbeaten = 0,
    maxAwayUnbeaten = 0;
  let currentWinStreak = 0,
    maxWinStreak = 0;

  let currentScoringStreak = 0,
    maxScoringStreak = 0;
  let currentCleanSheetStreak = 0,
    maxCleanSheetStreak = 0;
  let currentConcedingStreak = 0,
    maxConcedingStreak = 0;

  let fastestGoal = { min: 999, player: "", text: "-" };
  let latestGoal = { min: 0, player: "", text: "-" };
  let latestWinGoal = { min: 0, text: "-" };
  let latestDrawGoal = { min: 0, text: "-" };

  let goalsFirstHalf = 0,
    goalsSecondHalf = 0;
  let craziestMatch = { goals: 0, text: "-" };

  let unbeatenWhenScoringFirstCount = 0;
  let scoredFirstGamesCount = 0;
  let comebackWinsCount = 0;
  let precisionMatchesCount = 0;
  let explosiveMatchesCount = 0;
  let blankMatchesCount = 0;
  let overwhelmingStartsCount = 0;
  let dramaticEndsCount = 0;

  let biggestComebackWin = { deficit: 0, text: "-" };
  let biggestComebackLoss = { lead: 0, text: "-" };

  const opponentGoalsScored: Record<string, number> = {};
  const drawsByOpponent: Record<string, number> = {};
  const opponentTeamsScorers: Record<string, number> = {};
  const punchingBagDiffs: Record<string, number> = {};
  const teamGoalsMinute: Record<number, number> = {};
  const concededGoalsMinute: Record<number, number> = {};
  const opponentScorers: Record<string, number> = {};
  const teamDuos: Record<string, number> = {};
  const opponentDuos: Record<string, number> = {};
  const playerGoalMinutes: Record<string, number> = {};
  const playerAssistMinutes: Record<string, number> = {};

  const decisivePlayers: Record<string, number> = {};
  const openerPlayers: Record<string, number> = {};
  const winAssistants: Record<string, number> = {};
  const stoppageTimeExperts: Record<string, number> = {};
  const dangerousIntervals: Record<string, number> = {};

  const getInterval = (min: number) => {
    if (min <= 15) return "0-15'";
    if (min <= 30) return "16-30'";
    if (min <= 45) return "31-45'";
    if (min <= 60) return "46-60'";
    if (min <= 75) return "61-75'";
    return "76-90+'";
  };

  finishedMatches.forEach((m, index) => {
    const isHome = m.homeTeam === clubName;
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
    if (myScore > 0) {
      scoreFrequencyWhenScoring[scoreKey] =
        (scoreFrequencyWhenScoring[scoreKey] || 0) + 1;
    }

    if (totalGoals > craziestMatch.goals) {
      craziestMatch = { goals: totalGoals, text: scoreText };
    }

    if (diff >= 0) {
      currentUnbeaten++;
      maxUnbeaten = Math.max(maxUnbeaten, currentUnbeaten);
    } else currentUnbeaten = 0;
    if (diff <= 0) {
      currentWinless++;
      maxWinless = Math.max(maxWinless, currentWinless);
    } else currentWinless = 0;
    if (diff > 0) {
      currentWinStreak++;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else currentWinStreak = 0;

    if (isHome) {
      if (diff >= 0) {
        currentHomeUnbeaten++;
        maxHomeUnbeaten = Math.max(maxHomeUnbeaten, currentHomeUnbeaten);
      } else currentHomeUnbeaten = 0;
    } else {
      if (diff >= 0) {
        currentAwayUnbeaten++;
        maxAwayUnbeaten = Math.max(maxAwayUnbeaten, currentAwayUnbeaten);
      } else currentAwayUnbeaten = 0;
    }

    if (myScore > 0) {
      currentScoringStreak++;
      maxScoringStreak = Math.max(maxScoringStreak, currentScoringStreak);
    } else currentScoringStreak = 0;
    if (oppScore === 0) {
      currentCleanSheetStreak++;
      maxCleanSheetStreak = Math.max(
        maxCleanSheetStreak,
        currentCleanSheetStreak,
      );
    } else currentCleanSheetStreak = 0;
    if (oppScore > 0) {
      currentConcedingStreak++;
      maxConcedingStreak = Math.max(maxConcedingStreak, currentConcedingStreak);
    } else currentConcedingStreak = 0;

    if (myScore >= 3) explosiveMatchesCount++;
    if (myScore === 0) blankMatchesCount++;

    opponentGoalsScored[opponentName] =
      (opponentGoalsScored[opponentName] || 0) + myScore;
    opponentTeamsScorers[opponentName] =
      (opponentTeamsScorers[opponentName] || 0) + oppScore;
    if (diff > 0)
      punchingBagDiffs[opponentName] =
        (punchingBagDiffs[opponentName] || 0) + diff;
    if (diff === 0)
      drawsByOpponent[opponentName] = (drawsByOpponent[opponentName] || 0) + 1;

    if (diff > biggestWin.diff) biggestWin = { diff, text: scoreText };
    if (diff < worstLoss.diff) worstLoss = { diff, text: scoreText };

    const myPossession = isHome ? m.homePossession || 0 : m.awayPossession || 0;
    if (myPossession > highestPossession.val) {
      highestPossession = {
        val: myPossession,
        text: `${myPossession}% vs ${opponentName}`,
      };
    }

    const matchTimeline: {
      minute: number;
      isMine: boolean;
      player: string;
      strMin: string;
    }[] = [];
    let matchGoals1H = 0;
    let matchGoals2H = 0;
    let hasOverwhelmingStart = false;
    let hasDramaticEnd = false;

    m.playerStats?.forEach((p) => {
      const playerName = getPlayerName(p.playerId);
      p.goalMinutes?.forEach((min) => {
        const strMinute = String(min);
        const minNumber = Number(strMinute.replace(/[^0-9]/g, ""));

        if (!Number.isNaN(minNumber)) {
          matchTimeline.push({
            minute: minNumber,
            isMine: true,
            player: playerName,
            strMin: strMinute,
          });

          if (minNumber <= 45) {
            goalsFirstHalf++;
            matchGoals1H++;
          } else {
            goalsSecondHalf++;
            matchGoals2H++;
          }

          if (minNumber <= 15) hasOverwhelmingStart = true;

          if (strMinute.includes("90+") || minNumber >= 90) {
            stoppageTimeExperts[playerName] =
              (stoppageTimeExperts[playerName] || 0) + 1;
          }

          if (minNumber < fastestGoal.min)
            fastestGoal = {
              min: minNumber,
              player: playerName,
              text: `${playerName} aos ${strMinute}' vs ${opponentName}`,
            };

          if (minNumber > latestGoal.min)
            latestGoal = {
              min: minNumber,
              player: playerName,
              text: `${playerName} aos ${strMinute}' vs ${opponentName}`,
            };

          teamGoalsMinute[minNumber] = (teamGoalsMinute[minNumber] || 0) + 1;
        }

        const key = `${playerName} (${strMinute}')`;
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
          if (diff > 0) {
            winAssistants[playerName] = (winAssistants[playerName] || 0) + 1;
          }
        });
      }
    });

    if (m.opponentEvents) {
      const events = Array.isArray(m.opponentEvents)
        ? m.opponentEvents[0]
        : m.opponentEvents;
      if (events) {
        const oppGoals: OpponentGoal[] = events.goals || [];
        const oppAssists: OpponentAssist[] = events.assists || [];

        oppGoals.forEach((goal) => {
          if (goal.player) {
            opponentScorers[goal.player] =
              (opponentScorers[goal.player] || 0) + 1;
            if (!opponentMatchGoals[goal.player])
              opponentMatchGoals[goal.player] = new Set();
            opponentMatchGoals[goal.player].add(String(index));
          }
          const minNumber = Number(String(goal.minute).replace(/[^0-9]/g, ""));
          if (!Number.isNaN(minNumber)) {
            matchTimeline.push({
              minute: minNumber,
              isMine: false,
              player: goal.player || "Desconhecido",
              strMin: String(goal.minute),
            });
            concededGoalsMinute[minNumber] =
              (concededGoalsMinute[minNumber] || 0) + 1;

            const interval = getInterval(minNumber);
            dangerousIntervals[interval] =
              (dangerousIntervals[interval] || 0) + 1;

            if (minNumber >= 75) hasDramaticEnd = true;
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

    matchTimeline.sort((a, b) => a.minute - b.minute);

    if (matchGoals1H > 0 && matchGoals2H > 0) precisionMatchesCount++;
    if (hasOverwhelmingStart) overwhelmingStartsCount++;
    if (hasDramaticEnd) dramaticEndsCount++;

    if (matchTimeline.length > 0) {
      const firstEvent = matchTimeline[0];
      let myCurrent = 0,
        oppCurrent = 0;
      let maxDeficit = 0,
        maxLead = 0;
      let wasLosing = false;

      if (firstEvent.isMine) {
        scoredFirstGamesCount++;
        if (diff >= 0) unbeatenWhenScoringFirstCount++;
        openerPlayers[firstEvent.player] =
          (openerPlayers[firstEvent.player] || 0) + 1;
      }

      matchTimeline.forEach((ev) => {
        if (ev.isMine) myCurrent++;
        else oppCurrent++;

        const currentDeficit = oppCurrent - myCurrent;
        if (currentDeficit > maxDeficit) maxDeficit = currentDeficit;
        if (-currentDeficit > maxLead) maxLead = -currentDeficit;
        if (currentDeficit > 0) wasLosing = true;
      });

      if (diff > 0 && wasLosing) comebackWinsCount++;

      if (diff > 0 && maxDeficit > biggestComebackWin.deficit) {
        biggestComebackWin = {
          deficit: maxDeficit,
          text: `${scoreText} (saiu perdendo por ${maxDeficit})`,
        };
      }
      if (diff < 0 && maxLead > biggestComebackLoss.lead) {
        biggestComebackLoss = {
          lead: maxLead,
          text: `${scoreText} (chegou a ganhar por ${maxLead})`,
        };
      }

      if (diff > 0) {
        const winningGoalIndex = oppScore;
        const myTimelineGoals = matchTimeline.filter((e) => e.isMine);
        if (myTimelineGoals[winningGoalIndex]) {
          const g = myTimelineGoals[winningGoalIndex];
          decisivePlayers[g.player] = (decisivePlayers[g.player] || 0) + 1;
          if (g.minute > latestWinGoal.min) {
            latestWinGoal = {
              min: g.minute,
              text: `${g.player} aos ${g.strMin}' vs ${opponentName}`,
            };
          }
        }
      }

      if (diff === 0 && myScore > 0) {
        const myTimelineGoals = matchTimeline.filter((e) => e.isMine);
        const lastGoal = myTimelineGoals[myTimelineGoals.length - 1];
        if (lastGoal && lastGoal.minute > latestDrawGoal.min) {
          latestDrawGoal = {
            min: lastGoal.minute,
            text: `${lastGoal.player} aos ${lastGoal.strMin}' vs ${opponentName}`,
          };
        }
      }
    }
  });

  const getTopN = (record: Record<string | number, number>, n = 5) =>
    Object.entries(record)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([label, count]) => ({ label: String(label), count }));

  const mostDrawnOpponent = Object.entries(drawsByOpponent).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const favoriteOpponent = Object.entries(opponentStats).sort(
    (a, b) => b[1].wins - a[1].wins,
  )[0];
  const worstOpponent = Object.entries(opponentStats).sort(
    (a, b) => b[1].losses - a[1].losses,
  )[0];

  const reincidents = Object.entries(opponentMatchGoals)
    .map(([player, matches]) => ({ label: player, count: matches.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const highlights = [
    { label: "🏆 Maior Sequência de Vitórias", value: `${maxWinStreak} jogos` },
    { label: "🛡️ Maior Série Invicta", value: `${maxUnbeaten} jogos` },
    {
      label: "⚽ Maior Sequência Marcando",
      value: `${maxScoringStreak} jogos`,
    },
    {
      label: "🥅 Sequência Sem Sofrer Gols",
      value: `${maxCleanSheetStreak} jogos`,
    },
    {
      label: "⚠️ Sequência Sofrendo Gols",
      value: `${maxConcedingStreak} jogos`,
    },

    ...(fastestGoal.min !== 999
      ? [{ label: "⚡ Gol Relâmpago", value: fastestGoal.text }]
      : []),
    ...(latestWinGoal.min !== 0
      ? [{ label: "🏆 Vitória Mais Tardia", value: latestWinGoal.text }]
      : []),
    ...(latestDrawGoal.min !== 0
      ? [{ label: "🤝 Empate Salvo no Fim", value: latestDrawGoal.text }]
      : []),
    ...(biggestComebackWin.deficit > 0
      ? [
          {
            label: "🔄 Maior Virada Conquistada",
            value: biggestComebackWin.text,
          },
        ]
      : []),
    ...(biggestComebackLoss.lead > 0
      ? [{ label: "💔 Maior Virada Sofrida", value: biggestComebackLoss.text }]
      : []),

    {
      label: "⏱️ Faro de Gol (Tempos)",
      value: `${goalsFirstHalf} no 1ºT | ${goalsSecondHalf} no 2ºT`,
    },
    {
      label: "💚 Adversário Favorito",
      value: favoriteOpponent
        ? `${favoriteOpponent[0]} (${favoriteOpponent[1].wins} vitórias)`
        : "-",
    },
    {
      label: "👟 Pedra no Sapato",
      value: worstOpponent
        ? `${worstOpponent[0]} (${worstOpponent[1].losses} derrotas)`
        : "-",
    },
    {
      label: "🤝 Rei do Empate",
      value:
        mostDrawnOpponent && mostDrawnOpponent[1] > 0
          ? `${mostDrawnOpponent[0]} (${mostDrawnOpponent[1]} empates)`
          : "-",
    },
    {
      label: "🔥 Invicto Quando Marca Primeiro",
      value:
        scoredFirstGamesCount > 0
          ? `${unbeatenWhenScoringFirstCount} jogos sem perder (${scoredFirstGamesCount} abrindo placar)`
          : "-",
    },
    {
      label: "⚡ Virador Oficial",
      value:
        comebackWinsCount > 0
          ? `${comebackWinsCount} vitórias após sair perdendo`
          : "-",
    },
    {
      label: "🎯 Precisão",
      value:
        precisionMatchesCount > 0
          ? `Marcou nos 2 tempos em ${precisionMatchesCount} partidas`
          : "-",
    },
    {
      label: "💥 Explosão Ofensiva",
      value:
        explosiveMatchesCount > 0
          ? `${explosiveMatchesCount} jogos com 3+ gols`
          : "-",
    },
    {
      label: "🚫 Dia Sem Inspiração",
      value:
        blankMatchesCount > 0
          ? `Passou em branco em ${blankMatchesCount} jogos`
          : "-",
    },
    {
      label: "🚀 Começo Avassalador",
      value:
        overwhelmingStartsCount > 0
          ? `Gol nos primeiros 15' em ${overwhelmingStartsCount} jogos`
          : "-",
    },
    {
      label: "😱 Final Dramático",
      value:
        dramaticEndsCount > 0
          ? `Sofreu gols após 75' em ${dramaticEndsCount} jogos`
          : "-",
    },

    { label: "💪 Massacre Histórico", value: biggestWin.text },
    { label: "🎢 Jogo Mais Maluco", value: craziestMatch.text },
    { label: "📊 Maior Posse de Bola", value: highestPossession.text },
  ].filter(
    (h) =>
      h.value !== "-" &&
      h.value !== "0 jogos" &&
      h.value !== "0 no 1ºT | 0 no 2ºT",
  );

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
      topVictims: getTopN(opponentGoalsScored),
      topPunchingBags: getTopN(punchingBagDiffs),
      topOpponentTeamsScorers: getTopN(opponentTeamsScorers),

      topDecisivePlayers: getTopN(decisivePlayers),
      topOpeners: getTopN(openerPlayers),
      topWinAssistants: getTopN(winAssistants),
      topStoppageTimeExperts: getTopN(stoppageTimeExperts),
      dangerousIntervals: getTopN(dangerousIntervals),
    },
  };
};
