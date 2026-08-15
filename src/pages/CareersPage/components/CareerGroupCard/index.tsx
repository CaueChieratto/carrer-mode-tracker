import { useState } from "react";
import Styles from "./CareerGroupCard.module.css";
import { CareerGroup } from "../../../../common/interfaces/CareerGroup";
import { useCareerGroupData } from "./hooks/useCareerGroupData";
import { GroupHeader } from "./ui/GroupHeader";
import { GroupTimeline } from "./ui/GroupTimeline";
import {
  CareerGroupContext,
  useCareerPage,
} from "../../contexts/CareerPageContext";
import { Career } from "../../../../common/interfaces/Career";
import { ModalType } from "../../../../common/types/enums/ModalType";
import { GroupEditModal } from "./ui/GroupEditModal";

type CareerGroupCardProps = {
  save: CareerGroup;
};

export const CareerGroupCard = ({ save }: CareerGroupCardProps) => {
  const { sortedCareers, currentId, totalTrophies, startYear, endYear } =
    useCareerGroupData(save);
  const [expandedId, setExpandedId] = useState<string | null>(
    currentId ?? null,
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { onOpenModal, setSelectedCareer } = useCareerPage();

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleOpenGroupTrophies = () => {
    if (save.careers.length === 0) return;
    const groupCareer = {
      ...save.careers[0],
      id: save.id,
      groupedCareers: save.careers,
    } as Career & { groupedCareers?: Career[] };
    setSelectedCareer(groupCareer);
    onOpenModal(ModalType.SLIDE_UP_PANEL, groupCareer);
  };

  const handleEditCareer = (career: Career) => {
    setSelectedCareer(career);
    onOpenModal(ModalType.ADD_CLUB_IMG, career);
    setIsEditModalOpen(false);
  };

  return (
    <CareerGroupContext.Provider value={save.id}>
      <div className={Styles.groupContainer}>
        <GroupHeader
          managerName={save.managerName}
          careersCount={save.careers.length}
          startYear={startYear}
          endYear={endYear}
          totalTrophies={totalTrophies}
          onOpenTrophies={handleOpenGroupTrophies}
          onOpenEdit={() => setIsEditModalOpen(true)}
        />
        <GroupTimeline
          sortedCareers={sortedCareers}
          currentId={currentId}
          expandedId={expandedId}
          onToggleExpand={handleToggleExpand}
        />
      </div>

      {isEditModalOpen && (
        <GroupEditModal
          careers={save.careers}
          onClose={() => setIsEditModalOpen(false)}
          onSelectCareer={handleEditCareer}
        />
      )}
    </CareerGroupContext.Provider>
  );
};
