import { useState } from "react";
import { Career } from "../../../common/interfaces/Career";
import { ServiceCareer } from "../../../common/services/ServiceCareer";
import Button from "../../../components/Button";
import ContainerButton from "../../../components/ContainerButton";
import Styles from "./DeleteConfirmModal.module.css";
import Load from "../../../components/Load";

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
  const [isLoading, setIsLoading] = useState(false);

  const deleteCareer = async () => {
    setIsLoading(true);
    try {
      if (selectedCareer) {
        await ServiceCareer.deleteCareer(selectedCareer.id);
      } else if (onConfirm) {
        await onConfirm();
      }
    } catch (error) {
      console.error("Erro na operação de exclusão:", error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  if (isLoading) {
    return <Load />;
  }

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
