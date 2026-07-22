import React from "react";
import ContractInfoSection from "./components/ContractInfoSection";
import PlayerInfoSection from "./components/PlayerInfoSection";
import PlayerNotFound from "./components/PlayerNotFound";
import ProfitInfoSection from "./components/ProfitInfoSection";
import TransactionInfoSection from "./components/TransactionInfoSection";
import { usePlayerInfo } from "./hooks/usePlayerInfo";
import { Career } from "../../../../../common/interfaces/Career";
import { Players } from "../../../../../common/interfaces/playersInfo/players";

type InfoPlayerTabProps = {
  player?: Players;
  career: Career;
};

const InfoPlayerTab: React.FC<InfoPlayerTabProps> = ({ player, career }) => {
  const {
    numericBuyValue,
    numericSellValue,
    hasBeenBought,
    hasBeenSold,
    getPlayerAgeForTransaction,
    dataArrival,
    dataExit,
    fromClub,
    leftClub,
  } = usePlayerInfo(player, career);

  const currency = career.currency;

  if (!player) {
    return <PlayerNotFound />;
  }

  return (
    <>
      {!player.sell && (
        <>
          <PlayerInfoSection player={player} />
          <ContractInfoSection player={player} currency={currency} />
        </>
      )}
      {hasBeenBought && (
        <TransactionInfoSection
          type="buy"
          club={fromClub || ""}
          value={numericBuyValue}
          age={getPlayerAgeForTransaction(dataArrival || null) ?? player.age}
          date={dataArrival || null}
          currency={currency}
        />
      )}
      {hasBeenSold && (
        <TransactionInfoSection
          type="sell"
          club={leftClub || ""}
          value={numericSellValue}
          age={getPlayerAgeForTransaction(dataExit || null) ?? player.age}
          date={dataExit || null}
          currency={currency}
        />
      )}
      {hasBeenBought && hasBeenSold && (
        <ProfitInfoSection
          buyValue={numericBuyValue}
          sellValue={numericSellValue}
          currency={currency}
        />
      )}
    </>
  );
};

export default InfoPlayerTab;
