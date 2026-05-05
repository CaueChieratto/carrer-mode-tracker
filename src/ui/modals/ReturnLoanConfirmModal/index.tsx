import { useState } from "react";
import Button from "../../../components/Button";
import ContainerButton from "../../../components/ContainerButton";
import Form from "../../../components/Form";
import SellFormField from "../../../components/SellFormField";
import { BsCalendar2Event } from "react-icons/bs";
import Styles from "../DeleteConfirmModal/DeleteConfirmModal.module.css";
import { formatDateInputShort } from "../../../common/utils/Date";

type ReturnLoanConfirmModalProps = {
  closeModal: () => void;
  onConfirm: (returnDate: string) => void | Promise<void>;
};

const ReturnLoanConfirmModal = ({
  closeModal,
  onConfirm,
}: ReturnLoanConfirmModalProps) => {
  const [returnDate, setReturnDate] = useState("");

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate) {
      alert("Por favor, preencha a data.");
      return;
    }
    try {
      await onConfirm(returnDate);
    } catch (error) {
      console.error("Erro ao retornar o jogador do empréstimo:", error);
    } finally {
      closeModal();
    }
  };

  return (
    <Form
      onSubmit={handleReturn}
      className={Styles.container}
      style={{ flexDirection: "column" }}
    >
      <div style={{ marginBottom: "20px", width: "100%" }}>
        <SellFormField
          id="returnDate"
          name="Data de Retorno"
          icon={<BsCalendar2Event />}
          placeholder="Ex: 11/07"
          value={returnDate}
          onChange={(e) => setReturnDate(formatDateInputShort(e.target.value))}
        />
      </div>
      <ContainerButton>
        <Button
          width="normal"
          size="big"
          fontWeight="bold"
          radius="square"
          typeButton="primaryDelete"
          type="button"
          onClick={closeModal}
        >
          Cancelar
        </Button>
        <Button
          width="normal"
          size="big"
          fontWeight="bold"
          radius="square"
          typeButton="secondaryDelete"
          type="submit"
          style={{ backgroundColor: "#4CAF50", color: "#FFF" }}
        >
          Confirmar
        </Button>
      </ContainerButton>
    </Form>
  );
};

export default ReturnLoanConfirmModal;
