import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useEditSquadPlayer } from "../../../../common/hooks/Players/UseEditSquadPlayer";
import { useForm } from "../../../../common/hooks/UseForm";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { formatDateInputShort } from "../../../../common/utils/Date";
import { formatDisplayValue } from "../../../../common/utils/FormatValue";
import { Field } from "../../../../components/FormSection";
import { BooleanValues, FormValues } from "../../types";
import { validateTransfer } from "../../validators/transferValidator";
import { validateLoan } from "../../validators/loanValidator";

type UseTransferFormProps = {
  careerId: string;
  season: ClubData;
  career: Career;
  player: Players;
  currentPlayers: Players[];
  handleGoBack: () => void;
};

export const useTransferForm = ({
  careerId,
  season,
  career,
  player,
  currentPlayers,
  handleGoBack,
}: UseTransferFormProps) => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "loan" ? 2 : 1;

  const [activeTab] = useState<number>(initialMode);
  const [isLoading, setIsLoading] = useState(false);

  const { formValues, setFormValues, handleInputChange } = useForm();
  const [booleanValues, setBooleanValues] = useState<BooleanValues>({
    isRetirement: false,
    isEndContract: false,
    isReturnLoan: false,
  });

  const { sellPlayer, loanPlayer, returnLoanPlayer } = useEditSquadPlayer({
    careerId,
    seasonId: season.id,
    playerId: player.id,
    currentPlayers,
    onPlayerEdited: handleGoBack,
    career,
    season,
  });

  useEffect(() => {
    if (player?.loan) {
      const lastContract = player.contract?.[player.contract.length - 1];
      if (lastContract) {
        setFormValues((prev) => ({
          ...prev,
          toClub: lastContract.leftClub || "",
          buyOption: lastContract.buyOptionValue
            ? formatDisplayValue(lastContract.buyOptionValue as number)
            : "",
          loanDuration: lastContract.loanDuration
            ? String(lastContract.loanDuration)
            : "",
          wagePercentage: lastContract.wagePercentage
            ? String(lastContract.wagePercentage)
            : "",
        }));
      }
    }
  }, [player, setFormValues]);

  const handleBooleanChangeWrapper = (id: string, value: boolean) => {
    setBooleanValues((prev) => {
      const newVals = { ...prev, [id]: value };
      if (id === "isRetirement" && value) newVals.isEndContract = false;
      if (id === "isEndContract" && value) newVals.isRetirement = false;
      return newVals;
    });
  };

  const handleCustomInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: Field,
  ) => {
    if (field.id === "dateExit") {
      e.target.value = formatDateInputShort(e.target.value);
    }
    handleInputChange(e, field);
  };

  const processTransfer = async () => {
    const { isValid, error, data } = validateTransfer(
      formValues as FormValues,
      booleanValues,
    );
    if (!isValid || !data) {
      alert(error);
      return;
    }
    await sellPlayer(data.sellValue, data.toClub, data.dateExit);
  };

  const processLoan = async () => {
    const { isValid, error, data } = validateLoan(
      formValues as FormValues,
      booleanValues,
    );
    if (!isValid || !data) {
      alert(error);
      return;
    }

    if (data.isReturning) {
      await returnLoanPlayer(data.dateLoan);
    } else {
      await loanPlayer(
        data.buyOption || "",
        data.toClub!,
        data.dateLoan,
        data.loanDuration!,
        data.wagePercentage!,
      );
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 1) {
        await processTransfer();
      } else {
        await processLoan();
      }
    } catch (error) {
      alert("Ocorreu um erro ao processar a negociação.");
      console.error("Erro: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navText =
    activeTab === 1
      ? "Confirmar Venda"
      : booleanValues.isReturnLoan
        ? "Retornar Jogador"
        : player.loan
          ? "Salvar Edição"
          : "Confirmar Empréstimo";

  return {
    activeTab,
    isLoading,
    formValues,
    booleanValues,
    navText,
    handleSave,
    handleCustomInputChange,
    handleBooleanChangeWrapper,
  };
};
