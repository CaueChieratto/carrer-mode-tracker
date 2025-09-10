import Card from "../../ui/Card";
import Styles from "./NoStatsMessage.module.css";

const NoStatsMessage = () => (
  <Card className={Styles.card}>
    <p className={Styles.p}>
      Primeiro, adicione jogadores ao elenco. Depois, você poderá registrar
      estatísticas para cada jogador.
    </p>
  </Card>
);

export default NoStatsMessage;
