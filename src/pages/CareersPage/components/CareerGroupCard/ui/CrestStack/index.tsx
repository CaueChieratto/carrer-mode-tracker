import { useMemo } from "react";
import { Career } from "../../../../../../common/interfaces/Career";
import { ColorsService } from "../../../../../../common/services/ColorsService";
import Styles from "./CrestStack.module.css";
import { FaImage } from "react-icons/fa";

type CrestStackProps = {
  careers: Career[];
};

export const CrestStack = ({ careers }: CrestStackProps) => {
  const MAX_CRESTS = 3;

  const { shown, extraCount } = useMemo(() => {
    const shownCount =
      careers.length > MAX_CRESTS ? MAX_CRESTS - 1 : careers.length;

    return {
      shown: careers.slice(0, shownCount).reverse(),
      extraCount: careers.length - shownCount,
    };
  }, [careers]);

  return (
    <div className={Styles.crestStack}>
      {shown.map((c, i) => {
        const bgColor =
          ColorsService.getColorSaved(c.id) || c.colorsTeams?.[0] || "#333";

        return (
          <div
            key={c.id}
            className={Styles.crestMini}
            style={{ backgroundColor: bgColor, zIndex: i + 1 }}
          >
            {c.teamBadge ? (
              <img
                src={c.teamBadge}
                alt={c.clubName}
                className={Styles.crestMiniImg}
              />
            ) : (
              <FaImage size={13} color={"#fff"} />
            )}
          </div>
        );
      })}

      {extraCount > 0 && (
        <div
          className={`${Styles.crestMini} ${Styles.crestMiniExtra}`}
          style={{ zIndex: shown.length + 1 }}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
};
