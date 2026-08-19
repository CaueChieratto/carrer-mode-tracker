import Card from "../../../../../../../ui/Card";
import Styles from "../../components/PlayerStatsList/components/PlayerStats/PlayerStats.module.css";
import SkeletonStyles from "./PlayerStatsSkeleton.module.css";

type PlayerStatsSkeletonProps = {
  isGeralPage: boolean;
};

export const PlayerStatsSkeleton = ({
  isGeralPage,
}: PlayerStatsSkeletonProps) => {
  const sectionClass = isGeralPage ? Styles.section_geral : Styles.section;

  const columnsCount = isGeralPage ? 6 : 7;

  return (
    <Card className={Styles.card}>
      <section className={sectionClass}>
        <div
          className={`${SkeletonStyles.skeleton} ${SkeletonStyles.skeletonTitle}`}
        />
        {Array.from({ length: columnsCount }).map((_, i) => (
          <div
            key={`icon-${i}`}
            className={`${SkeletonStyles.skeleton} ${SkeletonStyles.skeletonIcon}`}
          />
        ))}
      </section>

      <section className={sectionClass}>
        <div
          className={`${SkeletonStyles.skeleton} ${SkeletonStyles.skeletonTitle}`}
          style={{ width: "40%" }}
        />
        {Array.from({ length: columnsCount - 1 }).map((_, i) => (
          <div
            key={`stat-${i}`}
            className={`${SkeletonStyles.skeleton} ${SkeletonStyles.skeletonStat}`}
          />
        ))}
        <div
          className={`${SkeletonStyles.skeleton} ${SkeletonStyles.skeletonRating}`}
        />
      </section>
    </Card>
  );
};
