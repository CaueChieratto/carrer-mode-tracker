import React from "react";
import { MdOutlineWarning } from "react-icons/md";
import { RankingItem, RankingType } from "../../types";
import { getRankingSuffix } from "../../helpers/getRankingSuffix";
import Styles from "./RankingCard.module.css";
import { OverflowText } from "../../../../../../../components/OverflowText";

interface RankingCardProps {
  title: string;
  icon: React.ReactNode;
  data: RankingItem[];
  type?: RankingType;
  isMinuteLabel?: boolean;
  accentColor?: string;
}

export const RankingCard = ({
  title,
  icon,
  data,
  type = "times",
  isMinuteLabel = false,
  accentColor = "#a855f7",
}: RankingCardProps) => {
  return (
    <div className={Styles.ranking_card}>
      <div
        className={Styles.ranking_header}
        style={{ borderBottomColor: accentColor }}
      >
        <div className={Styles.header_icon} style={{ color: accentColor }}>
          {icon}
        </div>
        <h3>{title}</h3>
      </div>
      <ul className={Styles.ranking_list}>
        {data.length > 0 ? (
          data.map((item, index) => (
            <li key={index} className={Styles.ranking_item}>
              <div className={Styles.ranking_position_wrapper}>
                <span
                  className={Styles.ranking_position}
                  style={{ color: index < 3 ? accentColor : "var(--color)" }}
                >
                  {index + 1}º
                </span>
              </div>

              <div className={Styles.ranking_label_container}>
                <OverflowText
                  text={`${item.label}${isMinuteLabel ? "'" : ""}`}
                  disableDynamicMinWidth
                  className={Styles.ranking_label}
                />
              </div>

              <div className={Styles.ranking_count_badge}>
                <span className={Styles.count_number}>{item.count}</span>
                <span className={Styles.count_suffix}>
                  {getRankingSuffix(item.count, type)}
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className={Styles.empty_ranking}>
            <MdOutlineWarning size={16} /> Dados insuficientes
          </li>
        )}
      </ul>
    </div>
  );
};
