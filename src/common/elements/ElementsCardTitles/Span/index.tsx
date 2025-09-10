import { CSSProperties } from "react";
import Styles from "./Span.module.css";

type SpanProps = {
  style?: CSSProperties;
  seasons: string;
  deleteSeason: () => void;
};

export const Span = ({ style, seasons, deleteSeason }: SpanProps) => {
  return (
    <span className={Styles.span} style={style} onClick={deleteSeason}>
      {seasons}
    </span>
  );
};
