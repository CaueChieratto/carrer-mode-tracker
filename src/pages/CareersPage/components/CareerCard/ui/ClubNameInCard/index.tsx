import Styles from "./ClubNameInCard.module.css";
import { FaChevronDown } from "react-icons/fa6";
import { FaImage, FaUnlink } from "react-icons/fa";
import ContainerIcon from "../../../../../../components/ContainerIcon";
import { ModalType } from "../../../../../../common/types/enums/ModalType";
import { Career } from "../../../../../../common/interfaces/Career";
import {
  useCareerPage,
  useCareerGroup,
} from "../../../../contexts/CareerPageContext";
import { useClubColor } from "../../hooks/useClubColor";
import { useLongPressDrag } from "../../hooks/useLongPressDrag";

type ClubNameInCardProps = {
  clubName: string;
  colorsTeams: string[];
  managerName: string;
  teamBadge: string;
  selectedCareer: Career;
  isGroupItem?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

export const ClubNameInCard = ({
  clubName,
  colorsTeams,
  managerName,
  selectedCareer,
  teamBadge,
  isGroupItem,
  isExpanded,
  onToggleExpand,
}: ClubNameInCardProps) => {
  const { onDragStart, setSelectedCareer, onOpenModal, requestRemoval } =
    useCareerPage();

  const groupId = useCareerGroup();

  const { colorDefault, toggleColor } = useClubColor({
    selectedCareer,
    colorsTeams,
  });

  const dragEvents = useLongPressDrag({ onDragStart, selectedCareer });

  const ImageElement = (
    <div
      className={Styles.container_img}
      style={{ backgroundColor: colorDefault }}
      onClick={(e) => {
        e.stopPropagation();
        toggleColor();
      }}
    >
      {teamBadge ? (
        <img
          className={Styles.img}
          src={teamBadge}
          alt={`Badge do ${clubName}`}
        />
      ) : (
        <ContainerIcon
          className={Styles.icon}
          onClickEvent={(e) => {
            e.stopPropagation();
            setSelectedCareer(selectedCareer);
            onOpenModal(ModalType.ADD_CLUB_IMG, selectedCareer);
          }}
        >
          <FaImage size={26} color={"#fff"} />
        </ContainerIcon>
      )}
    </div>
  );

  if (isGroupItem) {
    return (
      <header
        className={Styles.group_header}
        onClick={onToggleExpand}
        {...dragEvents}
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
      >
        {ImageElement}
        <div className={Styles.group_info}>
          <div className={Styles.group_title_row}>
            <span className={Styles.group_team_name}>{clubName}</span>
          </div>
          <span className={Styles.group_player_sub}>{managerName}</span>
        </div>
        <FaChevronDown
          size={16}
          className={`${Styles.chevron} ${isExpanded ? Styles.chevron_open : ""}`}
        />
        {groupId && requestRemoval && (
          <button
            type="button"
            className={Styles.unlink_btn}
            aria-label="Remover desta save"
            title="Remover desta save"
            onClick={(e) => {
              e.stopPropagation();
              requestRemoval(selectedCareer.id, clubName, managerName, groupId);
            }}
          >
            <FaUnlink size={12} />
          </button>
        )}
      </header>
    );
  }

  return (
    <header className={Styles.container_header}>
      <div
        className={Styles.container_info}
        {...dragEvents}
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
      >
        <h2 className={Styles.h2}>{clubName}</h2>
        <p className={Styles.p}>{managerName}</p>
      </div>
      {ImageElement}
    </header>
  );
};
