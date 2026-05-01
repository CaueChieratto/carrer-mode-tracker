export const getContractInMonths = (savedValue: number): number => {
  if (savedValue <= 10) return savedValue * 12;
  return savedValue;
};

export const formatContractDisplay = (savedValue: number): string => {
  const totalMonths = getContractInMonths(savedValue);

  if (totalMonths <= 0) return "Expirado";

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) return `${months}M.`;
  if (months === 0) return `${years}A.`;

  return `${years}A. ${months}M.`;
};
