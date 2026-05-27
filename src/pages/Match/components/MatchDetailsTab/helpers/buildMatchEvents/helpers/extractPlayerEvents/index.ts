import { ClubData } from "../../../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { GoalListItem, MatchEvent } from "../../../../types";
import { getEventDetails, parseGoals } from "../timeUtils";

export const extractPlayerEvents = (match: Match, season: ClubData) => {
  const events: MatchEvent[] = [];
  const goals: GoalListItem[] = [];
  let mockTime = 10;

  if (!match.playerStats) return { events, goals };

  match.playerStats.forEach((stat) => {
    const player = season.players.find((p) => p.id === stat.playerId);
    if (!player) return;

    if (stat.goals > 0) {
      let goalMins = stat.goalMinutes || [];

      if (goalMins.length < stat.goals) {
        const mocked = [];
        for (let i = 0; i < stat.goals; i++) {
          if (goalMins[i]) {
            mocked.push(goalMins[i]);
          } else {
            mockTime = mockTime >= 85 ? 15 : mockTime + 15;
            mocked.push(mockTime);
          }
        }
        goalMins = mocked;
      }

      const parsedGoals = parseGoals(goalMins, match);

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
          if (assister) assistText = assister.name;
        }

        events.push({
          id: `goal-${stat.playerId}-${i}`,
          type: "goal",
          time: g.time,
          displayTime: g.displayTime,
          sortTime: g.sortTime,
          period: g.period,
          mainPlayer: player.name,
          secondaryPlayer: assistText,
        });

        goals.push({
          playerName: player.name,
          time: g.time,
          displayTime: g.displayTime,
          sortTime: g.sortTime,
        });
      });
    }

    if (stat.yellowCard) {
      const yMinute =
        stat.yellowCardMinute && stat.yellowCardMinute > 0
          ? stat.yellowCardMinute
          : (mockTime += 5);
      const { period, displayTime, sortTime } = getEventDetails(yMinute, match);
      events.push({
        id: `y-${stat.playerId}`,
        type: "yellow_card",
        time: yMinute,
        displayTime,
        sortTime,
        period,
        mainPlayer: player.name,
      });
    }

    if (stat.secondYellowCard) {
      const syMinute =
        stat.secondYellowCardMinute && stat.secondYellowCardMinute > 0
          ? stat.secondYellowCardMinute
          : (mockTime += 5);
      const { period, displayTime, sortTime } = getEventDetails(
        syMinute,
        match,
      );
      events.push({
        id: `2y-${stat.playerId}`,
        type: "second_yellow",
        time: syMinute,
        displayTime,
        sortTime,
        period,
        mainPlayer: player.name,
      });
    }

    if (stat.redCard && !stat.secondYellowCard) {
      const rMinute =
        stat.redCardMinute && stat.redCardMinute > 0
          ? stat.redCardMinute
          : (mockTime += 5);
      const { period, displayTime, sortTime } = getEventDetails(rMinute, match);
      events.push({
        id: `r-${stat.playerId}`,
        type: "red_card",
        time: rMinute,
        displayTime,
        sortTime,
        period,
        mainPlayer: player.name,
      });
    }

    if (stat.substituteIn && stat.substituteIn !== "Nenhum") {
      const isStarter = [
        match.lineup?.goalkeeper?.playerId,
        ...(match.lineup?.lines?.flat().map((s) => s.playerId) || []),
      ].includes(player.id);

      if (isStarter) {
        const subTime = stat.minutesPlayed || 45;
        const { period, displayTime, sortTime } = getEventDetails(
          subTime,
          match,
        );
        events.push({
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

  return { events, goals };
};
