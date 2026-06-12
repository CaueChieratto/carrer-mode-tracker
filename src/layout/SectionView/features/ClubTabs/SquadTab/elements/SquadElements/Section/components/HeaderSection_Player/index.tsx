import { PlayerInfo } from "../../../../../../../../../../components/PlayerInfo";
import Styles from "./HeaderSection_Player.module.css";

type HeaderSection_PlayerProps = {
  name: string;
  position: string;
  shirtNumber: string;
  age: number;
  nation: string;
  captain?: boolean;
};

const HeaderSection_Player = (props: HeaderSection_PlayerProps) => {
  return (
    <PlayerInfo
      {...props}
      customContainerClass={Styles.custom_player_info}
      onTouchMove={(e) => e.stopPropagation()}
    />
  );
};

export default HeaderSection_Player;
