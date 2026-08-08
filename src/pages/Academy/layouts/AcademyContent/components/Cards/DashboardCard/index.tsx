import { IconType } from "react-icons";
import { FaChevronRight } from "react-icons/fa";
import { BaseCard } from "../BaseCard";
import Styles from "./DashboardCard.module.css";
import Button from "../../../../../../../components/Button";

type DashboardCardProps = {
  Icon: IconType;
  title: string;
  children: React.ReactNode;
  className?: string;
  actionText?: string;
  onActionClick?: () => void;
  sortOptions?: { value: string; label: string }[];
  currentSort?: string;
  onSortChange?: (value: string) => void;
};

export const DashboardCard = ({
  Icon,
  children,
  title,
  actionText,
  className,
  currentSort,
  sortOptions,
  onSortChange,
  onActionClick,
}: DashboardCardProps) => {
  return (
    <BaseCard
      Icon={Icon}
      title={title}
      className={className}
      sortOptions={sortOptions}
      currentSort={currentSort}
      onSortChange={onSortChange}
    >
      {children}

      {actionText && onActionClick && (
        <Button className={Styles.viewAllBtn} onClick={onActionClick}>
          {actionText} <FaChevronRight size={12} />
        </Button>
      )}
    </BaseCard>
  );
};
