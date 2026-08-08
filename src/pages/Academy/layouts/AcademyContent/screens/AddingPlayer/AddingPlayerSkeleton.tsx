import {
  SkeletonCard,
  SkeletonInput,
  SkeletonRow,
  SkeletonButton,
} from "../../ui/SkeletonCard";

export const AddingPlayerSkeleton = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SkeletonCard>
        <SkeletonInput />
        <SkeletonRow>
          <SkeletonInput />
          <SkeletonInput />
        </SkeletonRow>
        <SkeletonRow>
          <SkeletonInput />
          <SkeletonInput />
        </SkeletonRow>
        <SkeletonRow>
          <SkeletonInput />
          <SkeletonInput />
        </SkeletonRow>
        <SkeletonRow>
          <SkeletonInput />
          <SkeletonInput />
        </SkeletonRow>
        <SkeletonInput />
        <SkeletonInput height="80px" />
        <SkeletonButton />
      </SkeletonCard>
    </div>
  );
};
