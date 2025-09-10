import { useState } from "react";
import Styles from "./SummarySection.module.css";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import StatsSummary from "../StatsSummary";
import ContainerIcon from "../ContainerIcon";
import { Trophy } from "../../common/interfaces/club/trophy";

type SummarySectionProps = {
  trophies: Trophy[];
};

const SummarySection = ({ trophies }: SummarySectionProps) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <section className={Styles.section}>
      <div className={Styles.wrapper}>
        <div className={Styles.container_section}>
          <h3 className={Styles.h3}>Total de Titulos:</h3>
          <span className={Styles.span}>
            {trophies.reduce(
              (total, trophy) => total + trophy.seasons.length,
              0
            )}
          </span>
        </div>
        <ContainerIcon
          className={Styles.icon}
          onClick={() => setShowStats(!showStats)}
        >
          {showStats ? <LuEye size={16} /> : <LuEyeClosed size={16} />}
        </ContainerIcon>
      </div>
      {showStats && <StatsSummary />}
    </section>
  );
};

export default SummarySection;
