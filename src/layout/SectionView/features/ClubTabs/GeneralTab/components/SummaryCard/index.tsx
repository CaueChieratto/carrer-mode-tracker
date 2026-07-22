import Card from "../../../../../../../ui/Card";
import Titles from "../../GeneralTab.module.css";
import { ClubData } from "../../../../../../../common/interfaces/club/clubData";
import SummaryItem from "./components/SummaryItem";
import React from "react";
import { BsCalendar4 } from "react-icons/bs";
import { FaMoneyBillWave, FaHandHoldingUsd } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { useSummaryData } from "./hooks/UseSummaryData";
import { Career } from "../../../../../../../common/interfaces/Career";

type SummaryCardProps = {
  season: ClubData;
  career: Career;
};

const iconMap: { [key: string]: React.ReactNode } = {
  "Total de jogadores": <FaUserGroup />,
  "Média de idade": <BsCalendar4 />,
  "Salários Semanais": <FaMoneyBillWave />,
  "Valor do plantel": <FaHandHoldingUsd />,
};

const SummaryCard = ({ season, career }: SummaryCardProps) => {
  const { content } = useSummaryData(season, career.currency);

  return (
    <Card className={Titles.card}>
      <div className={Titles.container_card}>
        <h1 className={Titles.h1}>Resumo da equipe</h1>
        <div className={Titles.container_info}>
          {content.map((item) => (
            <SummaryItem
              key={item.info}
              info={item.info}
              number={item.number}
              icon={iconMap[item.info]}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;
