import { FaCheckCircle } from "react-icons/fa";
import Styles from "./GenericDetails.module.css";

type GenericDetailsProps = {
  modalText: string;
};

export const GenericDetails = ({ modalText }: GenericDetailsProps) => {
  return (
    <div className={Styles.socialCard}>
      <div className={Styles.statusIcon}>
        <FaCheckCircle />
      </div>
      <div className={Styles.genericText}>{modalText}</div>
    </div>
  );
};
