import { ComponentProps } from "react";
import Button from "../../../components/Button";
import { Career } from "../../interfaces/Career";
import { ModalType } from "../../types/enums/ModalType";

type ButtonProps = ComponentProps<typeof Button>;

export interface ButtonConfig {
  text: string;
  modal?: ModalType;
  props?: Omit<ButtonProps, "children" | "onClick">;
  onClick?: (career: Career) => void;
}

export const CareerCardButtons: ButtonConfig[] = [
  {
    text: "Entrar",
    onClick: (career) => (window.location.href = `/Career/${career.id}`),
    props: { radius: "square", color: "club_secondary", isActive: true },
  },
  {
    text: "Títulos",
    modal: ModalType.SLIDE_UP_PANEL,
    props: { radius: "square" },
  },
  {
    text: "Excluir",
    modal: ModalType.DELETE_CONFIRM,
    props: { radius: "square" },
  },
];
