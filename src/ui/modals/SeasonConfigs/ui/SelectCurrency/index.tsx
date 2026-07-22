import { Dispatch, SetStateAction } from "react";
import { Career } from "../../../../../common/interfaces/Career";
import Button from "../../../../../components/Button";
import Styles from "./SelectCurrency.module.css";
import { useSelectCurrency } from "./hooks/useSelectCurrency";
import { CURRENCY_OPTIONS } from "./constants/currencies";

type SelectCurrencyProps = {
  careerId: string;
  clubColor?: string;
  career: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  onClose: () => void;
};

export const SelectCurrency = ({
  clubColor,
  career,
  setSelectedCareer,
  onClose,
}: SelectCurrencyProps) => {
  const { isSaving, selectedCurrency, setSelectedCurrency, handleConfirm } =
    useSelectCurrency({
      career,
      setSelectedCareer,
      onClose,
    });

  return (
    <div
      className={Styles.container}
      style={
        {
          "--club-color": clubColor || "#ffffff",
        } as React.CSSProperties
      }
    >
      <div className={Styles.wrapper}>
        <div className={Styles.header}>
          <h2 className={Styles.title}>Selecionar Moeda</h2>
          <p className={Styles.subtitle}>
            Escolha a moeda padrão da sua carreira
          </p>
        </div>

        <div className={Styles.grid_scroll}>
          <div className={Styles.currency_grid}>
            {CURRENCY_OPTIONS.map((currency) => (
              <div
                key={currency.code}
                className={`${Styles.currency_card} ${
                  selectedCurrency === currency.code ? Styles.selected : ""
                }`}
                onClick={() => setSelectedCurrency(currency.code)}
              >
                <span className={Styles.currency_symbol}>
                  {currency.symbol}
                </span>
                <span className={Styles.currency_name}>{currency.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={Styles.footer}>
        <Button
          onClick={handleConfirm}
          disabled={isSaving}
          style={{
            backgroundColor: clubColor,
            color: "var(--blackColor)",
            border: `1px solid ${clubColor}`,
          }}
        >
          {isSaving ? "Salvando..." : "Confirmar Moeda"}
        </Button>
        <button type="button" onClick={onClose} className={Styles.back}>
          Voltar
        </button>
      </div>
    </div>
  );
};
