import { ReactElement } from "react";
import {
  FaTrophy,
  FaChevronRight,
  FaChartLine,
  FaFutbol,
} from "react-icons/fa";

export const iconMap: Record<string, ReactElement> = {
  overall: <FaChartLine />,
  potential: <FaChartLine />,
  age: <FaChartLine />,
  height: <FaChartLine />,
  weight: <FaChartLine />,
  status: <FaChevronRight />,
  tournament: <FaTrophy />,
  match: <FaFutbol />,
};
