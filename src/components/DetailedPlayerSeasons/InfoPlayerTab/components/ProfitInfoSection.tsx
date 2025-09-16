import React from "react";
import InfoCard from "../../../InfoCard";
import ProfitDisplay from "../../../ProfitDisplay";

type ProfitInfoSectionProps = {
  buyValue: number;
  sellValue: number;
};

const ProfitInfoSection: React.FC<ProfitInfoSectionProps> = ({
  buyValue,
  sellValue,
}) => (
  <InfoCard title="Lucro com o jogador" color="#010127">
    <ProfitDisplay
      isProfit
      buyValue={buyValue}
      sellValue={sellValue}
      textOne="Valor da venda"
      textTwo="Valor da compra"
      textTree="Lucro total"
    />
  </InfoCard>
);

export default ProfitInfoSection;
