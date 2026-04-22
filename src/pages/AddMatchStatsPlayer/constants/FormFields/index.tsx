import { GiSoccerBall } from "react-icons/gi";
import { IoIosStats } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { TbShieldCancel, TbTargetArrow } from "react-icons/tb";
import { Field } from "../../../../components/FormSection";
import { RefereeCard } from "../../../../ui/IconsSVG/RefereeCard";

const chunkArray = (arr: Field[], size: number): Field[][] =>
  arr.length > 0
    ? Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size),
      )
    : [];

export const FormFields = (
  subOptions: string[],
  isStarter: boolean,
  matchGoalsCount: number = 0,
  assistsCount: number = 0,
  goalOptions: string[] = [],
  hasYellowCard: boolean = false,
  hasSecondYellowCard: boolean = false,
  hasRedCard: boolean = false,
  formValues: Record<string, string> = {},
): { title: string; fields: readonly (readonly Field[])[] }[] => {
  const goalMinuteFields: Field[] = Array.from({ length: matchGoalsCount }).map(
    (_, i) => ({
      id: `goalMinute_${i}`,
      name: `Minuto do Gol ${i + 1}`,
      inputType: "number",
      placeholder: "Ex: 45",
      icon: <GiSoccerBall />,
    }),
  );

  const assistFields: Field[] = Array.from({ length: assistsCount }).map(
    (_, i) => {
      const fieldId = `assistToGoal_${i}`;

      const selectedOthers = Array.from({ length: assistsCount })
        .map((_, j) => (j !== i ? formValues[`assistToGoal_${j}`] : null))
        .filter(Boolean);

      const filteredOptions = goalOptions.filter(
        (opt) => !selectedOthers.includes(opt),
      );

      return {
        id: fieldId,
        name: `Assist. ${i + 1} para:`,
        inputType: "custom-select",
        options: filteredOptions,
        placeholder: "Selecione o gol...",
        icon: <TbTargetArrow />,
      };
    },
  );

  const disciplineCards: Field[] = [
    {
      id: "yellowCard",
      name: "Cartão Amarelo",
      checkbox: true,
      icon: <RefereeCard type="yellow" />,
    },
  ];

  if (hasYellowCard) {
    disciplineCards.push({
      id: "secondYellowCard",
      name: "2º Cartão Amarelo",
      checkbox: true,
      icon: <RefereeCard type="yellow" />,
    });
  }

  disciplineCards.push({
    id: "redCard",
    name: "Cartão Vermelho",
    checkbox: true,
    icon: <RefereeCard type="red" />,
  });

  const cardMinutesRow: Field[] = [];
  if (hasYellowCard) {
    cardMinutesRow.push({
      id: "yellowCardMinute",
      name: "Minuto 1º C. Amarelo",
      inputType: "number",
      placeholder: "Ex: 35",
      icon: <RefereeCard type="yellow" />,
    });
  }
  if (hasSecondYellowCard) {
    cardMinutesRow.push({
      id: "secondYellowCardMinute",
      name: "Minuto 2º C. Amarelo",
      inputType: "number",
      placeholder: "Ex: 65",
      icon: <RefereeCard type="yellow" />,
    });
  }
  if (hasRedCard) {
    cardMinutesRow.push({
      id: "redCardMinute",
      name: "Minuto C. Vermelho",
      inputType: "number",
      placeholder: "Ex: 70",
      icon: <RefereeCard type="red" />,
    });
  }

  const disciplineFields: Field[][] = [...chunkArray(disciplineCards, 2)];

  if (cardMinutesRow.length > 0) {
    disciplineFields.push(...chunkArray(cardMinutesRow, 2));
  }

  disciplineFields.push([
    {
      id: "substituteIn",
      name: isStarter ? "Saiu para a entrada de:" : "Entrou no lugar de:",
      inputType: "custom-select",
      options: subOptions,
      placeholder: "Selecione...",
      icon: <IoIosStats />,
    },
  ]);

  return [
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
        ...chunkArray(goalMinuteFields, 2),
        ...chunkArray(assistFields, 2),
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
      fields: disciplineFields,
    },
  ];
};
