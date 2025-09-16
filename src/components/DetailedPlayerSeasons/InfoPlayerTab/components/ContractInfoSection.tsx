import React from "react";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import InfoCard from "../../../InfoCard";
import ProfitDisplay from "../../../ProfitDisplay";

type ContractInfoSectionProps = {
  player: Players;
};

const ContractInfoSection: React.FC<ContractInfoSectionProps> = ({
  player,
}) => (
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

export default ContractInfoSection;
