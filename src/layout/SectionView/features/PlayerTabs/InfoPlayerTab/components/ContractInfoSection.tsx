import React from "react";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import InfoCard from "./InfoCard";
import ProfitDisplay from "./ProfitDisplay";

type ContractInfoSectionProps = {
  player: Players;
  currency?: string;
};

const ContractInfoSection: React.FC<ContractInfoSectionProps> = ({
  player,
  currency,
}) => (
  <InfoCard title="Informações do contrato">
    <ProfitDisplay
      playerValue={player.playerValue}
      salary={player.salary}
      contractTime={player.contractTime}
      currency={currency}
      textOne="Valor do jogador"
      textTwo="Salário semanal"
      textTree="Tempo de contrato"
    />
  </InfoCard>
);

export default ContractInfoSection;
