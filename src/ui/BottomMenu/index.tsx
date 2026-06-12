import { LuSun } from "react-icons/lu";
import Styles from "./BottomMenu.module.css";
import { FiMoon } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";
import { useTheme } from "../../contexts/LightThemeContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaPeopleArrows } from "react-icons/fa";

type BottomMenuProps = {
  noHavePlayers?: boolean;
};

const BottomMenu = ({ noHavePlayers }: BottomMenuProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { careerId, seasonId, playerId } = useParams();
  const location = useLocation();

  const compareClick = () => {
    if (playerId) {
      navigate(`/Career/${careerId}/Geral/Player/${playerId}/Compare`);
    } else if (location.pathname.includes("/Geral")) {
      navigate(`/Career/${careerId}/Geral/Compare`);
    } else if (seasonId) {
      navigate(`/Career/${careerId}/Season/${seasonId}/Compare`);
    }
  };

  return (
    <div className={Styles.background}>
      <div className={Styles.container}>
        <div>
          {theme === "light" ? (
            <LuSun size={30} onClick={toggleTheme} />
          ) : (
            <FiMoon size={30} onClick={toggleTheme} />
          )}
        </div>

        {!noHavePlayers && <FaPeopleArrows size={30} onClick={compareClick} />}

        <BsQuestionCircle size={30} onClick={() => navigate("/tutorial")} />
      </div>
    </div>
  );
};

export default BottomMenu;
