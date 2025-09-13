import Modal from "../Modal";
import SlideUpModal from "../../ui/modals/SlideUpModal";
import TransfersPanel from "../TransfersPanel";
import { Players } from "../../common/interfaces/playersInfo/players";

type TransfersModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  transferType: "arrivals" | "exit";
  playersToShow: Players[];
};

const TransfersModal = ({
  isOpen,
  closeModal,
  transferType,
  playersToShow,
}: TransfersModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      slideUp
      text={transferType === "arrivals" ? "Chegadas" : "Saídas"}
    >
      <SlideUpModal>
        <TransfersPanel
          title={transferType === "arrivals" ? "Chegadas" : "Saídas"}
          players={playersToShow}
        />
      </SlideUpModal>
    </Modal>
  );
};

export default TransfersModal;
