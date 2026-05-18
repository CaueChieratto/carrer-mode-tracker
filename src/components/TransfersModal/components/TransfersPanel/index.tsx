import { useMemo } from "react";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { formatDisplayValue } from "../../../../common/utils/FormatValue";
import {
  sortTransfersByValue,
  TransferEvent,
} from "./utils/sortTransfersByValue";
import { formatDateToLongBrazilian } from "./utils/formatDateToLongBrazilian";
import Styles from "./TransfersPanel.module.css";
import { OverflowText } from "../../../OverflowText";

type TransfersPanelProps = {
  title: string;
  players: Players[];
};

const TransfersPanel = ({ title, players }: TransfersPanelProps) => {
  const isArrival = title === "Chegadas";
  const transferType = isArrival ? "arrivals" : "exit";

  const transferEvents = useMemo(() => {
    const events: TransferEvent[] = [];

    players.forEach((player) => {
      if (!player.contract) return;

      player.contract.forEach((contract) => {
        const isValidForTab = isArrival
          ? !!contract.dataArrival || !!contract.fromClub
          : !!contract.dataExit || !!contract.leftClub;

        if (isValidForTab) {
          events.push({ player, contract });
        }
      });
    });

    return events;
  }, [players, isArrival]);

  const sortedEvents = sortTransfersByValue(transferEvents, transferType);

  return (
    <div className={Styles.container}>
      {sortedEvents.length === 0 ? (
        <p className={Styles.noTransfers}>
          Nenhuma transferência nesta temporada.
        </p>
      ) : (
        <ul className={Styles.list}>
          {sortedEvents.map(({ player, contract }, index) => {
            const club = isArrival ? contract.fromClub : contract.leftClub;
            const value = isArrival ? contract.buyValue : contract.sellValue;
            const date = isArrival ? contract.dataArrival : contract.dataExit;

            let displayValue = formatDisplayValue(value as number);

            if (isArrival) {
              if (value && (value as number) > 0) {
                displayValue = formatDisplayValue(value as number);
              } else if (contract.isLoan) {
                displayValue = "Empréstimo";
              } else if (contract.fromClub === "Passes Livres") {
                displayValue = "Custo Zero";
              } else if (contract.fromClub) {
                displayValue = "Fim do Empréstimo";
              }
            } else {
              if (value && (value as number) > 0) {
                displayValue = formatDisplayValue(value as number);
              } else if (contract.isLoan) {
                if (contract.fromClub && contract.leftClub) {
                  displayValue = "Fim do Empréstimo";
                } else {
                  displayValue = "Empréstimo";
                }
              } else if (
                contract.leftClub === "Aposentou" ||
                contract.leftClub === "Aposentadoria"
              ) {
                displayValue = "Aposentadoria";
              } else if (
                contract.leftClub === "Passes Livres" ||
                contract.leftClub === "Fim de Contrato"
              ) {
                displayValue = "Fim de Contrato";
              } else if (contract.leftClub) {
                displayValue = "Custo Zero";
              }
            }

            return (
              <li key={`${player.id}-${date}-${index}`} className={Styles.item}>
                <div className={Styles.playerInfo}>
                  <OverflowText
                    text={player.name}
                    className={Styles.playerName}
                  />

                  <OverflowText
                    text={`${isArrival ? "De:" : "Para:"} ${club || "-"}`}
                    className={Styles.club}
                  />
                </div>

                <div className={Styles.transferInfo}>
                  <span
                    className={Styles.value}
                    style={
                      isArrival ? { color: "#c81419" } : { color: "#0bb32a" }
                    }
                  >
                    {displayValue}
                  </span>
                  {date && (
                    <span className={Styles.date}>
                      {formatDateToLongBrazilian(date)}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TransfersPanel;
