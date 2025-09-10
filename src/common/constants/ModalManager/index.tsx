import { Dispatch, SetStateAction } from "react";
import Modal from "../../../components/Modal";
import ClubImgAndColor from "../../../ui/modals/ClubImgAndColor";
import DeleteConfirmModal from "../../../ui/modals/DeleteConfirmModal";
import NewCareerModal from "../../../ui/modals/NewCareerModal";
import { Career } from "../../interfaces/Career";
import { ModalType } from "../../types/enums/ModalType";
import SlideUpModal from "../../../ui/modals/SlideUpModal";
import { UseCloseModal } from "../../hooks/Modal/UseCloseModal";
import { Players } from "../../interfaces/playersInfo/players";
import SellPlayerModal from "../../../ui/modals/SellPlayerModal";
import TrophiesPanel from "../../../components/TrophiesPanel";

type ModalManagerProps = {
  activeModal: ModalType;
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  onSellConfirm?: (
    sellValue: string,
    toClub: string,
    dateExit: string
  ) => void | Promise<void>;
  saveClick?: number;
  player?: Players;
  clubColor?: string;
  darkClubColor?: string;
};

const ModalManager = ({
  activeModal,
  onClose,
  selectedCareer,
  setSelectedCareer,
  onConfirm,
  onSellConfirm,
  saveClick,
  player,
  clubColor,
  darkClubColor,
}: ModalManagerProps) => {
  const closeModal = () => {
    UseCloseModal(saveClick!, onClose);
  };

  switch (activeModal) {
    case ModalType.NEW_CAREER:
      return (
        <Modal
          isOpen
          closeModal={closeModal}
          animationContainer="left"
          text="Adicionar Carreira"
        >
          <NewCareerModal closeModal={closeModal}></NewCareerModal>
        </Modal>
      );
    case ModalType.DELETE_CONFIRM:
      return (
        <Modal
          isOpen
          closeModal={closeModal}
          animationContainer="grow"
          text="Apagar Carreira?"
        >
          <DeleteConfirmModal
            selectedCareer={selectedCareer!}
            closeModal={closeModal}
          ></DeleteConfirmModal>
        </Modal>
      );
    case ModalType.ADD_CLUB_IMG:
      return (
        <Modal
          isOpen
          closeModal={closeModal}
          text="Estilizar Clube"
          animationContainer="right"
        >
          <ClubImgAndColor
            closeModal={closeModal}
            edit={false}
            setSelectedCareer={setSelectedCareer}
            selectedCareer={selectedCareer!}
          ></ClubImgAndColor>
        </Modal>
      );
    case ModalType.EDIT_CLUB:
      return (
        <Modal
          isOpen
          closeModal={closeModal}
          text="Editar Clube"
          animationContainer="left"
        >
          <ClubImgAndColor
            closeModal={closeModal}
            edit
            setSelectedCareer={setSelectedCareer}
            selectedCareer={selectedCareer!}
          ></ClubImgAndColor>
        </Modal>
      );
    case ModalType.SLIDE_UP_PANEL:
      return (
        <Modal
          slideUp
          isOpen
          closeModal={closeModal}
          text="Editar Clube"
          animationContainer="left"
        >
          <SlideUpModal>
            <TrophiesPanel
              setSelectedCareer={setSelectedCareer}
              selectedCareer={selectedCareer!}
            />
          </SlideUpModal>
        </Modal>
      );
    case ModalType.DELETE_PLAYER_CONFIRM:
      return (
        <Modal
          isOpen
          closeModal={closeModal}
          animationContainer="grow"
          text="Deletar Jogador?"
        >
          <DeleteConfirmModal onConfirm={onConfirm!} closeModal={closeModal} />
        </Modal>
      );
    case ModalType.SELL_PLAYER:
      return (
        <Modal
          isOpen
          closeModal={closeModal}
          animationContainer="left"
          text={`Vender ${player?.name}?`}
          clubColor={clubColor!}
        >
          <SellPlayerModal
            player={player!}
            closeModal={closeModal}
            onConfirm={onSellConfirm!}
            clubColor={clubColor!}
            darkClubColor={darkClubColor!}
          />
        </Modal>
      );

    default:
      return null;
  }
};

export default ModalManager;
