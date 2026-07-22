import React from "react";
import InfoCard from "./InfoCard";
import ProfitDisplay from "./ProfitDisplay";

type ProfitInfoSectionProps = {
  buyValue: number;
  sellValue: number;
  currency?: string;
};

const ProfitInfoSection: React.FC<ProfitInfoSectionProps> = ({
  buyValue,
  sellValue,
  currency,
}) => (
  <InfoCard title="Lucro com o jogador">
    <ProfitDisplay
      isProfit
      buyValue={buyValue}
      sellValue={sellValue}
      textOne="Valor da venda"
      textTwo="Valor da compra"
      textTree="Lucro total"
      currency={currency}
    />
  </InfoCard>
);

export default ProfitInfoSection;
