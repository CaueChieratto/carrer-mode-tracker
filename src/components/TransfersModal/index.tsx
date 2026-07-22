import Modal from "../Modal";
import SlideUpModal from "../../ui/modals/SlideUpModal";
import TransfersPanel from "./components/TransfersPanel";
import { Players } from "../../common/interfaces/playersInfo/players";

type TransfersModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  transferType: "arrivals" | "exit";
  playersToShow: Players[];
  currency?: string;
};

const TransfersModal = ({
  isOpen,
  closeModal,
  transferType,
  playersToShow,
  currency,
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
          currency={currency}
        />
      </SlideUpModal>
    </Modal>
  );
};

export default TransfersModal;
