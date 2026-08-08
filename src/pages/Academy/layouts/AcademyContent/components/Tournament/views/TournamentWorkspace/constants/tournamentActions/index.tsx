import { FaCalendarAlt, FaTrophy, FaList } from "react-icons/fa";
import { EntityAction } from "../../../../../EntityActionLink";

export const tournamentActions: EntityAction[] = [
  { id: "add-matches", label: "Adicionar Partidas", icon: <FaCalendarAlt /> },
  { id: "view-matches", label: "Ver Partidas", icon: <FaList /> },
  { id: "manage-tournaments", label: "Gerenciar Torneio", icon: <FaTrophy /> },
];
