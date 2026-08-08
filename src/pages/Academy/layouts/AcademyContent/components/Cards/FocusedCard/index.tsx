import { IconType } from "react-icons";
import { BaseCard } from "../BaseCard";
import Styles from "./FocusedCard.module.css";

type FocusedCardProps = {
  Icon?: IconType;
  iconNode?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  disableAnimation?: boolean;
  sortOptions?: { value: string; label: string }[];
  currentSort?: string;
  onSortChange?: (value: string) => void;
};

export const FocusedCard = ({
  Icon,
  title,
  children,
  disableAnimation,
  iconNode,
  currentSort,
  onSortChange,
  sortOptions,
}: FocusedCardProps) => {
  return (
    <div
      className={`${Styles.activeViewContainer} ${disableAnimation ? Styles.noAnimation : ""}`}
    >
      <BaseCard
        Icon={Icon}
        iconNode={iconNode}
        title={title}
        sortOptions={sortOptions}
        currentSort={currentSort}
        onSortChange={onSortChange}
      >
        {children}
      </BaseCard>
    </div>
  );
};
