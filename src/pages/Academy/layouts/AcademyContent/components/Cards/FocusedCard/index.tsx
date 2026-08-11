import { IconType } from "react-icons";
import { BaseCard } from "../BaseCard";
import Styles from "./FocusedCard.module.css";
import React from "react";

type FocusedCardProps = {
  Icon?: IconType;
  iconNode?: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  disableAnimation?: boolean;
  sortOptions?: { value: string; label: string }[];
  currentSort?: string;
  onSortChange?: (value: string) => void;
  className?: string;
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
  className,
}: FocusedCardProps) => {
  return (
    <div
      className={`${Styles.activeViewContainer} ${disableAnimation ? Styles.noAnimation : ""} ${className || ""}`.trim()}
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
