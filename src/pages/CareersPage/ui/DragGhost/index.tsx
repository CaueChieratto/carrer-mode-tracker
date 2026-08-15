import { Career } from "../../../../common/interfaces/Career";
import Styles from "./DragGhost.module.css";

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
        style={{ backgroundColor: dragSource.colorsTeams?.[0] || "#f0f0f0" }}
      >
        {dragSource.teamBadge && (
          <img
            className={Styles.ghostImg}
            src={dragSource.teamBadge}
            alt="badge"
          />
        )}
      </div>
      <div className={Styles.ghostInfo}>
        <span className={Styles.ghostClub}>{dragSource.clubName}</span>
        <span className={Styles.ghostManager}>{dragSource.managerName}</span>
      </div>
    </div>
  );
};
