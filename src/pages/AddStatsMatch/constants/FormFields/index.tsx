import { GiSoccerBall } from "react-icons/gi";
import { IoIosStats, IoIosStopwatch } from "react-icons/io";
import { TbShieldCancel, TbTargetArrow } from "react-icons/tb";
import { Field } from "../../../../components/FormSection";
import { RefereeCard } from "../../../../ui/IconsSVG/RefereeCard";

export const AddStatsMatchFormFields = (
  homeTeam: string,
  awayTeam: string,
  isUserHome: boolean,
): { title: string; fields: Field[][] }[] => {
  const userTeam = isUserHome ? homeTeam : awayTeam;

  return [
    {
      title: "Geral",
      fields: [
        [
          {
            id: "userPossession",
            name: `Posse de Bola (%): ${userTeam}`,
            inputType: "number",
            placeholder: "ex: 56",
            icon: <IoIosStats />,
          },
        ],
        [
          {
            id: "homeBallRecovery",
            name: `Recup. Bola (s): ${homeTeam}`,
            inputType: "number",
            placeholder: "ex: 8",
            icon: <IoIosStopwatch />,
          },
          {
            id: "awayBallRecovery",
            name: `Recup. Bola (s): ${awayTeam}`,
            inputType: "number",
            placeholder: "ex: 11",
            icon: <IoIosStopwatch />,
          },
        ],
      ],
    },
    {
      title: "Ataque",
      fields: [
        [
          {
            id: "homeFinishings",
            name: `Finalizações: ${homeTeam}`,
            inputType: "number",
            placeholder: "ex: 6",
            icon: <GiSoccerBall />,
          },
          {
            id: "awayFinishings",
            name: `Finalizações: ${awayTeam}`,
            inputType: "number",
            placeholder: "ex: 4",
            icon: <GiSoccerBall />,
          },
        ],
        [
          {
            id: "homeXG",
            name: `xG: ${homeTeam}`,
            inputType: "number",
            placeholder: "ex: 3.2",
            icon: <TbTargetArrow />,
          },
          {
            id: "awayXG",
            name: `xG: ${awayTeam}`,
            inputType: "number",
            placeholder: "ex: 0.6",
            icon: <TbTargetArrow />,
          },
        ],
        [
          {
            id: "homeShotAccuracy",
            name: `Prec. Finalização (%): ${homeTeam}`,
            inputType: "number",
            placeholder: "ex: 83",
            icon: <TbTargetArrow />,
          },
          {
            id: "awayShotAccuracy",
            name: `Prec. Finalização (%): ${awayTeam}`,
            inputType: "number",
            placeholder: "ex: 75",
            icon: <TbTargetArrow />,
          },
        ],
      ],
    },
    {
      title: "Criação e Passes",
      fields: [
        [
          {
            id: "homePasses",
            name: `Passes: ${homeTeam}`,
            inputType: "number",
            placeholder: "ex: 214",
            icon: <IoIosStats />,
          },
          {
            id: "awayPasses",
            name: `Passes: ${awayTeam}`,
            inputType: "number",
            placeholder: "ex: 152",
            icon: <IoIosStats />,
          },
        ],
        [
          {
            id: "homePassAccuracy",
            name: `Prec. Passes (%): ${homeTeam}`,
            inputType: "number",
            placeholder: "ex: 86",
            icon: <IoIosStats />,
          },
          {
            id: "awayPassAccuracy",
            name: `Prec. Passes (%): ${awayTeam}`,
            inputType: "number",
            placeholder: "ex: 80",
            icon: <IoIosStats />,
          },
        ],
      ],
    },
    {
      title: "Defesa e Disciplina",
      fields: [
        [
          {
            id: "homeDefenses",
            name: `Defesas: ${homeTeam}`,
            inputType: "number",
            placeholder: "ex: 2",
            icon: <TbShieldCancel />,
          },
          {
            id: "awayDefenses",
            name: `Defesas: ${awayTeam}`,
            inputType: "number",
            placeholder: "ex: 3",
            icon: <TbShieldCancel />,
          },
        ],
        [
          {
            id: "homeYellowCards",
            name: `Amarelos: ${homeTeam}`,
            inputType: "number",
            placeholder: "ex: 1",
            icon: <RefereeCard type="yellow" />,
          },
          {
            id: "awayYellowCards",
            name: `Amarelos: ${awayTeam}`,
            inputType: "number",
            placeholder: "ex: 1",
            icon: <RefereeCard type="yellow" />,
          },
        ],
        [
          {
            id: "homeRedCards",
            name: `Vermelhos: ${homeTeam}`,
            inputType: "number",
            placeholder: "ex: 0",
            icon: <RefereeCard type="red" />,
          },
          {
            id: "awayRedCards",
            name: `Vermelhos: ${awayTeam}`,
            inputType: "number",
            placeholder: "ex: 0",
            icon: <RefereeCard type="red" />,
          },
        ],
      ],
    },
  ];
};
