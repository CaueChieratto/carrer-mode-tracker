import { Players } from "../../../../../common/interfaces/playersInfo/players";

export const sortTransfersByValue = (
  players: Players[],
  type: "arrivals" | "exit",
) => {
  const isArrival = type === "arrivals";

  return [...players].sort((a, b) => {
    const contractA = a.contract[a.contract.length - 1];
    const contractB = b.contract[b.contract.length - 1];

    const valueA = isArrival ? contractA.buyValue : contractA.sellValue;
    const valueB = isArrival ? contractB.buyValue : contractB.sellValue;

    const numValueA = typeof valueA === "number" ? valueA : 0;
    const numValueB = typeof valueB === "number" ? valueB : 0;

    if (numValueB !== numValueA) {
      return numValueB - numValueA;
    }

    const dateA = isArrival ? contractA.dataArrival : contractA.dataExit;
    const dateB = isArrival ? contractB.dataArrival : contractB.dataExit;

    const timeA = dateA ? new Date(dateA).getTime() : 0;
    const timeB = dateB ? new Date(dateB).getTime() : 0;

    return timeB - timeA;
  });
};
