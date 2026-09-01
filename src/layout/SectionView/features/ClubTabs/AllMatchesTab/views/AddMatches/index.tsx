import { Career } from "../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../common/interfaces/club/clubData";
import { AddMatchesProvider } from "./contexts/AddMatchesContext";
import { AddMatchesScreen } from "./screens/AddMatchesScreen";

type AddMatchesScreenProps = {
  career: Career;
  season: ClubData;
  matchesId?: string;
  onClose: () => void;
};

export default function AddMatches(props: AddMatchesScreenProps) {
  return (
    <AddMatchesProvider {...props}>
      <AddMatchesScreen />
    </AddMatchesProvider>
  );
}
