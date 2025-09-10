import { Career } from "../../../common/interfaces/Career";
import { ServiceCareer } from "../../../common/services/ServiceCareer";
import Button from "../../../components/Button";
import ContainerButton from "../../../components/ContainerButton";
import Styles from "./DeleteConfirmModal.module.css";

type DeleteConfirmModalProps = {
  closeModal: () => void;
  onConfirm?: () => void | Promise<void>;
  selectedCareer?: Career;
};

const DeleteConfirmModal = ({
  closeModal,
  selectedCareer,
  onConfirm,
}: DeleteConfirmModalProps) => {
  const deleteCareer = async () => {
    try {
      if (selectedCareer) {
        await ServiceCareer.deleteCareer(selectedCareer.id);
      } else if (onConfirm) {
        await onConfirm();
      }
    } catch (error) {
      console.error("Erro na operação de exclusão:", error);
    } finally {
      closeModal();
    }
  };

  return (
    <ContainerButton className={Styles.container}>
      <Button
        width="normal"
        size="big"
        fontWeight="bold"
        radius="square"
        typeButton="primaryDelete"
        onClick={() => closeModal()}
      >
        Cancelar
      </Button>
      <Button
        width="normal"
        size="big"
        fontWeight="bold"
        radius="square"
        typeButton="secondaryDelete"
        onClick={deleteCareer}
      >
        Confirmar
      </Button>
    </ContainerButton>
  );
};

export default DeleteConfirmModal;
