import { BsBarChart } from "react-icons/bs";
import Card from "../../ui/Card";
import Styles from "./NoStatsMessage.module.css";
import { GiSoccerField } from "react-icons/gi";

type NoStatsMessageProps = {
  isStats?: boolean;
  textTwo: string;
  textOne: string;
};

const NoStatsMessage = ({ isStats, textOne, textTwo }: NoStatsMessageProps) => (
  <Card className={Styles.card}>
    {isStats && <BsBarChart className={Styles.icon} />}
    {!isStats && <GiSoccerField className={Styles.icon} />}

    <h2 className={Styles.title}>{textOne}</h2>
    <p className={Styles.text}>{textTwo}</p>
  </Card>
);

export default NoStatsMessage;
