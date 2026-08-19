import { Career } from "../../../../common/interfaces/Career";
import { ColorsService } from "../../../../common/services/ColorsService";
import Styles from "./DragGhost.module.css";
import { FaImage } from "react-icons/fa";

interface DragGhostProps {
  dragSource: Career;
  dragPos: { x: number; y: number };
  offsetX: number;
  offsetY: number;
}

export const DragGhost = ({
  dragSource,
  dragPos,
  offsetX,
  offsetY,
}: DragGhostProps) => {
  const bgColor =
    ColorsService.getColorSaved(dragSource.id) ||
    dragSource.colorsTeams?.[0] ||
    "#f0f0f0";

  return (
    <div
      className={Styles.ghost}
      style={{
        left: `${dragPos.x - offsetX}px`,
        top: `${dragPos.y - offsetY}px`,
      }}
    >
      <div
        className={Styles.ghostImgContainer}
        style={{ backgroundColor: bgColor }}
      >
        {dragSource.teamBadge ? (
          <img
            className={Styles.ghostImg}
            src={dragSource.teamBadge}
            alt="badge"
          />
        ) : (
          <FaImage size={24} color={"#000"} />
        )}
      </div>
      <div className={Styles.ghostInfo}>
        <span className={Styles.ghostClub}>{dragSource.clubName}</span>
        <span className={Styles.ghostManager}>{dragSource.managerName}</span>
      </div>
    </div>
  );
};
