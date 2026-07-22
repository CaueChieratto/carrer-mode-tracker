import { useMemo } from "react";
import { Career } from "../../../../../../common/interfaces/Career";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";

export const usePlayerInfo = (player?: Players, career?: Career) => {
  const getPlayerAgeForTransaction = (transactionDate: Date | null) => {
    if (!transactionDate || !career || !player) return player?.age;
    const transactionYear = new Date(transactionDate).getFullYear();
    const season = career.clubData.find((s) => {
      const seasonYear =
        new Date(career.createdAt).getFullYear() + s.seasonNumber - 1;
      return seasonYear === transactionYear;
    });

    if (season) {
      const playerInSeason = season.players.find((p) => p.id === player.id);
      return playerInSeason ? playerInSeason.age : player.age;
    }
    return player.age;
  };

  const transactions = useMemo(() => {
    if (!player?.contract?.length) return [];

    return player.contract.map((contract) => {
      const numericBuyValue = Number(contract.buyValue) || 0;
      const numericSellValue = Number(contract.sellValue) || 0;

      let arrivalTitle = "Informações da compra";
      let arrivalValueLabel = "Valor da compra";
      let arrivalValueDisplay: string | number = numericBuyValue;

      if (numericBuyValue > 0) {
        arrivalTitle = "Informações da compra";
        arrivalValueLabel = "Valor da compra";
      } else if (contract.isLoan) {
        arrivalTitle = "Informações do empréstimo";
        arrivalValueLabel = "Tipo de transação";
        arrivalValueDisplay = "Empréstimo";
      } else if (contract.fromClub === "Passes Livres") {
        arrivalTitle = "Informações da contratação";
        arrivalValueLabel = "Tipo de transação";
        arrivalValueDisplay = "Custo Zero";
      } else if (contract.fromClub) {
        arrivalTitle = "Informações do retorno";
        arrivalValueLabel = "Tipo de transação";
        arrivalValueDisplay = "Fim do Empréstimo";
      }

      let exitTitle = "Informações da venda";
      let exitValueLabel = "Valor da venda";
      let exitValueDisplay: string | number = numericSellValue;

      if (numericSellValue > 0) {
        exitTitle = "Informações da venda";
        exitValueLabel = "Valor da venda";
      } else if (contract.isLoan) {
        if (contract.fromClub && contract.leftClub) {
          exitTitle = "Informações do fim do empréstimo";
          exitValueLabel = "Tipo de transação";
          exitValueDisplay = "Fim do Empréstimo";
        } else {
          exitTitle = "Informações do empréstimo";
          exitValueLabel = "Tipo de transação";
          exitValueDisplay = "Empréstimo";
        }
      } else if (
        contract.leftClub === "Aposentou" ||
        contract.leftClub === "Aposentadoria"
      ) {
        exitTitle = "Informações da aposentadoria";
        exitValueLabel = "Tipo de transação";
        exitValueDisplay = "Aposentadoria";
      } else if (
        contract.leftClub === "Passes Livres" ||
        contract.leftClub === "Fim de Contrato"
      ) {
        exitTitle = "Informações do fim de contrato";
        exitValueLabel = "Tipo de transação";
        exitValueDisplay = "Fim de Contrato";
      } else if (contract.leftClub) {
        exitTitle = "Informações da saída";
        exitValueLabel = "Tipo de transação";
        exitValueDisplay = "Custo Zero";
      }

      return {
        ...contract,
        numericBuyValue,
        numericSellValue,
        hasBeenBought: !!contract.fromClub,
        hasBeenSold: !!contract.leftClub,
        arrivalTitle,
        arrivalValueLabel,
        arrivalValueDisplay,
        exitTitle,
        exitValueLabel,
        exitValueDisplay,
      };
    });
  }, [player]);

  return {
    player,
    career,
    transactions,
    getPlayerAgeForTransaction,
  };
};
