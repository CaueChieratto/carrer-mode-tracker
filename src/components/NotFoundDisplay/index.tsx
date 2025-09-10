import { useNavigate } from "react-router-dom";
import Button from "../Button";
import Styles from "./NotFoundDisplay.module.css";

const NotFoundDisplay = () => {
  const navigate = useNavigate();
  return (
    <div className={Styles.notFound}>
      <p>Não foi possível encontrar os dados para esta temporada.</p>
      <Button onClick={() => navigate("/")} isActive>
        Voltar
      </Button>
    </div>
  );
};

export default NotFoundDisplay;
