import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../components/AllMatchesTab/types/Match";
import { MatchEvent, PeriodKey } from "../../types";

export const buildMatchEvents = (match: Match, season: ClubData) => {
  let mvpPlayerName = "Nenhum";
  let mvpRating = 0;

  const rawEvents: MatchEvent[] = [];
  const goalsList: {
    playerName: string;
    time: number;
    displayTime: string;
    sortTime: number;
  }[] = [];

  let mockTime = 10;

  const stoppage1 = match.stoppage1T || 0;
  const stoppage2 = match.stoppage2T || 0;
  const stoppageET1 = match.stoppageET1 || 0;
  const stoppageET2 = match.stoppageET2 || 0;

  const parseGoals = (minutes: number[]) => {
    const result: {
      time: number;
      period: PeriodKey;
      displayTime: string;
      sortTime: number;
    }[] = [];
    let currentPeriod: PeriodKey = "1T";
    let lastTime = -1;

    for (let i = 0; i < minutes.length; i++) {
      const t = minutes[i];

      if (t < lastTime) {
        if (currentPeriod === "1T") currentPeriod = "2T";
        else if (currentPeriod === "2T") currentPeriod = "1ET";
        else if (currentPeriod === "1ET") currentPeriod = "2ET";
      } else {
        if (currentPeriod === "1T" && t > 45 + stoppage1) currentPeriod = "2T";
        if (currentPeriod === "2T" && t > 90 + stoppage2) currentPeriod = "1ET";
        if (currentPeriod === "1ET" && t > 105 + stoppageET1)
          currentPeriod = "2ET";
      }

      let displayTime = `${t}'`;
      let sortTime = t;

      if (currentPeriod === "1T") {
        if (t > 45) displayTime = `45' +${t - 45}`;
        sortTime = t;
      } else if (currentPeriod === "2T") {
        if (t > 90) displayTime = `90' +${t - 90}`;
        sortTime = 100 + t;
      } else if (currentPeriod === "1ET") {
        if (t > 105) displayTime = `105' +${t - 105}`;
        sortTime = 200 + t;
      } else if (currentPeriod === "2ET") {
        if (t > 120) displayTime = `120' +${t - 120}`;
        sortTime = 300 + t;
      } else if (currentPeriod === "PEN") {
        sortTime = 400 + t;
      }

      result.push({ time: t, period: currentPeriod, displayTime, sortTime });
      lastTime = t;
    }
    return result;
  };

  const getEventDetails = (t: number) => {
    const displayTime = `${t}'`;
    let period: PeriodKey = "1T";
    let sortTime = t;

    if (t > 120) {
      period = "PEN";
      sortTime = 400 + t;
    } else if (t > 105) {
      period = "2ET";
      sortTime = 300 + t;
    } else if (t > 90) {
      period = "1ET";
      sortTime = 200 + t;
    } else if (t > 45) {
      period = "2T";
      sortTime = 100 + t;
    }

    return { period, displayTime, sortTime };
  };

  if (match.playerStats) {
    match.playerStats.forEach((stat) => {
      const player = season.players.find((p) => p.id === stat.playerId);
      if (!player) return;

      if (stat.rating > mvpRating) {
        mvpRating = stat.rating;
        mvpPlayerName = player.name;
      }

      // Adicionando Gols
      if (stat.goals > 0) {
        let goalMins = stat.goalMinutes || [];

        if (goalMins.length < stat.goals) {
          const mocked = [];
          for (let i = 0; i < stat.goals; i++) {
            if (goalMins[i]) mocked.push(goalMins[i]);
            else {
              mockTime = mockTime >= 85 ? 15 : mockTime + 15;
              mocked.push(mockTime);
            }
          }
          goalMins = mocked;
        }

        const parsedGoals = parseGoals(goalMins);

        parsedGoals.forEach((g, i) => {
          const targetString = `${player.name} - ${g.time}'`;
          let assistText: string | undefined = undefined;

          const assistStat = match.playerStats?.find((s) =>
            s.assistTargets?.includes(targetString),
          );

          if (assistStat) {
            const assister = season.players.find(
              (p) => p.id === assistStat.playerId,
            );
            if (assister) {
              assistText = assister.name;
            }
          }

          rawEvents.push({
            id: `goal-${stat.playerId}-${i}`,
            type: "goal",
            time: g.time,
            displayTime: g.displayTime,
            sortTime: g.sortTime,
            period: g.period,
            mainPlayer: player.name,
            secondaryPlayer: assistText,
          });
          goalsList.push({
            playerName: player.name,
            time: g.time,
            displayTime: g.displayTime,
            sortTime: g.sortTime,
          });
        });
      }

      // 1. Adicionando Cartão Amarelo (Primeiro Amarelo)
      if (stat.yellowCard) {
        const yMinute =
          stat.yellowCardMinute && stat.yellowCardMinute > 0
            ? stat.yellowCardMinute
            : (mockTime += 5);

        const { period, displayTime, sortTime } = getEventDetails(yMinute);

        rawEvents.push({
          id: `y-${stat.playerId}`,
          type: "yellow_card",
          time: yMinute,
          displayTime,
          sortTime,
          period,
          mainPlayer: player.name,
        });
      }

      // 2. Adicionando Segundo Cartão Amarelo (Expulsão)
      if (stat.secondYellowCard) {
        const syMinute =
          stat.secondYellowCardMinute && stat.secondYellowCardMinute > 0
            ? stat.secondYellowCardMinute
            : (mockTime += 5);

        const { period, displayTime, sortTime } = getEventDetails(syMinute);

        rawEvents.push({
          id: `2y-${stat.playerId}`,
          type: "second_yellow",
          time: syMinute,
          displayTime,
          sortTime,
          period,
          mainPlayer: player.name,
        });
      }

      // 3. Adicionando Cartão Vermelho Direto (Apenas se não for 2º Amarelo)
      if (stat.redCard && !stat.secondYellowCard) {
        const rMinute =
          stat.redCardMinute && stat.redCardMinute > 0
            ? stat.redCardMinute
            : (mockTime += 5);

        const { period, displayTime, sortTime } = getEventDetails(rMinute);

        rawEvents.push({
          id: `r-${stat.playerId}`,
          type: "red_card",
          time: rMinute,
          displayTime,
          sortTime,
          period,
          mainPlayer: player.name,
        });
      }

      // Adicionando Substituições
      if (stat.substituteIn && stat.substituteIn !== "Nenhum") {
        const isStarter = [
          match.lineup?.goalkeeper?.playerId,
          ...(match.lineup?.lines?.flat().map((s) => s.playerId) || []),
        ].includes(player.id);

        if (isStarter) {
          const subTime = stat.minutesPlayed || 45;
          const { period, displayTime, sortTime } = getEventDetails(subTime);

          rawEvents.push({
            id: `sub-${stat.playerId}`,
            type: "sub",
            time: subTime,
            displayTime,
            sortTime,
            period,
            mainPlayer: stat.substituteIn,
            secondaryPlayer: `Saiu: ${player.name}`,
          });
        }
      }
    });
  }

  const sortedEvents = [...rawEvents].sort((a, b) => b.sortTime - a.sortTime);

  const eventsByPeriod: Record<PeriodKey, MatchEvent[]> = {
    PEN: sortedEvents.filter((e) => e.period === "PEN"),
    "2ET": sortedEvents.filter((e) => e.period === "2ET"),
    "1ET": sortedEvents.filter((e) => e.period === "1ET"),
    "2T": sortedEvents.filter((e) => e.period === "2T"),
    "1T": sortedEvents.filter((e) => e.period === "1T"),
  };

  const periods: { key: PeriodKey; label: string; stoppage?: number }[] = [];
  if (eventsByPeriod["PEN"].length > 0)
    periods.push({ key: "PEN", label: "Pênaltis" });

  if (match.hasExtraTime || eventsByPeriod["2ET"].length > 0 || stoppageET2 > 0)
    periods.push({
      key: "2ET",
      label: "2º PR",
      stoppage: stoppageET2,
    });

  if (match.hasExtraTime || eventsByPeriod["1ET"].length > 0 || stoppageET1 > 0)
    periods.push({
      key: "1ET",
      label: "1º PR",
      stoppage: stoppageET1,
    });

  if (eventsByPeriod["2T"].length > 0 || stoppage2 > 0)
    periods.push({ key: "2T", label: "2º Tempo", stoppage: stoppage2 });

  if (eventsByPeriod["1T"].length > 0 || stoppage1 > 0)
    periods.push({ key: "1T", label: "1º Tempo", stoppage: stoppage1 });

  return {
    mvpPlayerName,
    mvpRating: mvpRating > 0 ? Number(mvpRating.toFixed(1)) : null,
    eventsByPeriod,
    periods,
    goalsList: goalsList.sort((a, b) => a.sortTime - b.sortTime),
  };
};
