import Styles from "./HeaderSection_Player.module.css";
import Data from "../../common/elements/SquadElements/Section/Section.module.css";
import CaptainArmbandIcon from "../../ui/CaptainArmbandIcon";

type HeaderSection_PlayerProps = {
  name: string;
  position: string;
  shirtNumber: string;
  age: number;
  nation: string;
  captain?: boolean;
};

const HeaderSection_Player = ({
  name,
  position,
  shirtNumber,
  age,
  nation,
  captain,
}: HeaderSection_PlayerProps) => {
  return (
    <header
      className={Styles.player_info}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className={Styles.player_info_top}>
        <h2 className={Data.data_title}>{name}</h2>
        <div className={Data.data}>{position}</div>
        <div className={Data.data}>{shirtNumber}</div>
        {captain && <CaptainArmbandIcon />}
      </div>
      <div className={Styles.player_info_bottom}>
        <h2 className={Data.data}>{age} anos</h2>
        <div className={Data.data}>{nation}</div>
      </div>
    </header>
  );
};

export default HeaderSection_Player;
