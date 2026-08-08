import {
  FaChartLine,
  FaStickyNote,
  FaTrophy,
  FaUserEdit,
} from "react-icons/fa";
import { EntityAction } from "../../../../../EntityActionLink";

export const getPlayerActions = (hasAnnotations: boolean): EntityAction[] => [
  { id: "manage-player", label: "Gerenciar Jogador", icon: <FaUserEdit /> },
  {
    id: "add-note",
    label: hasAnnotations ? "Ver Anotações" : "Adicionar Anotação",
    icon: <FaStickyNote />,
  },
  {
    id: "development",
    label: "Acompanhar Desenvolvimento",
    icon: <FaChartLine />,
  },
  {
    id: "performance",
    label: "Acompanhar Desempenho",
    icon: <FaTrophy />,
  },
];
