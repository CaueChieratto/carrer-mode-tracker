import { Match } from "../../../../../../../AllMatchesTab/types/Match";

const parseDateObj = (date: string) => {
  const [day, month, year] = date.split("/").map(Number);
  return new Date(2000 + year, month - 1, day);
};

export const getLatestFinishedMatch = (matches: Match[]): Match | null => {
  const finished = matches.filter((m) => m.status === "FINISHED");

  if (!finished.length) return null;

  return finished.reduce((latest, current) => {
    return parseDateObj(current.date) > parseDateObj(latest.date)
      ? current
      : latest;
  });
};
