import React from "react";
import { FaCalendar } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import { GrMap } from "react-icons/gr";
import { FaTshirt } from "react-icons/fa";
import { GiPoliceBadge } from "react-icons/gi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";
import { BiRefresh } from "react-icons/bi";
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
  if (!player) {
    return (
      <div className={Styles.card}>
        <p>Jogador não encontrado.</p>
      </div>
    );
  }

  const latestContract =
    player.contract && player.contract.length > 0
      ? player.contract[player.contract.length - 1]
      : null;

  const { buyValue, fromClub, dataArrival, sellValue, leftClub, dataExit } =
    latestContract || {};

  const numericBuyValue = Number(buyValue) || 0;
  const numericSellValue = Number(sellValue) || 0;

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

  const hasBeenBought = !!fromClub;
  const hasBeenSold = !!leftClub;

  const renderPlayerInfo = () => (
    <InfoCard title="Informações do jogador" color="#010127">
      <InfoRow>
        <InfoItem
          label={player.nation}
          value={player.name}
          icon={<FaUserLarge />}
        />
        <InfoItem label={player.position} value={"Posição"} icon={<GrMap />} />
        <InfoItem label={"Idade"} value={player.age} icon={<FaCalendar />} />
        <InfoItem
          label={player.shirtNumber}
          value={"Número da camisa"}
          icon={<FaTshirt />}
        />
      </InfoRow>
    </InfoCard>
  );

  const renderContractInfo = () => (
    <InfoCard title="Informações do contrato" color="#010127">
      <ProfitDisplay
        playerValue={player.playerValue}
        salary={player.salary}
        contractTime={player.contractTime}
        textOne="Valor do jogador"
        textTwo="Salário semanal"
        textTree="Tempo de contrato"
      />
    </InfoCard>
  );

  const renderBuyInfo = () =>
    hasBeenBought ? (
      <InfoCard title="Informações da compra" color="#c81419ff">
        <InfoRow>
          <InfoItem
            label="Último clube"
            value={fromClub || ""}
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
            value={getPlayerAgeForTransaction(dataArrival || null)}
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
    ) : null;

  const renderSellInfo = () =>
    hasBeenSold ? (
      <InfoCard title="Informações da venda" color="#0bb32aff">
        <InfoRow>
          <InfoItem
            label="Clube que comprou"
            value={leftClub || ""}
            icon={<GiPoliceBadge />}
          />
          <InfoItem
            label="Valor da venda"
            value={formatDisplayValue(numericSellValue)}
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
    ) : null;

  const renderProfitInfo = () =>
    hasBeenBought && hasBeenSold ? (
      <InfoCard title="Lucro com o jogador" color="#010127">
        <ProfitDisplay
          isProfit
          buyValue={numericBuyValue}
          sellValue={numericSellValue}
          textOne="Valor da venda"
          textTwo="Valor da compra"
          textTree="Lucro total"
        />
      </InfoCard>
    ) : null;

  return (
    <>
      {!hasBeenBought && !player.sell && (
        <>
          {renderPlayerInfo()}
          {renderContractInfo()}
        </>
      )}

      {hasBeenBought && !player.sell && (
        <>
          {renderPlayerInfo()}
          {renderContractInfo()}
          {renderBuyInfo()}
        </>
      )}

      {!hasBeenBought && player.sell && renderSellInfo()}

      {hasBeenBought && player.sell && (
        <>
          {renderBuyInfo()}
          {renderSellInfo()}
          {renderProfitInfo()}
        </>
      )}
    </>
  );
};

export default InfoPlayerTab;
