import { BiWorld } from "react-icons/bi";
import { GiCheckedShield } from "react-icons/gi";
import { GrUserManager } from "react-icons/gr";

export const createCareerFields = [
  {
    name: "club",
    icon: <GiCheckedShield size={15} />,
    placeholder: "Clube",
  },
  {
    name: "nation",
    icon: <BiWorld size={15} />,
    placeholder: "País",
  },
  {
    name: "manager",
    icon: <GrUserManager size={15} />,
    placeholder: "Técnico",
  },
];
