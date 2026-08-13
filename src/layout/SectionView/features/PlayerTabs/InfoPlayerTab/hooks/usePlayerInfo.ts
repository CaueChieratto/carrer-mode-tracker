import { useMemo } from "react";
import { Career } from "../../../../../../common/interfaces/Career";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { useLocation, useParams } from "react-router-dom";
import { getContinentByCountry } from "../../../../../../common/services/GetContinentByCountry";

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds?: number;
}

const isFirestoreTimestamp = (val: unknown): val is FirestoreTimestamp => {
  return typeof val === "object" && val !== null && "seconds" in val;
};

export const usePlayerInfo = (player?: Players, career?: Career) => {
  const location = useLocation();
  const { seasonId } = useParams<{ seasonId: string }>();
  const isNotSeason = location.pathname.includes("/Geral") || !seasonId;

  const getSeasonYear = (
    dateValue: unknown,
    isEurope: boolean,
  ): number | null => {
    if (!dateValue) return null;

    let d: Date | null = null;

    if (dateValue instanceof Date) {
      d = dateValue;
    } else if (isFirestoreTimestamp(dateValue)) {
      d = new Date(dateValue.seconds * 1000);
    } else if (typeof dateValue === "string") {
      if (dateValue.includes("/")) {
        const parts = dateValue.split("/");
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          let year = parseInt(parts[2], 10);
          if (year < 100) year += 2000;
          d = new Date(year, month, day);
        } else {
          return null;
        }
      } else {
        d = new Date(dateValue);
      }
    } else if (typeof dateValue === "number") {
      d = new Date(dateValue);
    }

    if (!d || isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = d.getMonth();

    if (isEurope) {
      return month <= 5 ? year - 1 : year;
    }

    return year;
  };

  const getPlayerAgeForTransaction = (transactionDate: unknown) => {
    if (!transactionDate || !career || !player) return player?.age;

    const isEurope = getContinentByCountry(career.nation) === "Europa";
    const txSeasonYear = getSeasonYear(transactionDate, isEurope);

    const season = career.clubData.find((s) => {
      const sYear =
        new Date(career.createdAt).getFullYear() + s.seasonNumber - 1;
      return sYear === txSeasonYear;
    });

    if (season) {
      const playerInSeason = season.players.find((p) => p.id === player.id);
      return playerInSeason ? playerInSeason.age : player.age;
    }
    return player.age;
  };

  const transactions = useMemo(() => {
    if (!player?.contract?.length || !career) return [];

    const currentSeason = career.clubData.find((s) => s.id === seasonId);
    const currentSeasonYear = currentSeason
      ? new Date(career.createdAt).getFullYear() +
        currentSeason.seasonNumber -
        1
      : null;

    const isEurope = getContinentByCountry(career.nation) === "Europa";

    const processedContracts = player.contract
      .map((contract) => {
        let showArrival = !!contract.fromClub;
        let showExit = !!contract.leftClub;

        if (!isNotSeason && currentSeasonYear !== null) {
          const arrivalYear = getSeasonYear(contract.dataArrival, isEurope);
          const exitYear = getSeasonYear(contract.dataExit, isEurope);

          const matchArrival =
            arrivalYear !== null ? arrivalYear === currentSeasonYear : true;
          const matchExit =
            exitYear !== null ? exitYear === currentSeasonYear : true;

          showArrival = showArrival && matchArrival;
          showExit = showExit && matchExit;
        }

        if (!showArrival && !showExit) return null;

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
          numericBuyValue: showArrival ? numericBuyValue : 0,
          numericSellValue: showExit ? numericSellValue : 0,
          hasBeenBought: showArrival,
          hasBeenSold: showExit,
          arrivalTitle,
          arrivalValueLabel,
          arrivalValueDisplay,
          exitTitle,
          exitValueLabel,
          exitValueDisplay,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);

    return processedContracts;
  }, [player, isNotSeason, seasonId, career]);

  return {
    player,
    career,
    transactions,
    getPlayerAgeForTransaction,
  };
};
