import Styles from "./DataInCard.module.css";
import { FormatDate } from "../../common/types/enums/FormatDate";
import { format } from "date-fns";

type DataInCardProps = {
  createdAt: Date;
};

const DataInCard = ({ createdAt }: DataInCardProps) => {
  return (
    <div className={Styles.container_date}>
      Criado em{" "}
      <span>
        {format(
          createdAt,
          FormatDate.STANDARD.replace(/D/g, "d").replace(/Y/g, "y")
        )}
      </span>
    </div>
  );
};

export default DataInCard;
