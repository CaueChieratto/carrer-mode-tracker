declare module "react-world-flags" {
  import { ComponentType, SVGProps } from "react";

  interface FlagProps extends SVGProps<SVGSVGElement> {
    code: string;
  }

  const Flag: ComponentType<FlagProps>;

  export default Flag;
}
