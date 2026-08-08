import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";
import { ActiveCardSkeleton } from "./ActiveCardSkeleton";
import { ActiveCardView } from "./ActiveCardView";

export const ActiveCard = () => {
  const { isLoading } = useAcademyContext();

  if (isLoading) {
    return <ActiveCardSkeleton />;
  }

  return <ActiveCardView />;
};
