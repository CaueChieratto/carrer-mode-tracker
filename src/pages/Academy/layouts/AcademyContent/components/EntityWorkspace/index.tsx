import { useEntityWorkspace } from "../../hooks/useEntityWorkspace";
import { EntityActionLink, EntityAction } from "../EntityActionLink";

type EntityWorkspaceProps<T extends { id: string }> = {
  entity: T | null;
  keepOpenState?: string;
  actions: EntityAction[];
  getCustomBack?: (
    activeComponent: string,
  ) => { target: string | null; title: string; subtitle: string } | null;
  children: (
    activeComponent: string | null,
    activeContentRef: React.RefObject<HTMLDivElement>,
    setActiveComponent: (component: string | null) => void,
  ) => React.ReactNode;
};

export const EntityWorkspace = <T extends { id: string }>({
  entity,
  keepOpenState,
  actions,
  getCustomBack,
  children,
}: EntityWorkspaceProps<T>) => {
  const {
    activeComponent,
    setActiveComponent,
    containerRef,
    activeContentRef,
  } = useEntityWorkspace(entity, keepOpenState);

  if (!entity) return null;

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {children(activeComponent, activeContentRef, setActiveComponent)}
      <EntityActionLink
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        actions={actions}
        customBack={
          activeComponent && getCustomBack
            ? getCustomBack(activeComponent)
            : null
        }
      />
    </div>
  );
};
