import { Players } from "../../../common/interfaces/playersInfo/players";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsCalendar2Event } from "react-icons/bs";
import { GiPoliceBadge } from "react-icons/gi";
import { useSellPlayerForm } from "../../../common/hooks/Players/UseSellPlayerForm";
import SellFormField from "../../../components/SellFormField";
import SellPlayerInfos_Modal from "../../../components/SellPlayerInfos_Modal";
import Styles from "./SellPlayerModal.module.css";

type SellPlayerModalProps = {
  closeModal: () => void;
  onConfirm: (
    sellValue: string,
    toClub: string,
    dateExit: string
  ) => void | Promise<void>;
  player: Players;
  clubColor?: string;
  darkClubColor?: string;
};

const formFields = [
  {
    id: "toClub",
    name: "Clube de destino",
    icon: <GiPoliceBadge />,
    placeholder: "Ex: Barcelona",
  },
  {
    id: "sellValue",
    name: "Valor da venda",
    icon: <FaMoneyBillTransfer />,
    placeholder: "Ex: 150k, 50M",
  },
  {
    id: "dateExit",
    name: "Data da venda",
    icon: <BsCalendar2Event />,
    placeholder: "Ex: 11/07",
  },
];

const SellPlayerModal = ({
  closeModal,
  onConfirm,
  clubColor,
  darkClubColor,
  player,
}: SellPlayerModalProps) => {
  const { sellValue, toClub, dateExit, handleConfirm, handleInputChange } =
    useSellPlayerForm({ onConfirm, closeModal });

  const fieldValues: { [key: string]: string } = {
    sellValue,
    toClub,
    dateExit,
  };

  return (
    <Form onSubmit={handleConfirm} className={Styles.form}>
      <SellPlayerInfos_Modal player={player} />
      <div className={Styles.container}>
        {formFields.map((field) => (
          <SellFormField
            key={field.id}
            id={field.id}
            name={field.name}
            icon={field.icon}
            placeholder={field.placeholder}
            value={fieldValues[field.id]}
            onChange={handleInputChange}
            clubColor={clubColor}
            darkClubColor={darkClubColor}
          />
        ))}
      </div>
      <Button
        radius="rounded"
        fontWeight="bold"
        fontSize="large"
        size="big"
        type="submit"
        isActive
        style={{
          backgroundColor: clubColor,
          border: `1px solid ${darkClubColor}`,
        }}
      >
        Confirmar Venda
      </Button>
      <Button
        radius="rounded"
        fontWeight="bold"
        fontSize="large"
        size="big"
        type="button"
        onClick={closeModal}
        style={{
          color: clubColor,
          border: `1px solid ${darkClubColor}`,
        }}
      >
        Cancelar
      </Button>
    </Form>
  );
};

export default SellPlayerModal;
