import { Players } from "../../../common/interfaces/playersInfo/players";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import { useSellPlayerForm } from "../../../common/hooks/Players/UseSellPlayerForm";
import SellFormField from "../../../components/SellFormField";
import SellPlayerInfos_Modal from "../../../components/SellPlayerInfos_Modal";
import Styles from "./SellPlayerModal.module.css";
import { getSellOrLoanFormFields } from "../../../common/constants/SellPlayerFormFields";
import { brasilDatePlaceholderShort } from "../../../common/utils/Date";
import { formatDisplayValue } from "../../../common/utils/FormatValue";

type SellPlayerModalProps = {
  closeModal: () => void;
  onConfirm: (
    sellValue: string,
    toClub: string,
    dateExit: string,
    loanDuration?: string,
    wagePercentage?: string,
  ) => void | Promise<void>;
  player: Players;
  clubColor?: string;
  darkClubColor?: string;
  isLoan?: boolean;
};

const SellPlayerModal = ({
  closeModal,
  onConfirm,
  clubColor,
  darkClubColor,
  player,
  isLoan,
}: SellPlayerModalProps) => {
  const isAlreadyLoaned = isLoan && player.loan;
  const lastContract = player.contract?.[player.contract.length - 1];

  const getExitDate = (date?: Date | null) => {
    if (!date) return "";
    return brasilDatePlaceholderShort(new Date(date));
  };

  const initialValues =
    isAlreadyLoaned && lastContract
      ? {
          toClub: lastContract.leftClub || "",
          sellValue: lastContract.buyOptionValue
            ? formatDisplayValue(lastContract.buyOptionValue as number)
            : "",
          dateExit: getExitDate(lastContract.dataExit),
          loanDuration: lastContract.loanDuration?.toString() || "",
          wagePercentage: lastContract.wagePercentage?.toString() || "",
        }
      : undefined;

  const {
    sellValue,
    toClub,
    dateExit,
    loanDuration,
    wagePercentage,
    handleConfirm,
    handleInputChange,
  } = useSellPlayerForm({ isLoan, onConfirm, closeModal, initialValues });

  const fieldValues: { [key: string]: string } = {
    sellValue,
    toClub,
    dateExit,
    loanDuration,
    wagePercentage,
  };

  const formRows = getSellOrLoanFormFields(isLoan);

  return (
    <Form onSubmit={handleConfirm} className={Styles.form}>
      <SellPlayerInfos_Modal player={player} />

      <div className={Styles.container}>
        {formRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{ display: "flex", gap: "10px", width: "100%" }}
          >
            {row.map((field) => (
              <div key={field.id} style={{ flex: 1 }}>
                <SellFormField
                  id={field.id}
                  name={field.name}
                  icon={field.icon}
                  placeholder={field.placeholder}
                  value={fieldValues[field.id] || ""}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
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
        {isLoan ? "Confirmar Empréstimo" : "Confirmar Venda"}
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
