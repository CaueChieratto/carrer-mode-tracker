import { Players } from "../../common/interfaces/playersInfo/players";
import Styles from "./TransfersPanel.module.css";
import { formatDisplayValue } from "../../common/utils/FormatValue";
import { formatDateToLongBrazilian } from "../../common/utils/Date";
import { FaTrashAlt } from "react-icons/fa";
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
            const contract = player.contract[player.contract.length - 1];
            const club = isArrival ? contract.fromClub : contract.leftClub;
            const value = isArrival ? contract.buyValue : contract.sellValue;
            const date = isArrival ? contract.dataArrival : contract.dataExit;

            return (
              <li key={player.id} className={Styles.item}>
                <div className={Styles.playerInfo}>
                  <span className={Styles.playerName}>{player.name}</span>
                  <span className={Styles.club}>
                    {isArrival ? "De:" : "Para:"} {club}
                  </span>
                </div>
                <div className={Styles.icon}>
                  <FaTrashAlt />
                </div>
                <div className={Styles.transferInfo}>
                  <span
                    className={Styles.value}
                    style={
                      isArrival ? { color: "#c81419" } : { color: "#0bb32a" }
                    }
                  >
                    {formatDisplayValue(value as number)}
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
