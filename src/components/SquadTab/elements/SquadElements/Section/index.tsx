import { useLocation, useNavigate, useParams } from "react-router-dom";
import FooterSection_Player from "./components/FooterSection_Player";
import HeaderSection_Player from "./components/HeaderSection_Player";
import Data from "./Section.module.css";
import { Match } from "../../../../AllMatchesTab/types/Match";
import { Contract } from "../../../../../common/interfaces/playersInfo/contract";

type SectionProps = {
  id: string;
  name: string;
  position: string;
  shirtNumber: string;
  age: number;
  nation: string;
  playerValue: number;
  salary: number;
  captain: boolean;
  contractTime: number;
  matches: Match[];
  loan?: boolean;
  contract?: Contract[];
};

export const Section = ({
  id,
  age,
  name,
  nation,
  position,
  shirtNumber,
  salary,
  playerValue,
  captain,
  contractTime,
  matches,
  loan,
  contract,
}: SectionProps) => {
  const navigate = useNavigate();
  const { careerId, seasonId } = useParams();
  const location = useLocation();

  const handleNavigate = () => {
    if (location.pathname.includes("/Geral")) {
      navigate(`/Career/${careerId}/Geral/Player/${id}`);
    } else {
      navigate(`/Career/${careerId}/Season/${seasonId}/EditPlayer/${id}`);
    }
  };

  let displaySalary = salary;
  if (loan && contract && contract.length > 0) {
    const lastContract = contract[contract.length - 1];
    if (lastContract.isLoan && lastContract.wagePercentage !== undefined) {
      displaySalary = salary * ((100 - lastContract.wagePercentage) / 100);
    }
  }

  return (
    <section className={Data.player} onClick={handleNavigate}>
      <HeaderSection_Player
        age={age}
        name={name}
        nation={nation}
        position={position}
        shirtNumber={shirtNumber}
        captain={captain}
      />
      <FooterSection_Player
        contractTime={contractTime}
        salary={displaySalary}
        playerValue={playerValue}
        matches={matches}
      />
    </section>
  );
};
