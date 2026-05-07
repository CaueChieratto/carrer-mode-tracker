import { useEffect, useRef, useState } from "react";
import Styles from "./OverflowText.module.css";

type OverflowTextProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  direction?: "left" | "right";
};

export const OverflowText = ({
  text,
  className = "",
  style,
  direction = "left",
}: OverflowTextProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = textRef.current;

    if (!el || !el.parentElement) return;

    const parentWidth = el.parentElement.clientWidth;
    const contentWidth = el.scrollWidth;

    const buffer = 15;
    const totalWidth = contentWidth + buffer;

    const isOverflow = contentWidth > parentWidth;

    setIsOverflowing(isOverflow);

    if (isOverflow) {
      const distance = totalWidth - parentWidth;

      el.style.setProperty("--scroll-distance", `${distance}px`);
      el.style.setProperty("--dynamic-min-width", `${totalWidth}px`);
    } else {
      el.style.setProperty("--dynamic-min-width", "100%");
    }
  }, [text]);

  return (
    <span
      ref={textRef}
      style={style}
      className={`${Styles.baseOverflow} ${className} ${
        isOverflowing
          ? direction === "right"
            ? Styles.marqueeRight
            : Styles.marqueeLeft
          : ""
      }`.trim()}
    >
      {text}
    </span>
  );
};
