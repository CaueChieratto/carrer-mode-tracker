import { useMemo } from "react";

const hexToRgba = (hex: string, alpha: number = 1): string => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getLuminance = (hex?: string): number => {
  if (!hex) return 0;
  const color = hex.replace("#", "");
  if (color.length !== 6) return 0;

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

export function useClubColors(colors: string[] | string) {
  const colorInfo = useMemo(() => {
    const colorsArray = Array.isArray(colors) ? colors : [colors];
    const hexColor1 = colorsArray[0];

    const luminance1 = getLuminance(hexColor1);

    const defaultLightColor = "#52a383";
    const defaultDarkColor = "#256648";

    const clubColor =
      luminance1 > 180 ? defaultLightColor : hexColor1 || defaultLightColor;
    const darkClubColor =
      luminance1 > 180 ? defaultDarkColor : hexColor1 || defaultDarkColor;

    return {
      clubColor: hexToRgba(clubColor, 0.9),
      darkClubColor: darkClubColor,
    };
  }, [colors]);

  return colorInfo;
}
