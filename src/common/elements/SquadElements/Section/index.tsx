import { useNavigate, useParams } from "react-router-dom";
import FooterSection_Player from "../../../../components/FooterSection_Player";
import HeaderSection_Player from "../../../../components/HeaderSection_Player";
import Data from "./Section.module.css";

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
}: SectionProps) => {
  const navigate = useNavigate();
  const { careerId, seasonId } = useParams();

  const handleNavigate = () => {
    navigate(`/Career/${careerId}/Season/${seasonId}/EditPlayer/${id}`);
  };

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
        salary={salary}
        playerValue={playerValue}
      />
    </section>
  );
};
