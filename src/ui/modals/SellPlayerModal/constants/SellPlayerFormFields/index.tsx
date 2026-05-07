import { BsCalendar2Event } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiPoliceBadge } from "react-icons/gi";
import { RxLapTimer } from "react-icons/rx";
import { MdAttachMoney } from "react-icons/md";

export const getSellOrLoanFormFields = (isLoan?: boolean) => {
  return [
    ...(isLoan
      ? [
          [
            {
              id: "toClub",
              name: "Clube de destino",
              icon: <GiPoliceBadge />,
              placeholder: "Ex: Barcelona",
            },
            {
              id: "loanDuration",
              name: "Tempo de empréstimo",
              icon: <RxLapTimer />,
              placeholder: "Ex: 2, 1.6, 0.6",
            },
          ],
          [
            {
              id: "wagePercentage",
              name: "% Salário (destino)",
              icon: <MdAttachMoney />,
              placeholder: "Ex: 40, 45",
            },
            {
              id: "dateExit",
              name: "Data do empréstimo",
              icon: <BsCalendar2Event />,
              placeholder: "Ex: 11/07",
            },
          ],
        ]
      : [
          [
            {
              id: "toClub",
              name: "Clube de destino",
              icon: <GiPoliceBadge />,
              placeholder: "Ex: Barcelona",
            },
          ],
          [
            {
              id: "sellValue",
              name: "Valor da venda",
              icon: <FaMoneyBillTransfer />,
              placeholder: "Ex: 150k, 50M",
            },
            {
              id: "dateExit",
              name: "Data da venda",
              icon: <BsCalendar2Event />,
              placeholder: "Ex: 11/07",
            },
          ],
        ]),
  ];
};
