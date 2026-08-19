import { BiWorld } from "react-icons/bi";
import { CiCalendar } from "react-icons/ci";
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
  {
    name: "createdAt",
    icon: <CiCalendar size={15} />,
    placeholder: "Data de início do save",
  },
];
