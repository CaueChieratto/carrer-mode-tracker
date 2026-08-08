import { EXCEPTIONS } from "./constants/EXCEPTIONS";
import { SINGULAR_MAP } from "./constants/SINGULAR_MAP";

export const toSingular = (text: string): string => {
  if (!text.trim()) return "";

  return text
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();

      if (EXCEPTIONS.has(lower)) return word;

      const singular = SINGULAR_MAP[lower];

      if (!singular) return word;

      return word[0] === word[0].toUpperCase()
        ? singular.charAt(0).toUpperCase() + singular.slice(1)
        : singular;
    })
    .join(" ");
};
