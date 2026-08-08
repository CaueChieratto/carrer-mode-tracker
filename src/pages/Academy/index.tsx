import { useLocation } from "react-router-dom";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import { AcademyContent } from "./layouts/AcademyContent";

export const Academy = () => {
  const location = useLocation();
  const { career, seasonId } = location.state;

  if (!career) {
    return <NotFoundDisplay />;
  }

  return (
    <SeasonThemeProvider careerId={career.id} career={career}>
      <AcademyContent career={career} seasonId={seasonId} />
    </SeasonThemeProvider>
  );
};
