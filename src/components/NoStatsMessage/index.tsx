import { BsBarChart } from "react-icons/bs";
import Card from "../../ui/Card";
import Styles from "./NoStatsMessage.module.css";

const NoStatsMessage = () => (
  <Card className={Styles.card}>
    <BsBarChart className={Styles.icon} />
    <h2 className={Styles.title}>Nenhuma estatística encontrada</h2>
    <p className={Styles.text}>
      Primeiro, adicione jogadores ao elenco para poder registrar suas
      estatísticas.
    </p>
  </Card>
);

export default NoStatsMessage;
