import { MONTH_TO_NUM } from "../../../../../../../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/constants/MONTH_OPTIONS";

/**
 * @param month
 * @param isEurope
 */

export const getSeasonMonthWeight = (
  month: string | number,
  isEurope: boolean,
) => {
  if (month === "Tudo") return 0;

  const monthNum =
    typeof month === "string" && MONTH_TO_NUM[month]
      ? MONTH_TO_NUM[month]
      : Number(month);

  if (!isEurope) {
    return monthNum;
  }

  return monthNum >= 7 ? monthNum - 6 : monthNum + 6;
};
