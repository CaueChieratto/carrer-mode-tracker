import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useForm } from "../../../common/hooks/UseForm";
import { useMatchData } from "../../Match/hooks/useMatchData";
import { ServiceMatches } from "../../AddMatches/services/ServiceMatches";
import { AddDetailsFormFields } from "../constants/FormFields";
import { Match } from "../../../components/AllMatchesTab/types/Match";

type MatchEventItem = {
  id: string;
  name: string;
  type: "goal" | "assist" | "card" | "sub";
  color?: string;
};

export const useAddDetails = () => {
  const { career, season, match, loading, backMatch } = useMatchData();
  const [isSaving, setIsSaving] = useState(false);

  const {
    formValues,
    setFormValues,
    booleanValues,
    handleInputChange,
    handleBooleanChange,
  } = useForm();

  const initializedMatchId = useRef<string | null>(null);

  const matchEvents = useMemo(() => {
    if (!match?.playerStats || !season?.players) return [];

    const events: MatchEventItem[] = [];

    match.playerStats.forEach((stat) => {
      const p = season.players.find((player) => player.id === stat.playerId);
      if (!p) return;

      const isStarter = [
        match.lineup?.goalkeeper?.playerId,
        ...(match.lineup?.lines?.flat().map((s) => s.playerId) || []),
      ].includes(stat.playerId);

      for (let i = 0; i < stat.goals; i++) {
        events.push({
          id: `goal_${stat.playerId}_${i}`,
          name: `Gol: ${p.name}`,
          type: "goal",
        });
      }

      for (let i = 0; i < (stat.assists || 0); i++) {
        events.push({
          id: `assist_${stat.playerId}_${i}`,
          name: `Assist: ${p.name}`,
          type: "assist",
        });
      }

      if (stat.yellowCard) {
        events.push({
          id: `yellow_${stat.playerId}`,
          name: `Amarelo: ${p.name}`,
          type: "card",
          color: "yellow",
        });
      }

      if (stat.redCard) {
        events.push({
          id: `red_${stat.playerId}`,
          name: `Vermelho: ${p.name}`,
          type: "card",
          color: "red",
        });
      }

      if (isStarter && stat.substituteIn && stat.substituteIn !== "Nenhum") {
        events.push({
          id: `sub_${stat.playerId}`,
          name: `Sub: ${p.name}`,
          type: "sub",
        });
      }
    });

    return events;
  }, [match, season]);

  useEffect(() => {
    if (match && career && initializedMatchId.current !== match.matchesId) {
      const totalUserTeamGoals =
        match.playerStats?.reduce((acc, stat) => acc + (stat.goals || 0), 0) ||
        0;

      const isUserHome = match.homeTeam === career.clubName;

      const initial: Record<string, string> = {
        homeScore: isUserHome
          ? String(totalUserTeamGoals)
          : String(match.homeScore || 0),
        awayScore: !isUserHome
          ? String(totalUserTeamGoals)
          : String(match.awayScore || 0),
        stoppage1T: String(match.stoppage1T || 0),
        stoppage2T: String(match.stoppage2T || 0),
        stoppageET1: String(match.stoppageET1 || 0),
        stoppageET2: String(match.stoppageET2 || 0),
      };

      match.playerStats?.forEach((stat) => {
        const isStarter = [
          match.lineup?.goalkeeper?.playerId,
          ...(match.lineup?.lines?.flat().map((s) => s.playerId) || []),
        ].includes(stat.playerId);

        stat.goalMinutes?.forEach((m, i) => {
          initial[`eventMinute_goal_${stat.playerId}_${i}`] = String(m);
        });

        stat.assistTargets?.forEach((targetString, i) => {
          initial[`eventMinute_assist_${stat.playerId}_${i}`] = targetString;
        });

        if (stat.yellowCardMinute) {
          initial[`eventMinute_yellow_${stat.playerId}`] = String(
            stat.yellowCardMinute,
          );
        }

        if (stat.redCardMinute) {
          initial[`eventMinute_red_${stat.playerId}`] = String(
            stat.redCardMinute,
          );
        }

        if (isStarter && stat.substituteIn && stat.substituteIn !== "Nenhum") {
          initial[`eventMinute_sub_${stat.playerId}`] = String(
            stat.minutesPlayed || 0,
          );
        }
      });

      if (
        match.homePenScore !== undefined &&
        match.awayPenScore !== undefined
      ) {
        initial.homePenScore = String(match.homePenScore);
        initial.awayPenScore = String(match.awayPenScore);
        handleBooleanChange("hasPenalties", true);
      } else {
        handleBooleanChange("hasPenalties", false);
      }

      setFormValues(initial);
      handleBooleanChange("hasExtraTime", !!match.hasExtraTime);

      initializedMatchId.current = match.matchesId;
    }
  }, [match, career, setFormValues, handleBooleanChange]);

  const saveDetails = useCallback(async () => {
    if (!career || !season || !match) return;

    setIsSaving(true);

    try {
      const maxMatchMinutes = Math.max(
        90,
        ...(match.playerStats || []).map((s) => s.minutesPlayed || 0),
      );

      const updatedStats = (match.playerStats || []).map((stat) => {
        const isStarter = [
          match.lineup?.goalkeeper?.playerId,
          ...(match.lineup?.lines?.flat().map((s) => s.playerId) || []),
        ].includes(stat.playerId);

        let newMinutesPlayed = stat.minutesPlayed || 0;

        if (isStarter && stat.substituteIn && stat.substituteIn !== "Nenhum") {
          newMinutesPlayed =
            Number(formValues[`eventMinute_sub_${stat.playerId}`]) ||
            stat.minutesPlayed ||
            0;
        } else if (
          !isStarter &&
          stat.substituteIn &&
          stat.substituteIn !== "Nenhum"
        ) {
          const starterName = stat.substituteIn;

          const starterStat = match.playerStats?.find((s) => {
            const sp = season.players.find(
              (player) => player.id === s.playerId,
            );
            return sp?.name === starterName;
          });

          if (starterStat) {
            const starterSubMinute =
              Number(formValues[`eventMinute_sub_${starterStat.playerId}`]) ||
              starterStat.minutesPlayed ||
              0;

            newMinutesPlayed = Math.max(0, maxMatchMinutes - starterSubMinute);
          }
        }

        const goalMinutes = Array.from({ length: stat.goals }).map(
          (_, i) =>
            Number(formValues[`eventMinute_goal_${stat.playerId}_${i}`]) || 0,
        );

        const assistTargets = Array.from({ length: stat.assists || 0 }).map(
          (_, i) =>
            formValues[`eventMinute_assist_${stat.playerId}_${i}`] || "",
        );

        return {
          ...stat,
          goalMinutes,
          assistTargets,
          yellowCardMinute:
            Number(formValues[`eventMinute_yellow_${stat.playerId}`]) || 0,
          redCardMinute:
            Number(formValues[`eventMinute_red_${stat.playerId}`]) || 0,
          minutesPlayed: newMinutesPlayed,
        };
      });

      const homeScoreNum = Number(formValues.homeScore) || 0;
      const awayScoreNum = Number(formValues.awayScore) || 0;
      const isUserHome = match.homeTeam === career.clubName;

      let result: "V" | "E" | "D" | "?" = "?";

      if (homeScoreNum === awayScoreNum) {
        result = "E";

        if (booleanValues.hasPenalties) {
          const homePen = Number(formValues.homePenScore) || 0;
          const awayPen = Number(formValues.awayPenScore) || 0;

          if (homePen > awayPen) result = isUserHome ? "V" : "D";
          else if (awayPen > homePen) result = isUserHome ? "D" : "V";
        }
      } else if (isUserHome) {
        result = homeScoreNum > awayScoreNum ? "V" : "D";
      } else {
        result = awayScoreNum > homeScoreNum ? "V" : "D";
      }

      const updatedMatch: Match = {
        ...match,
        homeScore: homeScoreNum,
        awayScore: awayScoreNum,
        stoppage1T: Number(formValues.stoppage1T) || 0,
        stoppage2T: Number(formValues.stoppage2T) || 0,
        stoppageET1: Number(formValues.stoppageET1) || 0,
        stoppageET2: Number(formValues.stoppageET2) || 0,
        hasExtraTime: !!booleanValues.hasExtraTime,
        playerStats: updatedStats,
        status: "FINISHED",
        result,
      };

      if (booleanValues.hasPenalties) {
        updatedMatch.homePenScore = Number(formValues.homePenScore) || 0;
        updatedMatch.awayPenScore = Number(formValues.awayPenScore) || 0;
      } else {
        delete updatedMatch.homePenScore;
        delete updatedMatch.awayPenScore;
      }

      await ServiceMatches.updateMatchInSeason(
        career.id,
        season.id,
        updatedMatch,
      );

      backMatch();
    } finally {
      setIsSaving(false);
    }
  }, [formValues, booleanValues, match, career, season, backMatch]);

  const fields = useMemo(
    () =>
      AddDetailsFormFields(
        !!booleanValues.hasExtraTime,
        !!booleanValues.hasPenalties,
        matchEvents,
      ),
    [booleanValues.hasExtraTime, booleanValues.hasPenalties, matchEvents],
  );

  return {
    loading,
    isSaving,
    career,
    fields,
    formValues,
    booleanValues,
    handleInputChange,
    handleBooleanChange,
    saveDetails,
    backMatch,
    match,
  };
};
