type FormatStatValueParams = {
  value: number;
  isPercentage?: boolean;
  suffix?: string;
};

export function formatStatValue({
  value,
  isPercentage,
  suffix = "",
}: FormatStatValueParams): string {
  if (isPercentage) return `${value}%`;
  return `${value}${suffix}`;
}
