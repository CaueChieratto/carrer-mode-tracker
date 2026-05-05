import { Players } from "../../common/interfaces/playersInfo/players";
import Styles from "./TransfersPanel.module.css";
import { formatDisplayValue } from "../../common/utils/FormatValue";
import { formatDateToLongBrazilian } from "../../common/utils/Date";
import { sortTransfersByValue } from "../../common/utils/Sorts";

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
              if (relevantContract.isLoan && relevantContract.fromClub) {
                displayValue = "Empréstimo";
              } else if (
                !relevantContract.isLoan &&
                relevantContract.fromClub &&
                !player.buy
              ) {
                displayValue = "Fim do Empréstimo";
              }
            } else {
              if (
                relevantContract.isLoan &&
                relevantContract.fromClub &&
                relevantContract.leftClub
              ) {
                displayValue = "Fim do Empréstimo";
              } else if (relevantContract.isLoan && relevantContract.leftClub) {
                displayValue = "Empréstimo";
              } else if (
                !relevantContract.isLoan &&
                relevantContract.leftClub &&
                !player.sell
              ) {
                displayValue = "Fim do Empréstimo";
              }
            }

            return (
              <li key={player.id} className={Styles.item}>
                <div className={Styles.playerInfo}>
                  <span className={Styles.playerName}>{player.name}</span>
                  <span className={Styles.club}>
                    {isArrival ? "De:" : "Para:"} {club || "-"}
                  </span>
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
