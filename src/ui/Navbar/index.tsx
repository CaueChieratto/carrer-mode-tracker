import { useSeasonTheme } from "../../common/hooks/Seasons/UseSeasonTheme";
import Styles from "./Navbar.module.css";

type NavbarProps = {
  save?: () => void;
  options: string[];
  activeOption: number;
  onOptionClick: (index: number) => void;
};

const Navbar = ({
  save,
  options,
  activeOption,
  onOptionClick,
}: NavbarProps) => {
  const { activeStyle } = useSeasonTheme();

  return (
    <nav className={!save ? Styles.nav : Styles.nav_title}>
      {options.map((optionText, index) => (
        <div
          key={index}
          className={!save ? Styles.options : Styles.option_title}
          style={activeOption === index ? activeStyle : {}}
          onClick={() => (!save ? onOptionClick(index) : save())}
        >
          {optionText}
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
