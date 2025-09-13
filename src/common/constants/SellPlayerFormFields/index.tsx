import { BsCalendar2Event } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiPoliceBadge } from "react-icons/gi";

export const formFields = [
  {
    id: "toClub",
    name: "Clube de destino",
    icon: <GiPoliceBadge />,
    placeholder: "Ex: Barcelona",
  },
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
];
