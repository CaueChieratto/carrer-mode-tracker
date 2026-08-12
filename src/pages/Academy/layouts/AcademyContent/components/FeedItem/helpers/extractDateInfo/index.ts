import { getSeasonMonthWeight } from "../../../Player/components/PlayerDevelopment/utils/getSeasonMonthWeight";

export const extractDateInfo = (dateStr: string, isEurope: boolean) => {
  if (!dateStr)
    return {
      day: 0,
      month: 1,
      monthWeight: 0,
      formattedDate: "",
      year: new Date().getFullYear(),
    };
  try {
    let dayStr = "";
    let monthStr = "";
    let yearStr = "";

    if (dateStr.includes(" - ")) {
      const [datePart, seasonPart] = dateStr.split(" - ");
      const [d, m] = datePart.split("/");
      dayStr = d;
      monthStr = m;
      if (seasonPart.includes("/")) {
        const [startYY, endYY] = seasonPart.split("/");
        const monthNum = parseInt(m, 10);
        yearStr =
          isEurope && monthNum >= 7 ? startYY : isEurope ? endYY : startYY;
      } else {
        yearStr = seasonPart;
      }
    } else if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      dayStr = parts[0];
      monthStr = parts[1];
      yearStr = parts[2] || new Date().getFullYear().toString();
    }

    const day = parseInt(dayStr, 10) || 0;
    const month = parseInt(monthStr, 10) || 1;
    const monthWeight = getSeasonMonthWeight(month, isEurope);

    let rawYear = parseInt(yearStr, 10) || new Date().getFullYear();
    if (rawYear < 100) rawYear += 2000;

    const finalYear = String(rawYear).slice(-2);
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    return {
      day,
      month,
      monthWeight,
      formattedDate: `${formattedDay}/${formattedMonth}/${finalYear}`,
      year: rawYear,
    };
  } catch {
    return {
      day: 0,
      month: 1,
      monthWeight: 0,
      formattedDate: dateStr,
      year: new Date().getFullYear(),
    };
  }
};
