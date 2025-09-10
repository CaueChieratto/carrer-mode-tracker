import Styles from "./Load.module.css";

const Load = () => {
  return (
    <div className={Styles.containerLoad}>
      <svg className={Styles.svgLoad} viewBox="25 25 50 50">
        <circle className={Styles.circleLoad} r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
};

export default Load;
