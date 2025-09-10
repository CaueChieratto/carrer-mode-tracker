import { Dispatch, SetStateAction } from "react";
import Input from "../../../../components/Input";

type EditClubNameProps = {
  clubName: string;
  className: string;
  setClubName: Dispatch<SetStateAction<string>>;
};

export const EditClubName = ({
  clubName,
  setClubName,
  className,
}: EditClubNameProps) => (
  <Input
    className={className}
    name="club"
    id="club"
    value={clubName}
    onChange={(e) => setClubName(e.target.value)}
    placeholder={clubName}
  />
);
