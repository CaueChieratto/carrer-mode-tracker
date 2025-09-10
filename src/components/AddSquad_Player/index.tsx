import Styles from "./AddSquad_Player.module.css";
import Form from "../Form";
import FormSection from "../FormSection";
import { forwardRef, useEffect } from "react";
import { squadFormFields } from "../../common/constants/SquadFormFields";
import { useForm } from "../../common/hooks/UseForm";
import { Players } from "../../common/interfaces/playersInfo/players";
import { Career } from "../../common/interfaces/Career";
import { ModalType } from "../../common/types/enums/ModalType";
import { mapPlayerToFormValues } from "../../common/helpers/Mappers";
import { ClubData } from "../../common/interfaces/club/clubData";

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

    useEffect(() => {
      if (player) {
        const initialFormValues = mapPlayerToFormValues(player);
        setFormValues(initialFormValues);
        handleBooleanChange("isSigning", player.buy);
        handleBooleanChange("isCaptain", player.captain);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player]);

    return (
      <Form className={Styles.form} ref={ref}>
        {squadFormFields
          .filter(
            (section) =>
              !("editOnly" in section && section.editOnly) || isEditing
          )
          .map((item, index) => (
            <FormSection
              key={index}
              onActionClick={openModal}
              title={item.title}
              rows={item.fields}
              formValues={{
                ...formValues,
                ...Object.fromEntries(
                  Object.entries(booleanValues).map(([k, v]) => [k, String(v)])
                ),
              }}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onBooleanChange={handleBooleanChange}
            />
          ))}
      </Form>
    );
  }
);

AddSquad_Player.displayName = "AddSquad_Player";

export default AddSquad_Player;
