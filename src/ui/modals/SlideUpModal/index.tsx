import { ReactNode } from "react";
import Styles from "./SlideUpModal.module.css";

type SlideUpModalProps = {
  children: ReactNode;
};

const SlideUpModal = ({ children }: SlideUpModalProps) => {
  return (
    <div className={Styles.container}>
      <div className={Styles.scroll}>{children}</div>
    </div>
  );
};

export default SlideUpModal;
