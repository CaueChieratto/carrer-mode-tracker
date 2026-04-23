import { IoMdTime, IoMdSwap } from "react-icons/io";
import { GiSoccerBall } from "react-icons/gi";
import { Field } from "../../../../components/FormSection";
import {
  RefereeCard,
  RefereeCardType,
} from "../../../../ui/IconsSVG/RefereeCard";

export const AddDetailsFormFields = (
  hasExtraTime: boolean,
  hasPenalties: boolean,
  events: {
    id: string;
    name: string;
    type: "card" | "sub" | "goal" | "assist";
    color?: string;
  }[],
): { title: string; fields: Field[][] }[] => {
  const stoppageFields: Field[] = [
    {
      id: "stoppage1T",
      name: "Acrés. 1º Tempo",
      inputType: "number",
      placeholder: "0",
      icon: <IoMdTime />,
    },
    {
      id: "stoppage2T",
      name: "Acrés. 2º Tempo",
      inputType: "number",
      placeholder: "0",
      icon: <IoMdTime />,
    },
  ];

  const hasExtraTimeField: Field[] = [
    {
      id: "hasExtraTime",
      name: "Teve Prorrogação?",
      checkbox: true,
      icon: <IoMdTime />,
    },
  ];

  const extraTimeFields: Field[] = hasExtraTime
    ? [
        {
          id: "stoppageET1",
          name: "Acrés. 1T (Prorrogação)",
          inputType: "number",
          placeholder: "0",
          icon: <IoMdTime />,
        },
        {
          id: "stoppageET2",
          name: "Acrés. 2T (Prorrogação)",
          inputType: "number",
          placeholder: "0",
          icon: <IoMdTime />,
        },
      ]
    : [];

  const hasPenaltiesField: Field[] = [
    {
      id: "hasPenalties",
      name: "Teve Disputa de Pênaltis?",
      checkbox: true,
      icon: <GiSoccerBall />,
    },
  ];

  const penaltiesFields: Field[] = hasPenalties
    ? [
        {
          id: "homePenScore",
          name: "Pênaltis Mandante",
          inputType: "number",
          icon: <GiSoccerBall />,
        },
        {
          id: "awayPenScore",
          name: "Pênaltis Visitante",
          inputType: "number",
          icon: <GiSoccerBall />,
        },
      ]
    : [];

  const createEventField = (event: (typeof events)[0]): Field => ({
    id: `eventMinute_${event.id}`,
    name: `${event.name}`,
    icon:
      event.type === "sub" ? (
        <IoMdSwap />
      ) : (
        <RefereeCard type={event.color as RefereeCardType} />
      ),
  });

  const disciplineFields = events
    .filter((e) => e.type === "card")
    .map(createEventField);

  const subFields = events
    .filter((e) => e.type === "sub")
    .map(createEventField);

  const formSections: { title: string; fields: Field[][] }[] = [
    {
      title: "Resultado e Tempo de Jogo",
      fields: [
        [
          {
            id: "homeScore",
            name: "Gols Mandante",
            inputType: "number",
            icon: <GiSoccerBall />,
          },
          {
            id: "awayScore",
            name: "Gols Visitante",
            inputType: "number",
            icon: <GiSoccerBall />,
          },
        ],
        stoppageFields,
      ],
    },
    {
      title: "Tempo Extra",
      fields: [
        hasExtraTimeField,
        ...(hasExtraTime ? [extraTimeFields] : []),

        hasPenaltiesField,
        ...(hasPenalties ? [penaltiesFields] : []),
      ],
    },
  ];

  if (disciplineFields.length > 0) {
    formSections.push({
      title: "Disciplina",
      fields: Array.from(
        { length: Math.ceil(disciplineFields.length / 2) },
        (_, i) => disciplineFields.slice(i * 2, i * 2 + 2),
      ),
    });
  }

  if (subFields.length > 0) {
    formSections.push({
      title: "Substituições",
      fields: Array.from({ length: Math.ceil(subFields.length / 2) }, (_, i) =>
        subFields.slice(i * 2, i * 2 + 2),
      ),
    });
  }

  return formSections;
};
