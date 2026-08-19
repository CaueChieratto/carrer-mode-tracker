import Styles from "./PlayerSeasonSkeleton.module.css";

type PlayerSeasonSkeletonProps = {
  count: number;
};

export const PlayerSeasonSkeleton = ({ count }: PlayerSeasonSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={Styles.card}>
          <div className={Styles.header}>
            <div className={`${Styles.skeleton} ${Styles.badge}`} />
            <div className={`${Styles.skeleton} ${Styles.title}`} />
          </div>

          {Array.from({ length: 2 }).map((_, rowIdx) => (
            <div key={rowIdx} className={Styles.section}>
              <div className={`${Styles.skeleton} ${Styles.cellFirst}`} />
              <div className={`${Styles.skeleton} ${Styles.cell}`} />
              <div className={`${Styles.skeleton} ${Styles.cell}`} />
              <div className={`${Styles.skeleton} ${Styles.cell}`} />
              <div className={`${Styles.skeleton} ${Styles.cell}`} />
              <div className={`${Styles.skeleton} ${Styles.cell}`} />
              <div className={`${Styles.skeleton} ${Styles.cell}`} />
            </div>
          ))}

          <div className={Styles.totalRow}>
            <div className={`${Styles.skeleton} ${Styles.titleBottom}`} />
            <div className={Styles.totalIconsContainer}>
              <div className={`${Styles.skeleton} ${Styles.totalIcon}`} />
              <div className={`${Styles.skeleton} ${Styles.totalIcon}`} />
              <div className={`${Styles.skeleton} ${Styles.totalIcon}`} />
              <div className={`${Styles.skeleton} ${Styles.totalIcon}`} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
