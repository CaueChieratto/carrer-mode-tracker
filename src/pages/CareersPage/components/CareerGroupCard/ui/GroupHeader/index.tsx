import Styles from "./GroupHeader.module.css";
import { FaTrophy, FaPencilAlt } from "react-icons/fa";
import { Career } from "../../../../../../common/interfaces/Career";
import { CrestStack } from "../CrestStack";

type GroupHeaderProps = {
  managerName: string;
  careers: Career[];
  careersCount: number;
  startYear: number;
  endYear: number;
  totalTrophies: number;
  onOpenEdit: () => void;
  onOpenTrophies: () => void;
};

export const GroupHeader = ({
  managerName,
  careers,
  careersCount,
  startYear,
  endYear,
  totalTrophies,
  onOpenEdit,
  onOpenTrophies,
}: GroupHeaderProps) => {
  return (
    <header className={Styles.header}>
      <div className={Styles.managerInfo}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CrestStack careers={careers} />
          <h2 className={Styles.managerName}>{managerName}</h2>
        </div>
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
