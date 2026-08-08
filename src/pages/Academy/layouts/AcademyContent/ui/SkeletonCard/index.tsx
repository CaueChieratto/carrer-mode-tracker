import Styles from "./SkeletonCard.module.css";

export const SkeletonItem = ({ index = 0 }: { index?: number }) => (
  <div
    className={Styles.skeletonItem}
    style={{ opacity: Math.max(0.3, 1 - index * 0.25) }}
  ></div>
);

export const SkeletonInput = ({ height }: { height?: string }) => (
  <div className={Styles.skeletonInput} style={{ height }}></div>
);

export const SkeletonRow = ({ children }: { children: React.ReactNode }) => (
  <div className={Styles.skeletonRow}>{children}</div>
);

export const SkeletonButton = () => (
  <div className={Styles.skeletonButton}></div>
);

type SkeletonCardProps = {
  children: React.ReactNode;
};

export const SkeletonCard = ({ children }: SkeletonCardProps) => {
  return (
    <div className={Styles.skeletonCard}>
      <div className={Styles.skeletonHeader}>
        <div className={Styles.skeletonIcon}></div>
        <div className={Styles.skeletonTitle}></div>
      </div>
      <div className={Styles.skeletonContent}>{children}</div>
    </div>
  );
};
