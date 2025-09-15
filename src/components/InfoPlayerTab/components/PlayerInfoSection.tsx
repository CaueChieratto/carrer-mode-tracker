import React from "react";
import { GrMap } from "react-icons/gr";
import { Players } from "../../../common/interfaces/playersInfo/players";
import InfoCard from "../../InfoCard";
import InfoItem from "../../InfoItem";
import InfoRow from "../../InfoRow";
import { FaCalendar, FaTshirt } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";

type PlayerInfoSectionProps = {
  player: Players;
};

const PlayerInfoSection: React.FC<PlayerInfoSectionProps> = ({ player }) => (
  <InfoCard title="Informações do jogador" color="#010127">
    <InfoRow>
      <InfoItem
        label={player.nation}
        value={player.name}
        icon={<FaUserLarge />}
      />
      <InfoItem label={player.position} value={"Posição"} icon={<GrMap />} />
      <InfoItem label={"Idade"} value={player.age} icon={<FaCalendar />} />
      <InfoItem
        label={player.shirtNumber}
        value={"Número da camisa"}
        icon={<FaTshirt />}
      />
    </InfoRow>
  </InfoCard>
);

export default PlayerInfoSection;
