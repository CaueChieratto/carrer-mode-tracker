import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useForm } from "../../../common/hooks/UseForm";
import { useMatchData } from "../../Match/hooks/useMatchData";
import { ServiceMatches } from "../../AddMatches/services/ServiceMatches";
import { AddStatsMatchFormFields } from "../constants/FormFields";

export const useAddStatsMatch = () => {
  const { career, season, match, loading, backMatch } = useMatchData();
  const [isSaving, setIsSaving] = useState(false);
  const initializedMatchId = useRef<string | null>(null);

  const { formValues, setFormValues, handleInputChange } = useForm();

  const isUserHome = match?.homeTeam === career?.clubName;

  useEffect(() => {
    if (match && career && initializedMatchId.current !== match.matchesId) {
      const userFinishings =
        match.playerStats?.reduce((acc, s) => acc + (s.finishings || 0), 0) ||
        0;
      const userDefenses =
        match.playerStats?.reduce((acc, s) => acc + (s.defenses || 0), 0) || 0;
      const userYellows =
        match.playerStats?.reduce(
          (acc, s) => acc + (s.yellowCard ? 1 : 0),
          0,
        ) || 0;
      const userReds =
        match.playerStats?.reduce((acc, s) => acc + (s.redCard ? 1 : 0), 0) ||
        0;

      const calcAcc = (success?: number, total?: number) => {
        return success !== undefined && total !== undefined && total > 0
          ? String(Math.round((success / total) * 100))
          : "";
      };

      const initialUserPoss = isUserHome
        ? match.homePossession
        : match.awayPossession;

      const initial: Record<string, string> = {
        userPossession:
          initialUserPoss !== undefined ? String(initialUserPoss) : "",

        homeXG: match.homeXG !== undefined ? String(match.homeXG) : "",
        awayXG: match.awayXG !== undefined ? String(match.awayXG) : "",

        homeBallRecovery:
          match.homeBallRecovery !== undefined
            ? String(match.homeBallRecovery)
            : "",
        awayBallRecovery:
          match.awayBallRecovery !== undefined
            ? String(match.awayBallRecovery)
            : "",

        homeFinishings:
          match.homeFinishings !== undefined
            ? String(match.homeFinishings)
            : isUserHome
              ? String(userFinishings)
              : "",
        awayFinishings:
          match.awayFinishings !== undefined
            ? String(match.awayFinishings)
            : !isUserHome
              ? String(userFinishings)
              : "",

        homeShotAccuracy: calcAcc(
          match.homeFinishingsOnTarget,
          match.homeFinishings,
        ),
        awayShotAccuracy: calcAcc(
          match.awayFinishingsOnTarget,
          match.awayFinishings,
        ),

        homePasses:
          match.homePasses !== undefined ? String(match.homePasses) : "",
        awayPasses:
          match.awayPasses !== undefined ? String(match.awayPasses) : "",

        homePassAccuracy: calcAcc(match.homePassesCompleted, match.homePasses),
        awayPassAccuracy: calcAcc(match.awayPassesCompleted, match.awayPasses),

        homeDefenses:
          match.homeDefenses !== undefined
            ? String(match.homeDefenses)
            : isUserHome
              ? String(userDefenses)
              : "",
        awayDefenses:
          match.awayDefenses !== undefined
            ? String(match.awayDefenses)
            : !isUserHome
              ? String(userDefenses)
              : "",

        homeYellowCards:
          match.homeYellowCards !== undefined
            ? String(match.homeYellowCards)
            : isUserHome
              ? String(userYellows)
              : "",
        awayYellowCards:
          match.awayYellowCards !== undefined
            ? String(match.awayYellowCards)
            : !isUserHome
              ? String(userYellows)
              : "",

        homeRedCards:
          match.homeRedCards !== undefined
            ? String(match.homeRedCards)
            : isUserHome
              ? String(userReds)
              : "",
        awayRedCards:
          match.awayRedCards !== undefined
            ? String(match.awayRedCards)
            : !isUserHome
              ? String(userReds)
              : "",
      };

      setFormValues(initial);
      initializedMatchId.current = match.matchesId;
    }
  }, [match, career, isUserHome, setFormValues]);

  const saveStats = useCallback(async () => {
    if (!career || !season || !match) return;
    setIsSaving(true);

    try {
      const parseNum = (val: string | undefined) =>
        val && val !== "" ? Number(val) : undefined;

      const userPoss = parseNum(formValues.userPossession);
      const rivalPoss = userPoss !== undefined ? 100 - userPoss : undefined;
      const homePossession = isUserHome ? userPoss : rivalPoss;
      const awayPossession = !isUserHome ? userPoss : rivalPoss;

      const hFinishings = parseNum(formValues.homeFinishings);
      const hShotAcc = parseNum(formValues.homeShotAccuracy);
      const homeFinishingsOnTarget =
        hFinishings !== undefined && hShotAcc !== undefined
          ? Math.round((hFinishings * hShotAcc) / 100)
          : match.homeFinishingsOnTarget;

      const aFinishings = parseNum(formValues.awayFinishings);
      const aShotAcc = parseNum(formValues.awayShotAccuracy);
      const awayFinishingsOnTarget =
        aFinishings !== undefined && aShotAcc !== undefined
          ? Math.round((aFinishings * aShotAcc) / 100)
          : match.awayFinishingsOnTarget;

      const hPasses = parseNum(formValues.homePasses);
      const hPassAcc = parseNum(formValues.homePassAccuracy);
      const homePassesCompleted =
        hPasses !== undefined && hPassAcc !== undefined
          ? Math.round((hPasses * hPassAcc) / 100)
          : match.homePassesCompleted;

      const aPasses = parseNum(formValues.awayPasses);
      const aPassAcc = parseNum(formValues.awayPassAccuracy);
      const awayPassesCompleted =
        aPasses !== undefined && aPassAcc !== undefined
          ? Math.round((aPasses * aPassAcc) / 100)
          : match.awayPassesCompleted;

      const updatedMatch = {
        ...match,
        homePossession,
        awayPossession,
        homeXG: parseNum(formValues.homeXG),
        awayXG: parseNum(formValues.awayXG),
        homeBallRecovery: parseNum(formValues.homeBallRecovery),
        awayBallRecovery: parseNum(formValues.awayBallRecovery),

        homeFinishings: hFinishings,
        awayFinishings: aFinishings,
        homeFinishingsOnTarget,
        awayFinishingsOnTarget,

        homePasses: hPasses,
        awayPasses: aPasses,
        homePassesCompleted,
        awayPassesCompleted,

        homeDefenses: parseNum(formValues.homeDefenses),
        awayDefenses: parseNum(formValues.awayDefenses),
        homeYellowCards: parseNum(formValues.homeYellowCards),
        awayYellowCards: parseNum(formValues.awayYellowCards),
        homeRedCards: parseNum(formValues.homeRedCards),
        awayRedCards: parseNum(formValues.awayRedCards),
      };

      await ServiceMatches.updateMatchInSeason(
        career.id,
        season.id,
        updatedMatch,
      );
      backMatch();
    } finally {
      setIsSaving(false);
    }
  }, [formValues, match, career, season, isUserHome, backMatch]);

  const fields = useMemo(
    () =>
      AddStatsMatchFormFields(
        match?.homeTeam || "Mandante",
        match?.awayTeam || "Visitante",
        isUserHome,
      ),
    [match, isUserHome],
  );

  return {
    loading,
    isSaving,
    career,
    match,
    fields,
    formValues,
    handleInputChange,
    saveStats,
    backMatch,
  };
};
