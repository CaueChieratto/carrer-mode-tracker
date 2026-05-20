import { LuCalendarClock } from "react-icons/lu";
import { Field } from "../../../../../../../components/FormSection";
import { IoMdTrophy } from "react-icons/io";
import { GiHouse, GiPoliceBadge } from "react-icons/gi";
import { FaTrashCan } from "react-icons/fa6";

export const getMatchFormFields = (
  leagueOptions: readonly string[],
  selectedMonth: string = "Tudo",
): {
  title: string;
  fields: readonly (readonly Field[])[];
}[] => {
  const isSpecificMonth = selectedMonth !== "Tudo";

  return [
    {
      title: "Ações",
      fields: [
        [
          {
            id: "deleteMatch",
            name: "Deletar essa partida?",
            icon: <FaTrashCan />,
            checkbox: true,
            action: "DELETE_MATCH",
            editOnly: true,
          },
        ],
      ],
    },
    {
      title: "Agendar partida",
      fields: [
        [
          {
            id: "date",
            name: isSpecificMonth ? `Dia de ${selectedMonth}` : "Data",
            inputType: "text",
            placeholder: isSpecificMonth ? "DD" : "DD/MM",
            icon: <LuCalendarClock />,
            maxLength: isSpecificMonth ? 2 : 5,
          },
          {
            id: "league",
            name: "Competição",
            inputType: "custom-select",
            placeholder: "Selecione...",
            icon: <IoMdTrophy />,
            options: leagueOptions,
          },
        ],
        [
          {
            id: "opponentTeam",
            name: "Adversário",
            inputType: "text",
            placeholder: "Nome da equipe",
            icon: <GiPoliceBadge />,
          },
        ],
        [
          {
            id: "isHomeMatch",
            name: "Jogar em casa?",
            icon: <GiHouse />,
            checkbox: true,
            note: "Marque se o seu time for o mandante da partida.",
          },
        ],
      ],
    },
  ];
};
