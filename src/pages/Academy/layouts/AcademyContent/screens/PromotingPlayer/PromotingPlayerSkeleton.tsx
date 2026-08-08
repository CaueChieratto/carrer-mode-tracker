import {
  SkeletonCard,
  SkeletonInput,
  SkeletonRow,
  SkeletonButton,
} from "../../ui/SkeletonCard";

export const PromotingPlayerSkeleton = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SkeletonCard>
        <SkeletonRow>
          <SkeletonInput />
          <SkeletonInput />
        </SkeletonRow>
        <SkeletonButton />
      </SkeletonCard>
    </div>
  );
};
