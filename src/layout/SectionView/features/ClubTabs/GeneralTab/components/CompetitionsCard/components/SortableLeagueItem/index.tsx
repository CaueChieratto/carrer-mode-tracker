import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TbMenuOrder } from "react-icons/tb";
import Styles from "../../CompetitionsCard.module.css";
import { League } from "../../../../../../../../../common/interfaces/League";

type SortableLeagueItemProps = {
  league: League;
};

const SortableLeagueItem = ({ league }: SortableLeagueItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: league.name,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 99 : "auto",
    position: isDragging ? ("relative" as const) : ("static" as const),
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} className={Styles.league_item}>
      <div className={Styles.wrapper}>
        <div className={Styles.background_img}>
          <img
            src={league.logo}
            alt={`Logo da competição ${league.name}`}
            className={Styles.logo}
          />
        </div>

        <span className={Styles.name}>{league.name}</span>
      </div>

      <div {...attributes} {...listeners} className={Styles.drag_handle}>
        <TbMenuOrder size={25} />
      </div>
    </div>
  );
};

export default SortableLeagueItem;
