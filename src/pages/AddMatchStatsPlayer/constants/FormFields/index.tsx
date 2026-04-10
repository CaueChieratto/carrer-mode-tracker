import { GiSoccerBall } from "react-icons/gi";
import { IoIosStats } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { TbShieldCancel, TbTargetArrow } from "react-icons/tb";
import { Field } from "../../../../components/FormSection";
import { RefereeCard } from "../../../../ui/IconsSVG/RefereeCard";

export const FormFields = (
  subOptions: string[],
  isStarter: boolean,
): { title: string; fields: readonly (readonly Field[])[] }[] => [
  {
    title: "Desempenho Geral",
    fields: [
      [
        {
          id: "minutesPlayed",
          name: "Minutos Jogados",
          inputType: "number",
          placeholder: "Ex: 90",
          icon: <IoIosStats />,
        },
        {
          id: "rating",
          name: "Nota (Rating)",
          placeholder: "Ex: 8.5",
          icon: <FaStar />,
        },
      ],
      [
        {
          id: "cleanSheets",
          name: "Defesas",
          inputType: "number",
          placeholder: "Ex: 1",
          icon: <TbShieldCancel />,
        },
        {
          id: "matchGoals",
          name: "Gols",
          inputType: "number",
          placeholder: "Ex: 1",
          icon: <GiSoccerBall />,
        },
        {
          id: "assists",
          name: "Assistências",
          inputType: "number",
          placeholder: "Ex: 1",
          icon: <TbTargetArrow />,
        },
      ],
    ],
  },
  {
    title: "Estatísticas Avançadas",
    fields: [
      [
        {
          id: "passes",
          name: "Passes Completos",
          inputType: "number",
          placeholder: "Ex: 45",
          icon: <IoIosStats />,
        },
        {
          id: "finishings",
          name: "Finalizações",
          inputType: "number",
          placeholder: "Ex: 3",
          icon: <IoIosStats />,
        },
      ],
      [
        {
          id: "distanceKm",
          name: "Distância Percorrida (Km)",
          inputType: "number",
          placeholder: "Ex: 10.5",
          icon: <IoIosStats />,
        },
      ],
    ],
  },
  {
    title: "Disciplina e Substituição",
    fields: [
      [
        {
          id: "yellowCard",
          name: "Cartão Amarelo",
          checkbox: true,
          icon: <RefereeCard type="yellow" />,
        },
        {
          id: "redCard",
          name: "Cartão Vermelho",
          checkbox: true,
          icon: <RefereeCard type="red" />,
        },
      ],
      [
        {
          id: "substituteIn",
          name: isStarter ? "Saiu para a entrada de:" : "Entrou no lugar de:",
          inputType: "custom-select",
          options: subOptions,
          placeholder: "Selecione...",
          icon: <IoIosStats />,
        },
      ],
    ],
  },
];
