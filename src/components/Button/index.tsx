import { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import {
  FontSize,
  FontWeight,
  Size,
  Radius,
  Animation,
  classMap,
  TypeButton,
  Width,
  Shadow,
  Gap,
} from "../../common/utils/Variants";
import classnames from "classnames";
import Styles from "./Button.module.css";

type ButtonProps = {
  children: ReactNode;
  isActive?: boolean;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  shadow?: Shadow;
  size?: Size;
  width?: Width;
  radius?: Radius;
  animation?: Animation;
  gap?: Gap;
  typeButton?: TypeButton;
  style?: CSSProperties;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  isActive = false,
  fontSize = "medium",
  fontWeight = "light",
  shadow = "no",
  size = "normal",
  width = "normal",
  radius = "default",
  animation = "none",
  gap = "normal",
  typeButton = "default",
  style,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classnames(
        Styles.button,
        classMap.fontSize[fontSize],
        classMap.fontWeight[fontWeight],
        classMap.shadow[shadow],
        classMap.size[size],
        classMap.size[width],
        classMap.radius[radius],
        classMap.animation[animation],
        classMap.gap[gap],
        classMap.typeButton[typeButton],
        {
          [Styles.active]: isActive,
        }
      )}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
