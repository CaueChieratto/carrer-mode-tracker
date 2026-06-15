import { IoMdTime, IoIosPerson } from "react-icons/io";
import { GiSoccerBall } from "react-icons/gi";
import { TbTargetArrow } from "react-icons/tb";
import { Field } from "../../../../components/FormSection";
import { RefereeCard } from "../../../../ui/IconsSVG/RefereeCard";
import { chunkArray } from "../chunkArray";

export const buildFormFields = (
  hasExtraTime: boolean,
  hasPenalties: boolean,
  opponentScore: number = 0,
  opponentCardCount: number = 0,
  opponentOwnGoalCount: number = 0,
  userScore: number = 0,
  goalOptions: string[] = [],
  booleanValues: Record<string, boolean> = {},
  homeTeam: string = "Mandante",
  awayTeam: string = "Visitante",
  formValues: Record<string, string> = {},
): { title: string; fields: Field[][] }[] => {
  const stoppageFields: Field[] = [
    {
      id: "stoppage1T",
      name: "Acrés. 1º Tempo",
      inputType: "number",
      placeholder: "Ex: 2",
      icon: <IoMdTime />,
    },
    {
      id: "stoppage2T",
      name: "Acrés. 2º Tempo",
      inputType: "number",
      placeholder: "Ex: 4",
      icon: <IoMdTime />,
    },
  ];

  const opponentControlFields: Field[] = [
    {
      id: "opponentCardCount",
      name: "Qtd. Jogadores Advertidos",
      inputType: "number",
      placeholder: "Ex: 2",
      icon: <RefereeCard type="yellow" />,
    },
  ];

  if (userScore > 0) {
    opponentControlFields.push({
      id: "opponentOwnGoalCount",
      name: "Qtd. Gols Contra do Adv.",
      inputType: "number",
      placeholder: "Ex: 1",
      icon: <GiSoccerBall />,
    });
  }

  const formSections: { title: string; fields: Field[][] }[] = [
    {
      title: "Resultado e Tempo de Jogo",
      fields: [
        [
          {
            id: "homeScore",
            name: `Gols ${homeTeam}`,
            inputType: "number",
            placeholder: "Ex: 2",
            icon: <GiSoccerBall />,
          },
          {
            id: "awayScore",
            name: `Gols ${awayTeam}`,
            inputType: "number",
            placeholder: "Ex: 1",
            icon: <GiSoccerBall />,
          },
        ],
        stoppageFields,
        [
          {
            id: "opponentMvpName",
            name: "Nome do MVP (Adversário)",
            inputType: "text",
            placeholder: "Ex: J. Jogador",
            icon: <IoIosPerson />,
          },
          {
            id: "opponentMvpRating",
            name: "Nota do MVP",
            inputType: "number",
            placeholder: "Ex: 9.5",
            icon: <TbTargetArrow />,
          },
        ],
      ],
    },
    {
      title: "Tempo Extra",
      fields: [
        [
          {
            id: "hasExtraTime",
            name: "Teve Prorrogação?",
            checkbox: true,
            icon: <IoMdTime />,
          },
        ],
        ...(hasExtraTime
          ? [
              [
                {
                  id: "stoppageET1",
                  name: "Acrés. 1T (Prorrogação)",
                  inputType: "number",
                  placeholder: "Ex: 1",
                  icon: <IoMdTime />,
                },
                {
                  id: "stoppageET2",
                  name: "Acrés. 2T (Prorrogação)",
                  inputType: "number",
                  placeholder: "Ex: 3",
                  icon: <IoMdTime />,
                },
              ],
            ]
          : []),
        [
          {
            id: "hasPenalties",
            name: "Teve Disputa de Pênaltis?",
            checkbox: true,
            icon: <GiSoccerBall />,
          },
        ],
        ...(hasPenalties
          ? [
              [
                {
                  id: "homePenScore",
                  name: `Pênaltis ${homeTeam}`,
                  inputType: "number",
                  placeholder: "Ex: 5",
                  icon: <GiSoccerBall />,
                },
                {
                  id: "awayPenScore",
                  name: `Pênaltis ${awayTeam}`,
                  inputType: "number",
                  placeholder: "Ex: 3",
                  icon: <GiSoccerBall />,
                },
              ],
            ]
          : []),
      ],
    },
    {
      title: "Eventos do Adversário - Controle",
      fields: [opponentControlFields],
    },
  ];

  if (opponentScore > 0) {
    const goalFields: Field[] = [];
    const assistFields: Field[] = [];

    for (let i = 0; i < opponentScore; i++) {
      const availableGoalOptions = goalOptions.filter((option) => {
        for (let j = 0; j < opponentScore; j++) {
          if (i !== j && formValues[`opponentAssistTo_${j}`] === option) {
            return false;
          }
        }
        return true;
      });

      goalFields.push(
        {
          id: `opponentGoalPlayer_${i}`,
          name: `Autor do Gol ${i + 1}`,
          inputType: "text",
          placeholder: "Ex: J. Jogador",
          icon: <IoIosPerson />,
        },
        {
          id: `opponentGoalMinute_${i}`,
          name: `Minuto do Gol ${i + 1}`,
          inputType: "number",
          placeholder: "Ex: 39",
          icon: <IoMdTime />,
        },
      );

      assistFields.push(
        {
          id: `opponentAssistPlayer_${i}`,
          name: `Autor da Assist. ${i + 1}`,
          inputType: "text",
          placeholder: "Ex: J. Jogador 2",
          icon: <IoIosPerson />,
        },
        {
          id: `opponentAssistTo_${i}`,
          name: `Referente ao:`,
          inputType: "custom-select",
          options: availableGoalOptions,
          placeholder: "Selecione o gol...",
          icon: <TbTargetArrow />,
        },
      );
    }

    formSections.push({
      title: "Eventos do Adversário - Gols",
      fields: chunkArray(goalFields, 2),
    });

    formSections.push({
      title: "Eventos do Adversário - Assistências",
      fields: chunkArray(assistFields, 2),
    });
  }

  if (opponentCardCount > 0) {
    const disciplineFields: Field[][] = [];

    for (let i = 0; i < opponentCardCount; i++) {
      const hasYellow = booleanValues[`opponentYellow_${i}`];
      const hasSecondYellow = booleanValues[`opponentSecondYellow_${i}`];
      const hasRed = booleanValues[`opponentRed_${i}`];

      disciplineFields.push([
        {
          id: `opponentCardPlayer_${i}`,
          name: `Jogador Advertido ${i + 1}`,
          inputType: "text",
          placeholder: "Ex: J. Jogador",
          icon: <IoIosPerson />,
        },
      ]);

      const cardsRow: Field[] = [
        {
          id: `opponentYellow_${i}`,
          name: "Cartão Amarelo",
          checkbox: true,
          icon: <RefereeCard type="yellow" />,
        },
      ];

      if (hasYellow) {
        cardsRow.push({
          id: `opponentSecondYellow_${i}`,
          name: "2º Cartão Amarelo",
          checkbox: true,
          icon: <RefereeCard type="yellow" />,
        });
      }

      cardsRow.push({
        id: `opponentRed_${i}`,
        name: "Cartão Vermelho",
        checkbox: true,
        icon: <RefereeCard type="red" />,
      });

      disciplineFields.push(cardsRow);

      const minutesRow: Field[] = [];
      if (hasYellow)
        minutesRow.push({
          id: `opponentYellowMin_${i}`,
          name: "Minuto 1º C. Amarelo",
          inputType: "number",
          placeholder: "Ex: 35",
          icon: <RefereeCard type="yellow" />,
        });
      if (hasSecondYellow)
        minutesRow.push({
          id: `opponentSecondYellowMin_${i}`,
          name: "Minuto 2º C. Amarelo",
          inputType: "number",
          placeholder: "Ex: 65",
          icon: <RefereeCard type="yellow" />,
        });
      if (hasRed)
        minutesRow.push({
          id: `opponentRedMin_${i}`,
          name: "Minuto C. Vermelho",
          inputType: "number",
          placeholder: "Ex: 70",
          icon: <RefereeCard type="red" />,
        });

      if (minutesRow.length > 0) {
        disciplineFields.push(...chunkArray(minutesRow, 2));
      }
    }

    formSections.push({
      title: "Eventos do Adversário - Disciplina",
      fields: disciplineFields,
    });
  }

  if (opponentOwnGoalCount > 0 && userScore > 0) {
    const ownGoalFields: Field[] = [];

    for (let i = 0; i < opponentOwnGoalCount; i++) {
      ownGoalFields.push(
        {
          id: `opponentOwnGoalPlayer_${i}`,
          name: `Autor do Gol Contra ${i + 1}`,
          inputType: "text",
          placeholder: "Ex: J. Jogador",
          icon: <IoIosPerson />,
        },
        {
          id: `opponentOwnGoalMinute_${i}`,
          name: `Minuto do Gol Contra ${i + 1}`,
          inputType: "number",
          placeholder: "Ex: 39",
          icon: <IoMdTime />,
        },
      );
    }

    formSections.push({
      title: "Eventos do Adversário - Gols Contra",
      fields: chunkArray(ownGoalFields, 2),
    });
  }

  return formSections;
};
