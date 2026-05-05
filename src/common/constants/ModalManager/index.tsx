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
import { ClubData } from "../../interfaces/club/clubData";
import { SeasonConfigs } from "../../../ui/modals/SeasonConfigs";
import { getSeasonName } from "../../utils/GetSeasonName";
import ReturnLoanConfirmModal from "../../../ui/modals/ReturnLoanConfirmModal";

type ModalManagerProps = {
  activeModal: ModalType;
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  onSellConfirm?: (
    sellValue: string,
    toClub: string,
    dateExit: string,
    loanDuration?: string,
    wagePercentage?: string,
  ) => void | Promise<void>;
  onReturnLoanConfirm?: () => void | Promise<void>;
  saveClick?: number;
  player?: Players;
  clubColor?: string;
  darkClubColor?: string;
  selectedSeason?: ClubData | null;
  onNavigateSeason?: (seasonId: string) => void;
  career?: Career;
};

const ModalManager = ({
  activeModal,
  onClose,
  selectedCareer,
  setSelectedCareer,
  onConfirm,
  onSellConfirm,
  onReturnLoanConfirm,
  saveClick,
  player,
  clubColor,
  darkClubColor,
  onNavigateSeason,
  selectedSeason,
  career,
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
    case ModalType.LOAN_PLAYER: {
      const isLoan = activeModal === ModalType.LOAN_PLAYER;
      return (
        <Modal
          isOpen
          sellPlayer={isLoan ? "loan" : "sell"}
          closeModal={closeModal}
          animationContainer="left"
          text={
            isLoan ? `Emprestar ${player?.name}?` : `Vender ${player?.name}?`
          }
        >
          <SellPlayerModal
            player={player!}
            closeModal={closeModal}
            onConfirm={onSellConfirm!}
            clubColor={clubColor!}
            darkClubColor={darkClubColor!}
            isLoan={isLoan}
          />
        </Modal>
      );
    }
    case ModalType.RETURN_LOAN_CONFIRM:
      return (
        <Modal
          isOpen
          closeModal={closeModal}
          animationContainer="grow"
          text="Retornar Jogador?"
        >
          <ReturnLoanConfirmModal
            onConfirm={onReturnLoanConfirm!}
            closeModal={closeModal}
          />
        </Modal>
      );
    case ModalType.SEASON_CONFIGS: {
      const formattedSeasonName =
        selectedSeason && career
          ? getSeasonName(
              selectedSeason.seasonNumber,
              career.createdAt,
              career.nation,
            )
          : "1";

      return (
        <Modal
          isOpen
          closeModal={closeModal}
          animationContainer="grow"
          text={`Temporada ${selectedSeason?.seasonNumber}`}
        >
          {selectedSeason && career && (
            <SeasonConfigs
              season={selectedSeason}
              career={career}
              setSelectedCareer={setSelectedCareer}
              seasonName={formattedSeasonName}
              onNavigate={() => {
                closeModal();
                if (onNavigateSeason) onNavigateSeason(selectedSeason.id);
              }}
            />
          )}
        </Modal>
      );
    }

    default:
      return null;
  }
};

export default ModalManager;
