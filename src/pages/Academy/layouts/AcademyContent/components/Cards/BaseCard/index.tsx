import { IconType } from "react-icons";
import Styles from "./BaseCard.module.css";
import CustomSelect from "../../../../../../../components/CustomSelect";
import React, { useEffect, useRef, useState } from "react";
import { OverflowText } from "../../../../../../../components/OverflowText";

type BaseCardProps = {
  Icon?: IconType;
  iconNode?: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sortOptions?: { value: string; label: string }[];
  currentSort?: string;
  onSortChange?: (value: string) => void;
  itemCount?: number;
};

export const BaseCard = ({
  Icon,
  iconNode,
  title,
  children,
  className,
  sortOptions,
  currentSort,
  itemCount,
  onSortChange,
}: BaseCardProps) => {
  const hasSelect = sortOptions && onSortChange && currentSort;

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSelectOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        selectWrapperRef.current &&
        !selectWrapperRef.current.contains(e.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSelectOpen]);

  return (
    <div
      className={`${Styles.card} ${className || ""}`.trim()}
      data-few-items={
        itemCount !== undefined && itemCount < 2 ? "true" : "false"
      }
      data-select-open={isSelectOpen ? "true" : "false"}
    >
      <div
        className={`${Styles.cardHeader} ${hasSelect ? Styles.cardHeaderWithSelect : ""}`}
      >
        <h2 className={Styles.h2}>
          {iconNode ? (
            <div>{iconNode}</div>
          ) : (
            <>{Icon && <Icon className={Styles.icon} />}</>
          )}

          {typeof title === "string" ? (
            <div className={Styles.titleWrapper}>
              <OverflowText text={title} />
            </div>
          ) : (
            title
          )}
        </h2>
        {hasSelect && (
          <div
            ref={selectWrapperRef}
            onClick={() => setIsSelectOpen((prev) => !prev)}
          >
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
                setIsSelectOpen(false);
              }}
              containerClassName={Styles.selectCompact}
            />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
