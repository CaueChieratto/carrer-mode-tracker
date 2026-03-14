import { Dispatch, SetStateAction } from "react";
import Button from "../../../../components/Button";
import { Career } from "../../../../pages/CareersPage/interfaces/Career";
import { ModalType } from "../../../../managers/enum/ModalType";
import { ButtonConfig } from "../../../../pages/CareersPage/config/CareerCardButtons";

type CareerCardButtonsProps = {
  button: ButtonConfig;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  career: Career;
  onOpenModal: (modal: ModalType, career?: Career) => void;
};

export const CareerCardButtons = ({
  button,
  setSelectedCareer,
  career,
  onOpenModal,
}: CareerCardButtonsProps) => (
  <Button
    key={button.text}
    {...button.props}
    onClick={() => {
      setSelectedCareer(career);
      if (button.modal) {
        onOpenModal(button.modal, career);
      } else if (button.onClick) {
        button.onClick(career);
      }
    }}
  >
    {button.text}
  </Button>
);
