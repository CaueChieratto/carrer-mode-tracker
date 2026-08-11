import { IconType } from "react-icons";
import Styles from "./BaseCard.module.css";
import CustomSelect from "../../../../../../../components/CustomSelect";
import React from "react";

type BaseCardProps = {
  Icon?: IconType;
  iconNode?: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sortOptions?: { value: string; label: string }[];
  currentSort?: string;
  onSortChange?: (value: string) => void;
};

export const BaseCard = ({
  Icon,
  iconNode,
  title,
  children,
  className,
  sortOptions,
  currentSort,
  onSortChange,
}: BaseCardProps) => {
  const hasSelect = sortOptions && onSortChange && currentSort;

  return (
    <div className={`${Styles.card} ${className || ""}`.trim()}>
      <div
        className={`${Styles.cardHeader} ${hasSelect ? Styles.cardHeaderWithSelect : ""}`}
      >
        <h2 className={Styles.h2}>
          {iconNode ? (
            <div>{iconNode}</div>
          ) : (
            <>{Icon && <Icon className={Styles.icon} />}</>
          )}
          {title}
        </h2>
        {hasSelect && (
          <CustomSelect
            name={`card-sort-${typeof title === "string" ? title : "card"}`}
            options={sortOptions.map((opt) => opt.label)}
            value={
              sortOptions.find((o) => o.value === currentSort)?.label || ""
            }
            onChange={(e) => {
              const selectedOption = sortOptions.find(
                (o) => o.label === e.target.value,
              );
              if (selectedOption) {
                onSortChange(selectedOption.value);
              }
            }}
            containerClassName={Styles.selectCompact}
          />
        )}
      </div>
      {children}
    </div>
  );
};
