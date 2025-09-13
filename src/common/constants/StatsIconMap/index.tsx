import { FaStar } from "react-icons/fa";
import { FcFullTrash } from "react-icons/fc";
import { GiSoccerBall } from "react-icons/gi";
import { IoIosStats } from "react-icons/io";
import { TbSoccerField, TbShieldCancel, TbTargetArrow } from "react-icons/tb";

export const iconMap: { [key: string]: React.ReactNode } = {
  Jogos: <TbSoccerField />,
  "Gols + Assistências": <IoIosStats />,
  Gols: <GiSoccerBall />,
  "Jogos Sem Sofrer Gols": <TbShieldCancel />,
  Assistências: <TbTargetArrow />,
  Média: <FaStar />,
  "Bola de Ouro": <GiSoccerBall color="#FFD700" />,
  Deletar: <FcFullTrash />,
};
