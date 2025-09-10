import { FaFutbol } from "react-icons/fa";
import Styles from "./EmptyCareers.module.css";
import { ModalType } from "../../common/types/enums/ModalType";
import Button from "../../components/Button";

type EmptyCareersProps = {
  onOpenModal: (type: ModalType) => void;
};

const EmptyCareers = ({ onOpenModal }: EmptyCareersProps) => {
  return (
    <div className={Styles.container}>
      <div className={Styles.container_empty}>
        <FaFutbol className={Styles.icon} />
        <h2 className={Styles.h2}>Nenhuma carreira encontrada</h2>
        <p className={Styles.p}>
          Comece uma carreira e acompanhe suas estatisticas.
        </p>
        <Button
          className={Styles.button}
          onClick={() => onOpenModal(ModalType.NEW_CAREER)}
        >
          Nova Carreira
        </Button>
      </div>
    </div>
  );
};

export default EmptyCareers;
