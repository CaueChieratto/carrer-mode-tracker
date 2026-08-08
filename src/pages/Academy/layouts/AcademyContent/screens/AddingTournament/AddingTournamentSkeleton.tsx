import {
  SkeletonCard,
  SkeletonInput,
  SkeletonButton,
} from "../../ui/SkeletonCard";

export const AddingTournamentSkeleton = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SkeletonCard>
        <SkeletonInput />
        <SkeletonButton />
      </SkeletonCard>
    </div>
  );
};
