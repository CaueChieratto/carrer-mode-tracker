import Styles from "./ConfirmModal.module.css";
import Button from "../../../../components/Button";
import { ReactNode } from "react";

type ConfirmModalProps = {
  title: string;
  description: ReactNode;
  cancelText?: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({
  title,
  description,
  cancelText = "Cancelar",
  confirmText,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div className={Styles.modalOverlay}>
      <div className={Styles.modalContent}>
        <h3 className={Styles.modalTitle}>{title}</h3>
        <p className={Styles.modalText}>{description}</p>
        <div className={Styles.modalActions}>
          <Button isActive={false} color="cancel" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button isActive={true} color="club_secondary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
