import {
  FaUser,
  FaGlobe,
  FaTshirt,
  FaSignature,
  FaHandHoldingUsd,
  FaUndo,
} from "react-icons/fa";
import { GiPodium, GiSoccerField } from "react-icons/gi";
import { MdAttachMoney, MdNumbers, MdSell } from "react-icons/md";
import { BsCalendar } from "react-icons/bs";
import { RxLapTimer } from "react-icons/rx";
import CaptainArmbandIcon from "../../../../../../../../ui/CaptainArmbandIcon";
import { FaTrashCan } from "react-icons/fa6";
import { ModalType } from "../../../../../../../../common/types/enums/ModalType";
import { TbBrandElectronicArts } from "react-icons/tb";

export const positionOptionsBySector = {
  Ataque: ["PE", "PD", "ATA"],
  Meia: ["VOL", "ME", "MC", "MD", "MEI"],
  Defesa: ["LE", "ZAG", "LD"],
  Goleiro: ["GOL"],
} as const;

export const squadFormFields = [
  {
    title: "Ações",
    editOnly: true,
    fields: [
      [
        {
          id: "sell",
          name: "Vender jogador?",
          icon: <MdSell />,
          checkbox: true,
          action: ModalType.SELL_PLAYER,
          hideOnIncomingLoanPlayer: true,
        },
        {
          id: "loan",
          name: "Emprestar jogador?",
          icon: <MdSell />,
          checkbox: true,
          action: ModalType.LOAN_PLAYER,
          hideOnIncomingLoanPlayer: true,
        },
      ],
      [
        {
          id: "back",
          name: "Encerrou o empréstimo?",
          icon: <FaUndo />,
          checkbox: true,
          action: ModalType.RETURN_LOAN_CONFIRM,
          loanOnly: true,
        },
      ],
    ],
  },
  {
    title: "Status",
    fields: [
      [
        {
          id: "isSigning",
          name: "É uma compra?",
          icon: <FaSignature />,
          checkbox: true,
          addOnly: true,
        },
        {
          id: "isLoan",
          name: "É um empréstimo?",
          icon: <FaSignature />,
          checkbox: true,
          addOnly: true,
        },
      ],
      [
        {
          id: "isCaptain",
          name: "É um dos capitães?",
          icon: <CaptainArmbandIcon />,
          checkbox: true,
          note: "Você pode selecionar até 5 capitães.",
        },
      ],
    ],
  },
  {
    title: "Informações do Jogador",
    fields: [
      [
        {
          id: "playerName",
          name: "Nome do Jogador",
          placeholder: "Ex: Lionel Messi",
          icon: <FaUser />,
        },
        {
          id: "overall",
          name: "Overall",
          inputType: "number",
          placeholder: "Ex: 87",
          icon: <TbBrandElectronicArts />,
          max: 99,
        },
      ],
      [
        {
          id: "sector",
          name: "Setor",
          placeholder: "Selecione...",
          icon: <GiSoccerField />,
          inputType: "custom-select",
          options: ["Ataque", "Meia", "Defesa", "Goleiro"],
        },
        {
          id: "position",
          name: "Posição",
          placeholder: "Selecione...",
          icon: <GiSoccerField />,
          inputType: "custom-select",
        },
      ],
      [
        {
          id: "age",
          name: "Idade",
          inputType: "number",
          placeholder: "Ex: 37",
          icon: <BsCalendar />,
          min: 13,
          max: 50,
        },
        {
          id: "nation",
          name: "País",
          placeholder: "Ex: ARG",
          icon: <FaGlobe />,
          maxLength: 3,
          transform: "uppercase",
        },
        {
          id: "shirtNumber",
          name: "Número",
          inputType: "number",
          placeholder: "Ex: 10",
          icon: <FaTshirt />,
          min: 0,
          max: 99,
        },
      ],
    ],
  },
  {
    title: "Detalhes Contratuais",
    fields: [
      [
        {
          id: "fromClub",
          name: "Clube de Origem",
          inputType: "text",
          placeholder: "Ex: Barcelona",
          icon: <GiPodium />,
          showOnJoin: true,
          hideOnSell: true,
        },
      ],
      [
        {
          id: "playerValue",
          name: "Valor do Jogador",
          inputType: "text",
          placeholder: "Ex: 100M, 1.5B, 500k",
          icon: <MdNumbers />,
          hideOnSell: true,
          maxLength: 7,
        },
        {
          id: "buyValue",
          name: "Valor da Compra",
          inputType: "text",
          placeholder: "Ex: 100M, 1.5B, 500k",
          icon: <FaHandHoldingUsd />,
          isSigningOnly: true,
          maxLength: 7,
        },
        {
          id: "loanDuration",
          name: "Tempo do Empréstimo",
          inputType: "number",
          placeholder: "Ex: 1, 2",
          icon: <RxLapTimer />,
          isIncomingLoanOnly: true,
        },
      ],
      [
        {
          id: "salary",
          name: "Salário (Semanal)",
          inputType: "text",
          placeholder: "Ex: 50k, 1.2M",
          icon: <MdAttachMoney />,
          hideOnSell: true,
          maxLength: 7,
        },
        {
          id: "contractTime",
          name: "Tempo de contrato",
          inputType: "number",
          placeholder: "Ex: 4",
          icon: <RxLapTimer />,
          hideOnSell: true,
          hideOnIncomingLoan: true,
          maxLength: 1,
        },
        {
          id: "wagePercentage",
          name: "% Salário pago",
          inputType: "number",
          placeholder: "Ex: 50, 100",
          icon: <MdAttachMoney />,
          isIncomingLoanOnly: true,
          maxLength: 3,
        },
      ],
      [
        {
          id: "dateArrival",
          name: "Data da contratação",
          placeholder: "Ex: 11/07",
          icon: <RxLapTimer />,
          showOnJoin: true,
          maxLength: 5,
        },
      ],
    ],
  },
  {
    title: "Manutenção",
    editOnly: true,
    fields: [
      [
        {
          id: "delete",
          name: "Deletar esse jogador?",
          icon: <FaTrashCan />,
          checkbox: true,
          action: ModalType.DELETE_PLAYER_CONFIRM,
        },
      ],
    ],
  },
] as const;
