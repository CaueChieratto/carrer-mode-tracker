import React from "react";
import { BiRefresh } from "react-icons/bi";
import { GiMoneyStack, GiPoliceBadge } from "react-icons/gi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { brasilDatePlaceholder } from "../../../common/utils/Date";
import { formatDisplayValue } from "../../../common/utils/FormatValue";
import InfoCard from "../../InfoCard";
import InfoItem from "../../InfoItem";
import InfoRow from "../../InfoRow";
import { transactionConfig } from "../constants/TransactionConfig";

type TransactionInfoSectionProps = {
  type: "buy" | "sell";
  club: string;
  value: number;
  age: number;
  date: Date | null;
};

const TransactionInfoSection: React.FC<TransactionInfoSectionProps> = ({
  type,
  club,
  value,
  age,
  date,
}) => {
  const config = transactionConfig[type];

  return (
    <InfoCard title={config.title} color={config.color}>
      <InfoRow>
        <InfoItem
          label={config.clubLabel}
          value={club}
          icon={<GiPoliceBadge />}
        />
        <InfoItem
          label={config.valueLabel}
          value={formatDisplayValue(value)}
          icon={<GiMoneyStack />}
          color={config.color}
        />
        <InfoItem label={config.ageLabel} value={age} icon={<BiRefresh />} />
        {date && (
          <InfoItem
            label={config.dateLabel}
            value={brasilDatePlaceholder(new Date(date))}
            icon={<RiCalendarScheduleLine />}
          />
        )}
      </InfoRow>
    </InfoCard>
  );
};

export default TransactionInfoSection;
