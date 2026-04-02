import { useEffect, useMemo, useRef } from "react";
import { useForm } from "../../../../common/hooks/UseForm";
import { Career } from "../../../../common/interfaces/Career";
import { getMatchFormFields } from "../../../../components/AllMatchesTab/constants/MatchFormFields";
import { ClubData } from "../../../../common/interfaces/club/clubData";

type UseFormReturn = ReturnType<typeof useForm>;

interface UseMatchFormParams {
  matchesId?: string;
  season?: ClubData;
  career?: Career;
  setFormValues: UseFormReturn["setFormValues"];
  handleBooleanChange: UseFormReturn["handleBooleanChange"];
}

export function useMatchForm({
  matchesId,
  season,
  career,
  setFormValues,
  handleBooleanChange,
}: UseMatchFormParams) {
  const initializedMatchId = useRef<string | null>(null);

  useEffect(() => {
    if (!matchesId || !season || !career) return;

    if (initializedMatchId.current === matchesId) return;

    const matchToEdit = season.matches?.find((m) => m.matchesId === matchesId);
    if (!matchToEdit) return;

    const isHomeMatch = matchToEdit.homeTeam === career.clubName;
    const opponentTeam = isHomeMatch
      ? matchToEdit.awayTeam
      : matchToEdit.homeTeam;

    setFormValues({
      date: matchToEdit.date.substring(0, 5),
      league: matchToEdit.league,
      opponentTeam,
    });

    handleBooleanChange("isHomeMatch", isHomeMatch);

    initializedMatchId.current = matchesId;
  }, [matchesId, season, career, setFormValues, handleBooleanChange]);

  const leagueOptions = useMemo(
    () => season?.leagues?.map((l) => l.name) ?? [],
    [season],
  );

  const formFields = useMemo(
    () => getMatchFormFields(leagueOptions),
    [leagueOptions],
  );

  return { formFields };
}
