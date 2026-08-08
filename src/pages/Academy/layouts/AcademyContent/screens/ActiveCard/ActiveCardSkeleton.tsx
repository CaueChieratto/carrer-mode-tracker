import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";
import {
  SkeletonCard,
  SkeletonInput,
  SkeletonButton,
} from "../../ui/SkeletonCard";

export const ActiveCardSkeleton = () => {
  const { activeCardIndex, dashboardCards, selectedPlayer } =
    useAcademyContext();

  const activeCard =
    activeCardIndex !== null
      ? dashboardCards[activeCardIndex]
      : dashboardCards[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <SkeletonCard>{activeCard?.skeletonContent}</SkeletonCard>
      </div>
      {selectedPlayer && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <SkeletonCard>
            <SkeletonInput height="28px" />
            <SkeletonInput height="100px" />
            <SkeletonButton />
          </SkeletonCard>
        </div>
      )}
    </div>
  );
};
