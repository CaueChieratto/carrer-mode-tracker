import React from "react";
import { GiMoneyStack, GiPoliceBadge } from "react-icons/gi";
import { BiRefresh } from "react-icons/bi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { Players } from "../../common/interfaces/playersInfo/players";
import { formatDisplayValue } from "../../common/utils/FormatValue";
import { brasilDatePlaceholder } from "../../common/utils/Date";
import Styles from "./InfoPlayerTab.module.css";
import InfoCard from "../InfoCard";
import InfoItem from "../InfoItem";
import InfoRow from "../InfoRow";
import ProfitDisplay from "../ProfitDisplay";
import { Career } from "../../common/interfaces/Career";

type InfoPlayerTabProps = {
  player?: Players;
  career: Career;
};

const InfoPlayerTab: React.FC<InfoPlayerTabProps> = ({ player, career }) => {
  if (!player || !player.contract || player.contract.length === 0) {
    return (
      <div className={Styles.card}>
        <p>Não há informações de contrato para este jogador.</p>
      </div>
    );
  }

  const latestContract = player.contract[player.contract.length - 1];
  const { buyValue, fromClub, dataArrival, sellValue, leftClub, dataExit } =
    latestContract;

  const numericBuyValue = Number(buyValue);

  const getPlayerAgeForTransaction = (transactionDate: Date | null) => {
    if (!transactionDate) return player.age;

    const transactionYear = transactionDate.getFullYear();
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

  return (
    <>
      {numericBuyValue > 0 && (
        <InfoCard title="Informações da compra" color="#c81419ff">
          <InfoRow>
            <InfoItem
              label="Último clube"
              value={fromClub}
              icon={<GiPoliceBadge />}
            />
            <InfoItem
              label="Valor da compra"
              value={formatDisplayValue(numericBuyValue)}
              icon={<GiMoneyStack />}
              color="#c81419ff"
            />
            <InfoItem
              label="Idade da compra"
              value={getPlayerAgeForTransaction(dataArrival)}
              icon={<BiRefresh />}
            />
            {dataArrival && (
              <InfoItem
                label="Data da compra"
                value={brasilDatePlaceholder(new Date(dataArrival))}
                icon={<RiCalendarScheduleLine />}
              />
            )}
          </InfoRow>
        </InfoCard>
      )}

      {sellValue > 0 && (
        <InfoCard title="Informações da venda" color="#0bb32aff">
          <InfoRow>
            <InfoItem
              label="Clube que comprou"
              value={leftClub}
              icon={<GiPoliceBadge />}
            />
            <InfoItem
              label="Valor da venda"
              value={formatDisplayValue(sellValue)}
              icon={<GiMoneyStack />}
              color="#0bb32aff"
            />
            <InfoItem
              label="Idade na venda"
              value={getPlayerAgeForTransaction(dataExit ?? null)}
              icon={<BiRefresh />}
            />
            {dataExit && (
              <InfoItem
                label="Data da venda"
                value={brasilDatePlaceholder(new Date(dataExit))}
                icon={<RiCalendarScheduleLine />}
              />
            )}
          </InfoRow>
        </InfoCard>
      )}

      {numericBuyValue > 0 && sellValue > 0 && (
        <InfoCard title="Lucro com o jogador" color="#333">
          <ProfitDisplay buyValue={numericBuyValue} sellValue={sellValue} />
        </InfoCard>
      )}
    </>
  );
};

export default InfoPlayerTab;
