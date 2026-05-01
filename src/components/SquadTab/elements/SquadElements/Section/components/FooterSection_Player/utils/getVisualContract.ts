import { Match } from "../../../../../../../AllMatchesTab/types/Match";
import { formatContractDisplay, getContractInMonths } from "./FormatContract";
import { getLatestFinishedMatch } from "./getLatestFinishedMatch";

export const getVisualContract = (
  contractTime: number,
  matches: Match[],
): string => {
  const latest = getLatestFinishedMatch(matches);

  if (!latest) return formatContractDisplay(contractTime);

  const originalMonths = getContractInMonths(contractTime);

  const [, month, yearShort] = latest.date.split("/").map(Number);
  const year = 2000 + yearShort;

  const seasonStartYear = month >= 6 ? year : year - 1;

  const baseIndex = seasonStartYear * 12 + 6;
  const currentIndex = year * 12 + month;

  const diffMonths = currentIndex - baseIndex;

  const remainingMonths = originalMonths - diffMonths;

  if (remainingMonths <= 0) return "Expirado";

  const years = Math.floor(remainingMonths / 12);
  const months = remainingMonths % 12;

  if (years === 0) return `${months}M.`;
  if (months === 0) return `${years}A.`;

  return `${years}A. ${months}M.`;
};
