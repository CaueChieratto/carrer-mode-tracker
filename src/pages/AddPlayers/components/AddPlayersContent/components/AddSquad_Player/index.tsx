import Styles from "./AddSquad_Player.module.css";
import Form from "../../../../../../components/Form";
import FormSection from "../../../../../../components/FormSection";
import { forwardRef, useEffect } from "react";
import { squadFormFields } from "./constants/SquadFormFields";
import { useForm } from "../../../../../../common/hooks/UseForm";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { Career } from "../../../../../../common/interfaces/Career";
import { ModalType } from "../../../../../../common/types/enums/ModalType";
import { mapPlayerToFormValues } from "../../../../../../common/helpers/Mappers";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";

type AddSquad_PlayerProps = {
  player?: Players;
  openModal: (modal: ModalType, career?: Career) => void;
  season: ClubData;
};

const AddSquad_Player = forwardRef<HTMLFormElement, AddSquad_PlayerProps>(
  ({ player, openModal }, ref) => {
    const {
      formValues,
      setFormValues,
      booleanValues,
      handleBooleanChange,
      handleInputChange,
      handleKeyDown,
      handleKeyUp,
    } = useForm();

    const isEditing = !!player;
    const isLoaned = !!player?.loan;
    const isIncomingLoanPlayer = !!player?.incomingLoan;

    useEffect(() => {
      if (player) {
        const initialFormValues = mapPlayerToFormValues(player);
        setFormValues(initialFormValues);
        handleBooleanChange("isSigning", player.buy);
        handleBooleanChange("isCaptain", player.captain);

        const latestContract = player.contract?.[player.contract.length - 1];
        const isIncomingLoan = !!(
          latestContract?.isLoan && !latestContract?.leftClub
        );
        handleBooleanChange("isLoan", isIncomingLoan);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player]);

    const actionClick = (modal: ModalType | string) => {
      openModal(modal as ModalType);
    };

    const handleBooleanChangeWrapper = (id: string, value: boolean) => {
      handleBooleanChange(id, value);
      if (id === "isSigning" && value) {
        handleBooleanChange("isLoan", false);
      } else if (id === "isLoan" && value) {
        handleBooleanChange("isSigning", false);
      }
    };

    const isSigning = booleanValues.isSigning;
    const isIncomingLoan = booleanValues.isLoan;

    return (
      <Form className={Styles.form} ref={ref}>
        {squadFormFields
          .filter(
            (section) =>
              !("editOnly" in section && section.editOnly) || isEditing,
          )
          .map((item, index) => {
            const filteredRows = item.fields
              .map((row) =>
                row.filter((field) => {
                  if (
                    "loanOnly" in field &&
                    field.loanOnly &&
                    !isLoaned &&
                    !isIncomingLoanPlayer
                  )
                    return false;

                  if (
                    "hideOnIncomingLoanPlayer" in field &&
                    field.hideOnIncomingLoanPlayer &&
                    isIncomingLoanPlayer
                  )
                    return false;

                  if (
                    "isSigningOnly" in field &&
                    field.isSigningOnly &&
                    !isSigning
                  )
                    return false;
                  if (
                    "isIncomingLoanOnly" in field &&
                    field.isIncomingLoanOnly &&
                    !isIncomingLoan
                  )
                    return false;
                  if (
                    "showOnJoin" in field &&
                    field.showOnJoin &&
                    !isSigning &&
                    !isIncomingLoan
                  )
                    return false;
                  if (
                    "hideOnIncomingLoan" in field &&
                    field.hideOnIncomingLoan &&
                    isIncomingLoan
                  )
                    return false;
                  return true;
                }),
              )
              .filter((row) => row.length > 0);

            if (filteredRows.length === 0) return null;

            return (
              <FormSection
                key={index}
                onActionClick={actionClick}
                title={item.title}
                rows={filteredRows}
                formValues={{
                  ...formValues,
                  ...Object.fromEntries(
                    Object.entries(booleanValues).map(([k, v]) => [
                      k,
                      String(v),
                    ]),
                  ),
                }}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onBooleanChange={handleBooleanChangeWrapper}
              />
            );
          })}
      </Form>
    );
  },
);

AddSquad_Player.displayName = "AddSquad_Player";

export default AddSquad_Player;
