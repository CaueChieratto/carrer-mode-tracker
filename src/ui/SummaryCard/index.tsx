import Card from "../Card";
import Styles from "./SummaryCard.module.css";
import Titles from "../../components/GeneralTab/GeneralTab.module.css";
import { FaUserGroup } from "react-icons/fa6";
import { BsCalendar4 } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaHandHoldingUsd } from "react-icons/fa";
import { ClubData } from "../../common/interfaces/club/clubData";
import { formatDisplayValue } from "../../common/utils/FormatValue";

type SummaryCardProps = {
  season: ClubData;
};

const SummaryCard = ({ season }: SummaryCardProps) => {
  const activePlayers = season.players.filter((player) => !player.sell);

  const totalPlayers = activePlayers.length;

  const averageAge =
    totalPlayers > 0
      ? (
          activePlayers.reduce((acc, player) => acc + player.age, 0) /
          totalPlayers
        ).toFixed(1)
      : 0;
  const weeklySalaries = activePlayers.reduce(
    (acc, player) => acc + player.salary,
    0
  );
  const squadValue = activePlayers.reduce(
    (acc, player) => acc + player.playerValue,
    0
  );

  const content = [
    { info: "Total de jogadores", number: totalPlayers, icon: <FaUserGroup /> },
    { info: "Média de idade", number: averageAge, icon: <BsCalendar4 /> },
    {
      info: "Salários Semanais",
      number: formatDisplayValue(weeklySalaries),
      icon: <FaMoneyBillWave />,
    },
    {
      info: "Valor do plantel",
      number: formatDisplayValue(squadValue),
      icon: <FaHandHoldingUsd />,
    },
  ];

  return (
    <Card className={Titles.card}>
      <div className={Titles.container_card}>
        <h1 className={Titles.h1}>Resumo da equipe</h1>
        <div className={Titles.container_info}>
          {content.map((item) => (
            <div className={Styles.infos} key={item.info}>
              <h2 className={Titles.h2}>{item.info}</h2>
              <span className={Titles.number}>{item.number}</span>
              <div className={Titles.icon}>{item.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;
