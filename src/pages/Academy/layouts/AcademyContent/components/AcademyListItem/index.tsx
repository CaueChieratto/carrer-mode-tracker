import { OverflowText } from "../../../../../../components/OverflowText";
import Styles from "./AcademyListItem.module.css";

type AcademyListItemProps = {
  isSelected?: boolean;
  onClick?: () => void;
  iconNode: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  rightContent: React.ReactNode;
  className?: string;
  titleClassName?: string;
  infoClassName?: string;
  disableOverflow?: boolean;
};

export const AcademyListItem = ({
  isSelected,
  onClick,
  iconNode,
  title,
  subtitle,
  rightContent,
  className,
  titleClassName,
  infoClassName,
  disableOverflow,
}: AcademyListItemProps) => (
  <div
    className={`${Styles.listItem} ${isSelected ? Styles.selected : ""} ${className || ""}`.trim()}
    onClick={onClick}
  >
    <div className={Styles.wrapperLeft}>
      {iconNode}
      <div className={`${Styles.info} ${infoClassName || ""}`.trim()}>
        {disableOverflow ? (
          <span className={titleClassName || Styles.title}>{title}</span>
        ) : (
          <OverflowText
            text={title}
            className={titleClassName || Styles.title}
            widthReference={100}
          />
        )}
        <div className={Styles.subtitle}>{subtitle}</div>
      </div>
    </div>
    <div className={Styles.wrapperRight}>{rightContent}</div>
  </div>
);
