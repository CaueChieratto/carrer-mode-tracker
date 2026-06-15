import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useForm } from "../../../common/hooks/UseForm";
import { useMatchData } from "../../Match/hooks/useMatchData";
import { ServiceMatches } from "../../AddMatches/services/ServiceMatches";
import { Match } from "../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { MatchWithOpponentEvents } from "../types";
import { buildFormFields } from "../helpers/buildFormFields";
import { calculateMatchResult } from "../helpers/calculateMatchResult";
import { buildOpponentEvents } from "../helpers/buildOpponentEvents";
import { formatRating } from "../../../common/utils/FormatRating";
import { Field } from "../../../components/FormSection";

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

  useEffect(() => {
    if (!match || !career || initializedMatchId.current === match.matchesId)
      return;

    const totalUserTeamGoals =
      match.playerStats?.reduce((acc, stat) => acc + (stat.goals || 0), 0) || 0;
    const isUserHome = match.homeTeam === career.clubName;

    const initial: Record<string, string> = {
      homeScore:
        match.homeScore !== undefined
          ? String(match.homeScore)
          : isUserHome && totalUserTeamGoals > 0
            ? String(totalUserTeamGoals)
            : "",
      awayScore:
        match.awayScore !== undefined
          ? String(match.awayScore)
          : !isUserHome && totalUserTeamGoals > 0
            ? String(totalUserTeamGoals)
            : "",
      stoppage1T: match.stoppage1T ? String(match.stoppage1T) : "",
      stoppage2T: match.stoppage2T ? String(match.stoppage2T) : "",
      stoppageET1: match.stoppageET1 ? String(match.stoppageET1) : "",
      stoppageET2: match.stoppageET2 ? String(match.stoppageET2) : "",
      opponentMvpName: match.opponentMvpName || "",
      opponentMvpRating: match.opponentMvpRating
        ? String(match.opponentMvpRating)
        : "",
    };

    const matchWithEvents = match as MatchWithOpponentEvents;
    if (matchWithEvents.opponentEvents) {
      const oppEv = matchWithEvents.opponentEvents;

      oppEv.goals?.forEach((g, i) => {
        initial[`opponentGoalPlayer_${i}`] = g.player;
        initial[`opponentGoalMinute_${i}`] = g.minute;
      });

      oppEv.assists?.forEach((a, i) => {
        initial[`opponentAssistPlayer_${i}`] = a.player;
        initial[`opponentAssistTo_${i}`] = a.goalReference;
      });

      if (oppEv.cards?.length) {
        initial.opponentCardCount = String(oppEv.cards.length);
        oppEv.cards.forEach((c, i) => {
          initial[`opponentCardPlayer_${i}`] = c.player;
          initial[`opponentYellowMin_${i}`] = c.yellowMinute;
          initial[`opponentSecondYellowMin_${i}`] = c.secondYellowMinute;
          initial[`opponentRedMin_${i}`] = c.redMinute;
          handleBooleanChange(`opponentYellow_${i}`, c.yellow);
          handleBooleanChange(`opponentSecondYellow_${i}`, c.secondYellow);
          handleBooleanChange(`opponentRed_${i}`, c.red);
        });
      }

      if (oppEv.ownGoals?.length) {
        initial.opponentOwnGoalCount = String(oppEv.ownGoals.length);
        oppEv.ownGoals.forEach((og, i) => {
          initial[`opponentOwnGoalPlayer_${i}`] = og.player;
          initial[`opponentOwnGoalMinute_${i}`] = og.minute;
        });
      }
    }

    if (match.homePenScore !== undefined && match.awayPenScore !== undefined) {
      initial.homePenScore = String(match.homePenScore);
      initial.awayPenScore = String(match.awayPenScore);
      handleBooleanChange("hasPenalties", true);
    } else {
      handleBooleanChange("hasPenalties", false);
    }

    setFormValues(initial);
    handleBooleanChange("hasExtraTime", !!match.hasExtraTime);

    initializedMatchId.current = match.matchesId;
  }, [match, career, setFormValues, handleBooleanChange]);

  const handleLocalInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      field: Field,
    ) => {
      let value = e.target.value;

      if (field.id === "opponentMvpRating") {
        value = formatRating(value);
        setFormValues((prev) => ({ ...prev, [field.id]: value }));
        return;
      }

      handleInputChange(e, field);
    },
    [handleInputChange, setFormValues],
  );

  const handleLocalBooleanChange = useCallback(
    (fieldId: string, value: boolean) => {
      if (fieldId.startsWith("opponentSecondYellow_") && value) {
        const index = fieldId.split("_")[1];
        handleBooleanChange(`opponentRed_${index}`, false);
      }
      if (fieldId.startsWith("opponentRed_") && value) {
        const index = fieldId.split("_")[1];
        handleBooleanChange(`opponentSecondYellow_${index}`, false);
      }
      if (fieldId.startsWith("opponentYellow_") && !value) {
        const index = fieldId.split("_")[1];
        handleBooleanChange(`opponentSecondYellow_${index}`, false);
      }
      handleBooleanChange(fieldId, value);
    },
    [handleBooleanChange],
  );

  const saveDetails = useCallback(async () => {
    if (!career || !season || !match) return;
    setIsSaving(true);

    try {
      const homeScoreNum = Number(formValues.homeScore) || 0;
      const awayScoreNum = Number(formValues.awayScore) || 0;
      const opponentCardCountNum = Number(formValues.opponentCardCount) || 0;
      const opponentOwnGoalCountNum =
        Number(formValues.opponentOwnGoalCount) || 0;

      const isUserHome = match.homeTeam === career.clubName;
      const hasPenalties = !!booleanValues.hasPenalties;
      const homePenScore = Number(formValues.homePenScore) || 0;
      const awayPenScore = Number(formValues.awayPenScore) || 0;

      const result = calculateMatchResult(
        homeScoreNum,
        awayScoreNum,
        isUserHome,
        hasPenalties,
        homePenScore,
        awayPenScore,
      );

      const opponentScoreNum = isUserHome ? awayScoreNum : homeScoreNum;
      const opponentEvents = buildOpponentEvents(
        opponentScoreNum,
        opponentCardCountNum,
        opponentOwnGoalCountNum,
        formValues,
        booleanValues,
      );

      const updatedMatch: MatchWithOpponentEvents = {
        ...match,
        homeScore: homeScoreNum,
        awayScore: awayScoreNum,
        stoppage1T: Number(formValues.stoppage1T) || 0,
        stoppage2T: Number(formValues.stoppage2T) || 0,
        stoppageET1: Number(formValues.stoppageET1) || 0,
        stoppageET2: Number(formValues.stoppageET2) || 0,
        hasExtraTime: !!booleanValues.hasExtraTime,
        status: "FINISHED",
        result,
        opponentEvents,
        opponentMvpName: formValues.opponentMvpName || undefined,
        opponentMvpRating: formValues.opponentMvpRating
          ? Number(formValues.opponentMvpRating)
          : undefined,
      };

      if (hasPenalties) {
        updatedMatch.homePenScore = homePenScore;
        updatedMatch.awayPenScore = awayPenScore;
      } else {
        delete updatedMatch.homePenScore;
        delete updatedMatch.awayPenScore;
      }

      await ServiceMatches.updateMatchInSeason(
        career.id,
        season.id,
        updatedMatch as Match,
      );

      backMatch();
    } catch (error) {
      console.error("Erro: ", error);
    } finally {
      setIsSaving(false);
    }
  }, [formValues, booleanValues, match, career, season, backMatch]);

  const isUserHome = match?.homeTeam === career?.clubName;
  const opponentScore =
    Number(isUserHome ? formValues.awayScore : formValues.homeScore) || 0;

  const userScore =
    Number(isUserHome ? formValues.homeScore : formValues.awayScore) || 0;
  const opponentCardCount = Number(formValues.opponentCardCount) || 0;
  const opponentOwnGoalCount = Number(formValues.opponentOwnGoalCount) || 0;

  const opponentGoalOptions = useMemo(() => {
    return Array.from({ length: opponentScore }).map((_, i) => {
      const min = formValues[`opponentGoalMinute_${i}`];
      const player = formValues[`opponentGoalPlayer_${i}`];
      if (player && min) return `${player} - ${min}'`;
      if (player) return player;
      if (min) return `${min}'`;
      return `Gol ${i + 1}`;
    });
  }, [opponentScore, formValues]);

  const fields = useMemo(
    () =>
      buildFormFields(
        !!booleanValues.hasExtraTime,
        !!booleanValues.hasPenalties,
        opponentScore,
        opponentCardCount,
        opponentOwnGoalCount,
        userScore,
        opponentGoalOptions,
        booleanValues,
        match?.homeTeam,
        match?.awayTeam,
        formValues,
      ),
    [
      booleanValues,
      opponentScore,
      opponentCardCount,
      opponentGoalOptions,
      opponentOwnGoalCount,
      userScore,
      match?.homeTeam,
      match?.awayTeam,
      formValues,
    ],
  );

  return {
    loading,
    isSaving,
    career,
    match,
    fields,
    formValues,
    handleInputChange: handleLocalInputChange,
    handleBooleanChange: handleLocalBooleanChange,
    saveDetails,
    backMatch,
  };
};
