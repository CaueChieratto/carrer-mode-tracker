import React from "react";
import { BiRefresh } from "react-icons/bi";
import { GiMoneyStack, GiPoliceBadge } from "react-icons/gi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { brasilDatePlaceholder } from "../../../../../../common/utils/Date";
import { formatDisplayValue } from "../../../../../../common/utils/FormatValue";
import InfoCard from "./InfoCard";
import InfoItem from "./InfoItem";
import InfoRow from "./InfoRow";

type TransactionInfoSectionProps = {
  title: string;
  clubLabel: string;
  club: string;
  valueLabel: string;
  value: number | string;
  ageLabel: string;
  age: number;
  dateLabel: string;
  date: Date | null;
  color: string;
  currency?: string;
};

const TransactionInfoSection: React.FC<TransactionInfoSectionProps> = ({
  title,
  clubLabel,
  club,
  valueLabel,
  value,
  ageLabel,
  age,
  dateLabel,
  date,
  color,
  currency,
}) => {
  const displayValue =
    typeof value === "number" ? formatDisplayValue(value, currency) : value;

  return (
    <InfoCard title={title}>
      <InfoRow>
        <InfoItem label={clubLabel} value={club} icon={<GiPoliceBadge />} />
        <InfoItem
          label={valueLabel}
          value={displayValue}
          icon={<GiMoneyStack />}
          color={color}
        />
        <InfoItem label={ageLabel} value={age} icon={<BiRefresh />} />
        {date && (
          <InfoItem
            label={dateLabel}
            value={brasilDatePlaceholder(new Date(date))}
            icon={<RiCalendarScheduleLine />}
          />
        )}
      </InfoRow>
    </InfoCard>
  );
};

export default TransactionInfoSection;
