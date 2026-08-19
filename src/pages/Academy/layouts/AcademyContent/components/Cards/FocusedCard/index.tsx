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
  isCollapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
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
  isCollapsible,
  isExpanded,
  onToggle,
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
        isCollapsible={isCollapsible}
        isExpanded={isExpanded}
        onToggle={onToggle}
      >
        {children}
      </BaseCard>
    </div>
  );
};
