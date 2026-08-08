import { FaPen } from "react-icons/fa6";
import Styles from "./TournamentMatchHeader.module.css";

type TournamentMatchHeaderProps = {
  date?: string;
  status?: string;
  onEdit?: () => void;
};

export const TournamentMatchHeader = ({
  date,
  status,
  onEdit,
}: TournamentMatchHeaderProps) => {
  return (
    <div className={Styles.matchHeader}>
      <span className={Styles.matchDate}>{date}</span>
      {onEdit && (
        <button
          className={Styles.editButton}
          onClick={onEdit}
          aria-label="Editar partida"
        >
          <FaPen />
        </button>
      )}
      <div className={Styles.headerRight}>
        <span className={Styles.matchStatus}>{status}</span>
      </div>
    </div>
  );
};
