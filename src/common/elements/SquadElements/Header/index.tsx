import Styles from "./Header.module.css";

type HeaderProps = {
  name: string;
  color: string;
  quantity: number;
};

export const Header = ({ name, color, quantity }: HeaderProps) => (
  <header className={Styles.header}>
    <div className={Styles.bar} style={{ backgroundColor: color }}></div>
    <div className={Styles.container_header}>
      <h1 className={Styles.h1} style={{ color: color }}>
        {name} {quantity}
      </h1>
    </div>
  </header>
);
