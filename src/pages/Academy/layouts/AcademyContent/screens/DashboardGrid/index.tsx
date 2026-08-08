import { DashboardGridView } from "./DashboardGridView";
import { DashboardGridSkeleton } from "./DashboardGridSkeleton";
import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";

export const DashboardGrid = () => {
  const { isLoading, dashboardCards, setActiveCardIndex } = useAcademyContext();

  if (isLoading) {
    return <DashboardGridSkeleton dashboardCards={dashboardCards} />;
  }

  return (
    <DashboardGridView
      dashboardCards={dashboardCards}
      setActiveCardIndex={setActiveCardIndex}
    />
  );
};
