import { Dispatch, SetStateAction } from "react";
import Input from "../../../../components/Input";

type EditManagerNameProps = {
  managerName: string;
  className: string;
  setManagerName: Dispatch<SetStateAction<string>>;
};

export const EditManagerName = ({
  managerName,
  className,
  setManagerName,
}: EditManagerNameProps) => (
  <Input
    className={className}
    name="manager"
    id="manager"
    value={managerName}
    onChange={(e) => setManagerName(e.target.value)}
    placeholder={managerName}
  />
);
