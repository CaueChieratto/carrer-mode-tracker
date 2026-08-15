import Styles from "./GroupHeader.module.css";
import { FaTrophy, FaPencilAlt } from "react-icons/fa";

type GroupHeaderProps = {
  managerName: string;
  careersCount: number;
  startYear: number;
  endYear: number;
  totalTrophies: number;
  onOpenTrophies: () => void;
  onOpenEdit: () => void;
};

export const GroupHeader = ({
  managerName,
  careersCount,
  startYear,
  endYear,
  totalTrophies,
  onOpenTrophies,
  onOpenEdit,
}: GroupHeaderProps) => {
  return (
    <header className={Styles.header}>
      <div className={Styles.managerInfo}>
        <h2 className={Styles.managerName}>{managerName}</h2>
        <span className={Styles.metaInfo}>
          {careersCount} Carreiras • {startYear} - {endYear}
        </span>
      </div>
      <div className={Styles.headerActions}>
        <div className={Styles.totalTitles} onClick={onOpenTrophies}>
          <FaTrophy size={13} />
          <span>{totalTrophies}</span>
        </div>
        <button
          type="button"
          className={Styles.editBtn}
          aria-label="Editar save"
          onClick={onOpenEdit}
        >
          <FaPencilAlt size={14} />
        </button>
      </div>
    </header>
  );
};
