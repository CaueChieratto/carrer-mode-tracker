import { LuSun } from "react-icons/lu";
import Styles from "./bottomMenu.module.css";
import { FiMoon } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";
import { useTheme } from "../../contexts/LightThemeContext";

const BottomMenu = () => {
  const { theme, toggleTheme } = useTheme();

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
        <BsQuestionCircle size={30} />
      </div>
    </div>
  );
};

export default BottomMenu;
