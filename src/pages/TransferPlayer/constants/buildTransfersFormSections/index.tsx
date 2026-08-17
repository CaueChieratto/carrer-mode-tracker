import { BsCalendar2Event } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiPoliceBadge } from "react-icons/gi";
import { FaUserClock, FaFileInvoice } from "react-icons/fa";
import { BooleanValues } from "../../types";

export const buildTransferSections = (booleanValues: BooleanValues) => {
  const isSpecialExit =
    booleanValues.isRetirement || booleanValues.isEndContract;

  return [
    {
      title: "Status de Saída",
      fields: [
        [
          {
            id: "isRetirement",
            name: "Aposentou?",
            icon: <FaUserClock />,
            checkbox: true,
          },
          {
            id: "isEndContract",
            name: "Fim de Contrato?",
            icon: <FaFileInvoice />,
            checkbox: true,
          },
        ],
      ],
    },
    {
      title: "Detalhes da Transferência",
      fields: [
        ...(!isSpecialExit
          ? [
              [
                {
                  id: "toClub",
                  name: "Clube de destino",
                  icon: <GiPoliceBadge />,
                  placeholder: "Ex: Barcelona",
                },
              ],
            ]
          : []),
        [
          ...(!isSpecialExit
            ? [
                {
                  id: "sellValue",
                  name: "Valor da venda",
                  icon: <FaMoneyBillTransfer />,
                  placeholder: "Ex: 150k, 50M",
                  maxLength: 7,
                },
              ]
            : []),
          {
            id: "dateExit",
            name: "Data da saída",
            icon: <BsCalendar2Event />,
            placeholder: "Ex: 11/07",
            maxLength: 5,
          },
        ],
      ].filter((row) => row.length > 0),
    },
  ];
};
