import { Players } from "../../../../common/interfaces/playersInfo/players";
import { formatDisplayValue } from "../../../../common/utils/FormatValue";
import { sortTransfersByValue } from "./utils/sortTransfersByValue";
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
  const sortedPlayers = sortTransfersByValue(players, transferType);

  return (
    <div className={Styles.container}>
      {players.length === 0 ? (
        <p className={Styles.noTransfers}>
          Nenhuma transferência nesta temporada.
        </p>
      ) : (
        <ul className={Styles.list}>
          {sortedPlayers.map((player) => {
            const playerContract = player.contract || [];

            const relevantContract = isArrival
              ? [...playerContract].reverse().find((c) => c.fromClub) ||
                playerContract[playerContract.length - 1] ||
                {}
              : [...playerContract].reverse().find((c) => c.leftClub) ||
                playerContract[playerContract.length - 1] ||
                {};

            const club = isArrival
              ? relevantContract.fromClub
              : relevantContract.leftClub;

            const value = isArrival
              ? relevantContract.buyValue
              : relevantContract.sellValue;

            const date = isArrival
              ? relevantContract.dataArrival
              : relevantContract.dataExit;

            let displayValue = formatDisplayValue(value as number);

            if (isArrival) {
              if (!player.buy) {
                if (player.incomingLoan) {
                  displayValue = "Empréstimo";
                } else if (relevantContract.fromClub) {
                  displayValue = "Fim do Empréstimo";
                }
              }
            } else {
              if (player.sell && relevantContract.isLoan && value === 0) {
                displayValue = "Fim do Empréstimo";
              } else if (!player.sell) {
                if (player.loan) {
                  displayValue = "Empréstimo";
                } else if (relevantContract.leftClub) {
                  displayValue = "Fim do Empréstimo";
                }
              }
            }

            return (
              <li key={player.id} className={Styles.item}>
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
