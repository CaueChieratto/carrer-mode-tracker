import { BsCalendar2Event } from "react-icons/bs";
import { FaUndo } from "react-icons/fa";
import { GiPoliceBadge } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";
import { RxLapTimer } from "react-icons/rx";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { BooleanValues } from "../../types";

export const buildLoanSections = (
  booleanValues: BooleanValues,
  player: Players,
  teamOptions: string[] = [],
) => {
  return [
    ...(player.loan
      ? [
          {
            title: "Status do Empréstimo",
            fields: [
              [
                {
                  id: "isReturnLoan",
                  name: "Encerrou o empréstimo?",
                  icon: <FaUndo />,
                  checkbox: true,
                },
              ],
            ],
          },
        ]
      : []),
    {
      title: "Detalhes do Empréstimo",
      fields: [
        ...(!booleanValues.isReturnLoan
          ? [
              [
                {
                  id: "toClub",
                  name: "Clube de destino",
                  icon: <GiPoliceBadge />,
                  placeholder: "Ex: Barcelona",
                  inputType: "searchable-select",
                  options: teamOptions,
                },
              ],
              [
                {
                  id: "loanDuration",
                  name: "Duração (Anos)",
                  icon: <RxLapTimer />,
                  placeholder: "Ex: 1, 2",
                  inputType: "number",
                },
                {
                  id: "wagePercentage",
                  name: "% Salário (destino)",
                  icon: <MdAttachMoney />,
                  placeholder: "Ex: 40, 45",
                  inputType: "number",
                  maxLength: 3,
                },
              ],
            ]
          : []),
        [
          {
            id: "dateExit",
            name: booleanValues.isReturnLoan
              ? "Data de retorno"
              : "Data do empréstimo",
            icon: <BsCalendar2Event />,
            placeholder: "Ex: 11/07",
            maxLength: 5,
          },
        ],
      ].filter((row) => row.length > 0),
    },
  ];
};
