import { useState, useEffect } from "react";
import { Career } from "../../../../common/interfaces/Career";
import {
  BoardItem,
  CareerGroup,
} from "../../../../common/interfaces/CareerGroup";
import { ServiceCareer } from "../../../../common/services/ServiceCareer";

export const useCareerBoard = (initialCareers: Career[]) => {
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [pendingMerge, setPendingMerge] = useState<{
    sourceId: string;
    targetId: string;
    sourceLabel: string;
    targetLabel: string;
  } | null>(null);

  const [pendingRemoval, setPendingRemoval] = useState<{
    careerId: string;
    clubName: string;
    managerName: string;
    groupId: string;
  } | null>(null);

  const [toastError, setToastError] = useState<string | null>(null);

  useEffect(() => {
    const newBoardItems: BoardItem[] = [];
    const groupsMap = new Map<string, Career[]>();

    initialCareers.forEach((career) => {
      if (career.groupId) {
        const groupList = groupsMap.get(career.groupId) || [];
        groupList.push(career);
        groupsMap.set(career.groupId, groupList);
      } else {
        newBoardItems.push({ type: "single", id: career.id, data: career });
      }
    });

    groupsMap.forEach((groupedCareers, groupId) => {
      newBoardItems.push({
        type: "group",
        id: groupId,
        data: {
          id: groupId,
          managerName: groupedCareers[0]?.managerName || "",
          careers: groupedCareers,
          careerIds: groupedCareers.map((c) => c.id),
          createdAt: groupedCareers[0]?.createdAt || new Date(),
        },
      });
    });

    setBoardItems(newBoardItems);
  }, [initialCareers]);

  const requestMerge = (sourceId: string, targetId: string) => {
    const source = boardItems.find((i) => i.id === sourceId);
    const target = boardItems.find((i) => i.id === targetId);

    if (!source || !target || source.type !== "single") return;

    const sourceManager = source.data.managerName;
    const targetManager = target.data.managerName;

    if (sourceManager !== targetManager) {
      setToastError("Só é possível agrupar carreiras do mesmo treinador.");
      setTimeout(() => setToastError(null), 3000);
      return;
    }

    const targetLabel =
      target.type === "group"
        ? `Save de ${targetManager}`
        : target.data.clubName;

    setPendingMerge({
      sourceId,
      targetId,
      sourceLabel: source.data.clubName,
      targetLabel,
    });
  };

  const cancelMerge = () => setPendingMerge(null);

  const requestRemoval = (
    careerId: string,
    clubName: string,
    managerName: string,
    groupId: string,
  ) => {
    setPendingRemoval({ careerId, clubName, managerName, groupId });
  };

  const confirmMerge = async () => {
    if (!pendingMerge) return;

    setIsProcessing(true);

    try {
      const sourceIndex = boardItems.findIndex(
        (i) => i.id === pendingMerge.sourceId,
      );
      const targetIndex = boardItems.findIndex(
        (i) => i.id === pendingMerge.targetId,
      );

      if (sourceIndex === -1 || targetIndex === -1) return;

      const sourceItem = boardItems[sourceIndex];
      const targetItem = boardItems[targetIndex];

      if (sourceItem.type !== "single") return;

      const newItems = [...boardItems];
      let groupToSave: CareerGroup;

      if (targetItem.type === "single") {
        const newGroupId = `save-${Date.now()}`;
        sourceItem.data.groupId = newGroupId;
        targetItem.data.groupId = newGroupId;

        groupToSave = {
          id: newGroupId,
          managerName: targetItem.data.managerName,
          careers: [targetItem.data, sourceItem.data],
          careerIds: [targetItem.data.id, sourceItem.data.id],
          createdAt: new Date(),
        };

        newItems[targetIndex] = {
          type: "group",
          id: newGroupId,
          data: groupToSave,
        };
      } else {
        sourceItem.data.groupId = targetItem.data.id;

        groupToSave = {
          ...targetItem.data,
          careers: [...targetItem.data.careers, sourceItem.data],
          careerIds: [...targetItem.data.careerIds, sourceItem.data.id],
          updatedAt: Date.now(),
        };

        newItems[targetIndex] = {
          ...targetItem,
          data: groupToSave,
        };
      }

      newItems.splice(sourceIndex, 1);

      setBoardItems(newItems);
      setPendingMerge(null);

      await ServiceCareer.saveCareerGroup(groupToSave);
    } catch (error) {
      console.error("Erro ao salvar grupo de carreiras no banco: ", error);
      setToastError("Erro ao salvar o grupo de carreiras.");
      setTimeout(() => setToastError(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmRemoval = async () => {
    if (!pendingRemoval) return;

    setIsProcessing(true);

    try {
      const groupIndex = boardItems.findIndex(
        (i) => i.id === pendingRemoval.groupId,
      );
      if (groupIndex === -1) return;

      const group = boardItems[groupIndex];
      if (group.type !== "group") return;

      const newItems = [...boardItems];
      const updatedCareers = group.data.careers.filter(
        (c) => c.id !== pendingRemoval.careerId,
      );
      const removedCareer = group.data.careers.find(
        (c) => c.id === pendingRemoval.careerId,
      );

      if (!removedCareer) return;

      removedCareer.groupId = null;
      const updatedCareersIds = updatedCareers.map((c) => c.id);

      const removedSingle: BoardItem = {
        type: "single",
        id: removedCareer.id,
        data: removedCareer,
      };

      if (updatedCareers.length === 1) {
        updatedCareers[0].groupId = null;
        const lastSingle: BoardItem = {
          type: "single",
          id: updatedCareers[0].id,
          data: updatedCareers[0],
        };
        newItems.splice(groupIndex, 1, removedSingle, lastSingle);
      } else {
        newItems[groupIndex] = {
          ...group,
          data: {
            ...group.data,
            careers: updatedCareers,
            careerIds: updatedCareersIds,
            updatedAt: Date.now(),
          },
        };
        newItems.push(removedSingle);
      }

      setBoardItems(newItems);
      setPendingRemoval(null);

      await ServiceCareer.removeCareerFromGroup(
        pendingRemoval.careerId,
        pendingRemoval.groupId,
        updatedCareersIds,
      );
    } catch (error) {
      console.error("Erro ao remover carreira do grupo no banco: ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelRemoval = () => setPendingRemoval(null);

  return {
    boardItems,
    requestMerge,
    pendingMerge,
    confirmMerge,
    cancelMerge,
    requestRemoval,
    pendingRemoval,
    confirmRemoval,
    cancelRemoval,
    toastError,
    isProcessing,
  };
};
