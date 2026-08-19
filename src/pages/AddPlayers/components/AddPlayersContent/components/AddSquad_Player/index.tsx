import Styles from "./AddSquad_Player.module.css";
import Form from "../../../../../../components/Form";
import FormSection from "../../../../../../components/FormSection";
import { forwardRef } from "react";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { Career } from "../../../../../../common/interfaces/Career";
import { ModalType } from "../../../../../../common/types/enums/ModalType";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { getSquadFormFields } from "./constants/SquadFormFields";
import { useSquadPlayerForm } from "./hooks/useSquadPlayerForm";
import {
  filterFormSections,
  SquadFormField,
  SquadFormSection,
} from "./helpers/filterFormFields";

type AddSquad_PlayerProps = {
  player?: Players;
  openModal: (modal: ModalType, career?: Career) => void;
  season: ClubData;
  career: Career;
};

const AddSquad_Player = forwardRef<HTMLFormElement, AddSquad_PlayerProps>(
  ({ player, season, career, openModal }, ref) => {
    const {
      formValues,
      booleanValues,
      handleBooleanChange,
      handleInputChange,
      handleKeyDown,
      handleKeyUp,
      pastPlayerOptions,
      isEditing,
      isLoaned,
      isIncomingLoanPlayer,
      isKnownPlayer,
      isSigning,
      isIncomingLoan,
    } = useSquadPlayerForm(player, career, season);

    const dynamicFields = getSquadFormFields(
      formValues.nation || "",
      pastPlayerOptions,
    ) as SquadFormSection<SquadFormField>[];

    const activeSections = filterFormSections(dynamicFields, {
      isEditing,
      isLoaned,
      isIncomingLoanPlayer,
      isSigning,
      isIncomingLoan,
      isKnownPlayer,
    });

    const mergedFormValues = {
      ...formValues,
      ...Object.fromEntries(
        Object.entries(booleanValues).map(([k, v]) => [k, String(v)]),
      ),
    };

    return (
      <Form className={Styles.form} ref={ref}>
        {isKnownPlayer && formValues.globalId && (
          <input type="hidden" name="globalId" value={formValues.globalId} />
        )}

        {formValues.isAcademy === "true" && (
          <>
            <input type="hidden" name="isAcademy" value="true" />
            <input
              type="hidden"
              name="academyNickname"
              value={formValues.academyNickname}
            />
            <input
              type="hidden"
              name="academyData"
              value={formValues.academyData}
            />
            <input
              type="hidden"
              name="academyHistory"
              value={formValues.academyHistory}
            />
            <input
              type="hidden"
              name="academyTournaments"
              value={formValues.academyTournaments}
            />
          </>
        )}

        {activeSections.map((item, index) => (
          <FormSection
            key={index}
            onActionClick={(modal) => openModal(modal as ModalType)}
            title={item.title}
            rows={item.fields}
            formValues={mergedFormValues}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onBooleanChange={handleBooleanChange}
          />
        ))}
      </Form>
    );
  },
);

AddSquad_Player.displayName = "AddSquad_Player";

export default AddSquad_Player;
