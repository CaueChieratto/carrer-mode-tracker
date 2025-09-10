import Styles from "../../components/Button/Button.module.css";

export const FONT_SIZES = ["medium", "large"] as const;
export const SHADOW = ["no", "yes"] as const;
export const FONT_WEIGHTS = ["light", "bold"] as const;
export const SIZES = ["normal", "big", "small"] as const;
export const WIDTH = ["normal", "big"] as const;
export const RADII = ["square", "rounded", "default", "moreRounded"] as const;
export const ANIMATIONS = ["none", "active"] as const;
export const GAP = ["normal", "gap"] as const;
export const TYPE_BUTTON = [
  "primary",
  "secondary",
  "primaryDelete",
  "secondaryDelete",
  "transparent",
  "addPlayer",
  "default",
] as const;

export type FontSize = (typeof FONT_SIZES)[number];
export type Shadow = (typeof SHADOW)[number];
export type FontWeight = (typeof FONT_WEIGHTS)[number];
export type Size = (typeof SIZES)[number];
export type Width = (typeof WIDTH)[number];
export type Radius = (typeof RADII)[number];
export type Animation = (typeof ANIMATIONS)[number];
export type Gap = (typeof GAP)[number];
export type TypeButton = (typeof TYPE_BUTTON)[number];

export const classMap = {
  fontSize: {
    medium: Styles.fontSizeMedium,
    large: Styles.fontSizeLarge,
  },
  shadow: {
    no: "",
    yes: Styles.shadow,
  },
  fontWeight: {
    light: Styles.fontWeightLight,
    bold: Styles.fontWeightBold,
  },
  size: {
    normal: Styles.normalWidth,
    big: Styles.sizeBig,
    small: Styles.sizeSmall,
  },
  width: {
    normal: Styles.sizeNormal,
    big: Styles.sizeBig,
  },
  radius: {
    square: Styles.radiusSquare,
    rounded: Styles.radiusRounded,
    default: Styles.radiusDefault,
    moreRounded: Styles.radiusMoreRounded,
  },
  animation: {
    none: Styles.animationNone,
    active: Styles.animationActive,
  },
  gap: {
    normal: Styles.normalGap,
    gap: Styles.gap,
  },
  typeButton: {
    primary: Styles.buttonPrimary,
    secondary: Styles.buttonSecondary,
    primaryDelete: Styles.buttonPrimaryDelete,
    secondaryDelete: Styles.buttonSecondaryDelete,
    addPlayer: Styles.buttonAddPlayer,
    transparent: Styles.buttonTransparent,
    default: Styles.buttonDefault,
  },
};
