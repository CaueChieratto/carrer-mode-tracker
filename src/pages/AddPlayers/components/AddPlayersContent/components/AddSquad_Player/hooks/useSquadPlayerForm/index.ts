import { useEffect } from "react";
import { usePastPlayers } from "../usePastPlayers";
import { mapPlayerToFormValues } from "../../../../../../../../common/helpers/Mappers";
import { useForm } from "../../../../../../../../common/hooks/UseForm";
import { Career } from "../../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../../common/interfaces/club/clubData";
import { Players } from "../../../../../../../../common/interfaces/playersInfo/players";

export const useSquadPlayerForm = (
  player: Players | undefined,
  career: Career,
  season: ClubData,
) => {
  const form = useForm();
  const { formValues, setFormValues, handleBooleanChange, booleanValues } =
    form;
  const isEditing = !!player;

  const { pastPlayers, pastPlayerOptions } = usePastPlayers(
    career,
    season,
    isEditing,
  );

  useEffect(() => {
    if (formValues.selectedPastPlayer) {
      const selected = pastPlayers.find(
        (p) => p.name === formValues.selectedPastPlayer,
      );

      if (selected) {
        setFormValues((prev) => ({
          ...prev,
          playerName: selected.name,
          globalId: selected.id,
          overall: String(selected.overall),
          sector: selected.sector,
          position: selected.position as string,
          age: String(selected.age),
          nation: selected.nation,
          shirtNumber: selected.shirtNumber || "",
          isAcademy: selected.isAcademy ? "true" : "",
          academyNickname: selected.academyNickname || "",
          academyData: selected.academyData
            ? JSON.stringify(selected.academyData)
            : "",
          academyHistory: selected.academyHistory
            ? JSON.stringify(selected.academyHistory)
            : "",
          academyTournaments: selected.academyTournaments
            ? JSON.stringify(selected.academyTournaments)
            : "",
        }));
      }
    }
  }, [formValues.selectedPastPlayer, pastPlayers, setFormValues]);

  useEffect(() => {
    if (player) {
      const initialFormValues = mapPlayerToFormValues(player, career?.currency);
      setFormValues(initialFormValues);

      handleBooleanChange("isSigning", Boolean(player.buy));
      handleBooleanChange("isCaptain", Boolean(player.captain));

      const latestContract = player.contract?.[player.contract.length - 1];
      const isIncomingLoanValue = Boolean(
        latestContract?.isLoan && !latestContract?.leftClub,
      );
      handleBooleanChange("isLoan", isIncomingLoanValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  const handleBooleanChangeWrapper = (id: string, value: boolean) => {
    handleBooleanChange(id, value);
    if (id === "isSigning" && value) {
      handleBooleanChange("isLoan", false);
    } else if (id === "isLoan" && value) {
      handleBooleanChange("isSigning", false);
    }
  };

  return {
    ...form,
    handleBooleanChange: handleBooleanChangeWrapper,
    pastPlayerOptions,
    isEditing,
    isLoaned: !!player?.loan,
    isIncomingLoanPlayer: !!player?.incomingLoan,
    isKnownPlayer: booleanValues.isKnownPlayer,
    isSigning: booleanValues.isSigning,
    isIncomingLoan: booleanValues.isLoan,
  };
};
