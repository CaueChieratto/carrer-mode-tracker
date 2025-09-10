// export const formatValue = (value: number | string): string => {
//   const num =
//     typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) : value;

//   if (isNaN(num) || num === 0) {
//     return "";
//   }

//   if (num >= 1000000) {
//     const millions = num / 1000000;
//     return `€${millions % 1 === 0 ? millions : millions.toFixed(1)}M`.replace(
//       ".",
//       ","
//     );
//   }
//   if (num >= 1000) {
//     const thousands = num / 1000;
//     return `€${
//       thousands % 1 === 0 ? thousands : thousands.toFixed(1)
//     }k`.replace(".", ",");
//   }
//   return `€${num}`;
// };

// export const parseValue = (value: string): number => {
//   if (!value || typeof value !== "string") return 0;

//   const cleaned = value
//     .toLowerCase()
//     .replace("€", "")
//     .replace(/\s/g, "")
//     .replace(",", ".");

//   const multipliers: { [key: string]: number } = {
//     k: 1000,
//     m: 1000000,
//     b: 1000000000,
//   };

//   const lastChar = cleaned.slice(-1);
//   const multiplier = multipliers[lastChar];

//   if (multiplier) {
//     const numPart = parseFloat(cleaned.slice(0, -1));
//     return isNaN(numPart) ? 0 : numPart * multiplier;
//   }

//   const finalNumber = parseFloat(cleaned);
//   return isNaN(finalNumber) ? 0 : finalNumber;
// };

// export const formatDisplayValue = (value: number): string => {
//   if (isNaN(value) || value === null) {
//     return "";
//   }

//   if (Math.abs(value) >= 1000000000) {
//     const billions = value / 1000000000;
//     return `€${billions % 1 === 0 ? billions : billions.toFixed(1)}B`.replace(
//       ".",
//       ","
//     );
//   }
//   if (Math.abs(value) >= 1000000) {
//     const millions = value / 1000000;
//     return `€${millions % 1 === 0 ? millions : millions.toFixed(1)}M`.replace(
//       ".",
//       ","
//     );
//   }
//   if (Math.abs(value) >= 1000) {
//     const thousands = value / 1000;
//     return `€${
//       thousands % 1 === 0 ? thousands : thousands.toFixed(1)
//     }k`.replace(".", ",");
//   }

//   return `€${value}`;
// };

export const formatValue = (value: number | string): string => {
  const num =
    typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) : value;

  if (isNaN(num) || num === 0) {
    return "";
  }

  if (num >= 1000000) {
    const millions = num / 1000000;
    return `€${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
  }
  if (num >= 1000) {
    const thousands = num / 1000;
    return `€${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}k`;
  }
  return `€${num}`;
};

export const parseValue = (value: string): number => {
  if (!value || typeof value !== "string") return 0;

  const cleaned = value
    .toLowerCase()
    .replace("€", "")
    .replace(/\s/g, "")
    .replace(",", ".");

  const multipliers: { [key: string]: number } = {
    k: 1000,
    m: 1000000,
    b: 1000000000,
  };

  const lastChar = cleaned.slice(-1);
  const multiplier = multipliers[lastChar];

  if (multiplier) {
    const numPart = parseFloat(cleaned.slice(0, -1));
    return isNaN(numPart) ? 0 : numPart * multiplier;
  }

  const finalNumber = parseFloat(cleaned);
  return isNaN(finalNumber) ? 0 : finalNumber;
};

export const formatDisplayValue = (value: number): string => {
  if (isNaN(value) || value === null) {
    return "";
  }

  if (Math.abs(value) >= 1000000000) {
    const billions = value / 1000000000;
    return `€${billions % 1 === 0 ? billions : billions.toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1000000) {
    const millions = value / 1000000;
    return `€${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    const thousands = value / 1000;
    return `€${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}k`;
  }

  return `€${value}`;
};
