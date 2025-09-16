import { BsBarChart } from "react-icons/bs";
import Card from "../../ui/Card";
import Styles from "./NoStatsMessage.module.css";

type NoStatsMessageProps = {
  text: string;
};

const NoStatsMessage = ({ text }: NoStatsMessageProps) => (
  <Card className={Styles.card}>
    <BsBarChart className={Styles.icon} />
    <h2 className={Styles.title}>Nenhuma estatística encontrada</h2>
    <p className={Styles.text}>{text}</p>
  </Card>
);

export default NoStatsMessage;
