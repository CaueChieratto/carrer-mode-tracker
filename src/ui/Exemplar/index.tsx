import { useState, useRef, useEffect } from "react";
import {
  FaPencilAlt,
  FaTrophy,
  FaChevronDown,
  FaWalking,
  FaUnlink,
} from "react-icons/fa";

// ---------- tipos ----------
type Career = {
  id: string;
  groupId: string | null;
  team: string;
  player: string;
  titles: number;
  createdAt: string;
  crestBg: string;
  crestFg: string;
  initials: string;
};

type BoardSingleItem = {
  type: "single";
  id: string;
  career: Career;
};

type BoardGroupItem = {
  type: "group";
  id: string;
  careers: Career[];
};

type BoardItem = BoardSingleItem | BoardGroupItem;

type PendingMerge = {
  sourceId: string;
  targetId: string;
  targetType: "single" | "group";
  sourceLabel: string;
  targetLabel: string;
  player: string;
};

type PendingRemoval = {
  careerId: string;
  team: string;
  player: string;
  groupId: string;
};

type DragInfo = {
  id: string;
  offsetX: number;
  offsetY: number;
};

// ---------- dados de exemplo ----------
// "save-ganso" já é um grupo existente (resultado do exemplo anterior).
// c2222 e c1111 estão soltas: arraste o escudo de uma sobre a outra pra testar.
const defaultCareers: Career[] = [
  {
    id: "velez",
    groupId: "save-ganso",
    team: "Vélez Sarsfield",
    player: "Ganso",
    titles: 8,
    createdAt: "01/01/2025",
    crestBg: "#1c3f94",
    crestFg: "#ffffff",
    initials: "VS",
  },
  {
    id: "rangers",
    groupId: "save-ganso",
    team: "Rangers",
    player: "Ganso",
    titles: 8,
    createdAt: "01/07/2028",
    crestBg: "#0a2a8f",
    crestFg: "#ffffff",
    initials: "R",
  },
  {
    id: "c2222",
    groupId: null,
    team: "2222222222",
    player: "Pep Guardiola",
    titles: 0,
    createdAt: "13/08/2026",
    crestBg: "#d4af17",
    crestFg: "#1a1a1a",
    initials: "22",
  },
  {
    id: "c1111",
    groupId: null,
    team: "1111111111",
    player: "Pep Guardiola",
    titles: 0,
    createdAt: "13/08/2026",
    crestBg: "#2e7d4f",
    crestFg: "#ffffff",
    initials: "11",
  },
];

function parseBrDate(str: string): Date {
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y, m - 1, d);
}

// ---------- agrupa a lista plana de carreiras ----------
function buildBoardItems(careers: Career[]): BoardItem[] {
  const items: BoardItem[] = [];
  const groups = new Map<string, BoardGroupItem>();

  for (const c of careers) {
    if (!c.groupId) {
      items.push({
        type: "single",
        id: c.id,
        career: c,
      });
      continue;
    }

    if (!groups.has(c.groupId)) {
      const groupItem: BoardGroupItem = {
        type: "group",
        id: c.groupId,
        careers: [],
      };

      groups.set(c.groupId, groupItem);
      items.push(groupItem);
    }

    groups.get(c.groupId)!.careers.push(c);
  }

  return items;
}

// ---------- card solto ----------
type StandaloneCardProps = {
  career: Career;
  isDragging: boolean;
  isOver: boolean;
  dropInvalid: boolean;
  onDragStart: (e: React.PointerEvent<HTMLDivElement>, career: Career) => void;
};

function StandaloneCard({
  career,
  isDragging,
  isOver,
  dropInvalid,
  onDragStart,
}: StandaloneCardProps) {
  return (
    <div
      className={`cb-card ${isDragging ? "cb-card-dragging" : ""}`}
      data-drop-id={career.id}
    >
      <button
        type="button"
        className="cb-icon-btn cb-edit-btn"
        aria-label="Editar carreira"
      >
        <FaPencilAlt size={14} />
      </button>

      <div className="cb-card-top">
        <div>
          <h3 className="cb-card-title">{career.team}</h3>
          <p className="cb-card-sub">{career.player}</p>
        </div>

        <div
          className="cb-crest cb-drag-handle"
          style={{
            background: career.crestBg,
            color: career.crestFg,
          }}
          onPointerDown={(e) => onDragStart(e, career)}
          title="Arraste para agrupar com outra carreira"
        >
          {career.initials}
        </div>
      </div>

      <div className="cb-divider" />

      <div className="cb-titles-row">
        <span>
          Total de Títulos: <strong>{career.titles}</strong>
        </span>
        <FaWalking size={16} className="cb-row-icon" />
      </div>

      <div className="cb-divider" />

      <p className="cb-created">Criado em {career.createdAt}</p>

      <div className="cb-actions">
        <button type="button" className="cb-btn cb-btn-primary">
          Entrar
        </button>

        <button type="button" className="cb-btn cb-btn-outline">
          Títulos
        </button>

        <button type="button" className="cb-btn cb-btn-outline cb-btn-danger">
          Excluir
        </button>
      </div>

      {isOver && (
        <div
          className={`cb-drop-overlay ${
            dropInvalid ? "cb-drop-invalid" : "cb-drop-valid"
          }`}
        >
          <span>
            {dropInvalid ? "Jogadores diferentes" : "Soltar para agrupar"}
          </span>
        </div>
      )}
    </div>
  );
}

// ---------- card de save ----------
type GroupCardProps = {
  groupId: string;
  careers: Career[];
  isOver: boolean;
  dropInvalid: boolean;
  onRequestRemove: (career: Career) => void;
};

function GroupCard({
  groupId,
  careers,
  isOver,
  dropInvalid,
  onRequestRemove,
}: GroupCardProps) {
  const sorted = [...careers].sort(
    (a, b) =>
      parseBrDate(a.createdAt).getTime() - parseBrDate(b.createdAt).getTime(),
  );

  const currentId = sorted[sorted.length - 1]?.id;

  const [expandedId, setExpandedId] = useState<string | null>(
    currentId ?? null,
  );

  const player = sorted[0]?.player ?? "";

  const totalTitles = careers.reduce((sum, c) => sum + c.titles, 0);

  const startYear = sorted.length
    ? parseBrDate(sorted[0].createdAt).getFullYear()
    : 0;

  const endYear = sorted.length
    ? parseBrDate(sorted[sorted.length - 1].createdAt).getFullYear()
    : 0;

  return (
    <div className="cb-group-card" data-drop-id={groupId}>
      <header className="cb-header">
        <div className="cb-player">
          <div>
            <h2 className="cb-player-name">{player}</h2>

            <p className="cb-meta">
              {careers.length} carreiras · {startYear}–{endYear}
            </p>
          </div>
        </div>

        <div className="cb-header-actions">
          <div className="cb-total-titles">
            <FaTrophy size={13} />
            <span>{totalTitles}</span>
          </div>

          <button
            type="button"
            className="cb-icon-btn"
            aria-label="Editar save"
          >
            <FaPencilAlt size={14} />
          </button>
        </div>
      </header>

      <div className="cb-timeline">
        {sorted.map((career, index) => {
          const isExpanded = expandedId === career.id;
          const isCurrent = career.id === currentId;
          const isLast = index === sorted.length - 1;

          return (
            <div className="cb-timeline-row" key={career.id}>
              <div className="cb-timeline-rail">
                <div
                  className={`cb-dot ${isCurrent ? "cb-dot-current" : ""}`}
                />

                {!isLast && <div className="cb-line" />}
              </div>
              <div
                className={`cb-career ${isCurrent ? "cb-career-current" : ""}`}
              >
                {/* div em vez de button, pra poder aninhar o botão de desvincular sem
                    ferir a regra de HTML de "botão dentro de botão" */}
                <div
                  role="button"
                  tabIndex={0}
                  className="cb-career-summary"
                  onClick={() => setExpandedId(isExpanded ? null : career.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedId(isExpanded ? null : career.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  <div
                    className="cb-crest"
                    style={{
                      background: career.crestBg,
                      color: career.crestFg,
                    }}
                  >
                    {career.initials}
                  </div>

                  <div className="cb-career-info">
                    <div className="cb-career-title-row">
                      <span className="cb-team-name">{career.team}</span>

                      {isCurrent && <span className="cb-badge">Atual</span>}
                    </div>

                    <span className="cb-player-sub">{career.player}</span>
                  </div>

                  <FaChevronDown
                    size={16}
                    className={`cb-chevron ${
                      isExpanded ? "cb-chevron-open" : ""
                    }`}
                  />

                  <button
                    type="button"
                    className="cb-unlink-btn"
                    aria-label={`Remover ${career.team} desta save`}
                    title="Remover desta save"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestRemove(career);
                    }}
                  >
                    <FaUnlink size={12} />
                  </button>
                </div>

                {isExpanded && (
                  <div className="cb-career-body">
                    <div className="cb-divider" />

                    <div className="cb-titles-row">
                      <span>
                        Total de Títulos: <strong>{career.titles}</strong>
                      </span>

                      <FaWalking size={16} className="cb-row-icon" />
                    </div>

                    <div className="cb-divider" />

                    <p className="cb-created">Criado em {career.createdAt}</p>

                    <div className="cb-actions">
                      <button type="button" className="cb-btn cb-btn-primary">
                        Entrar
                      </button>

                      <button type="button" className="cb-btn cb-btn-outline">
                        Títulos
                      </button>

                      <button
                        type="button"
                        className="cb-btn cb-btn-outline cb-btn-danger"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isOver && (
        <div
          className={`cb-drop-overlay ${
            dropInvalid ? "cb-drop-invalid" : "cb-drop-valid"
          }`}
        >
          <span>
            {dropInvalid
              ? "Jogadores diferentes"
              : `Adicionar à save de ${player}`}
          </span>
        </div>
      )}
    </div>
  );
}

// ---------- quadro principal ----------
type CareerBoardProps = {
  data?: Career[];
};

export default function Exemplar({ data = defaultCareers }: CareerBoardProps) {
  const [careers, setCareers] = useState<Career[]>(data);

  const [dragId, setDragId] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<Career | null>(null);

  const [dragPos, setDragPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [overId, setOverId] = useState<string | null>(null);

  const [pendingMerge, setPendingMerge] = useState<PendingMerge | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(
    null,
  );

  const [toast, setToast] = useState<string | null>(null);

  const dragInfoRef = useRef<DragInfo | null>(null);
  const overIdRef = useRef<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(
    null,
  );

  function handleDragStart(
    e: React.PointerEvent<HTMLDivElement>,
    career: Career,
  ) {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();

    dragInfoRef.current = {
      id: career.id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    setDragId(career.id);
    setDragSource(career);

    setDragPos({
      x: e.clientX,
      y: e.clientY,
    });

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Alguns ambientes não suportam pointer capture.
    }

    window.addEventListener("pointermove", handleDragMove);

    window.addEventListener("pointerup", handleDragEnd);
  }

  function handleDragMove(e: PointerEvent) {
    if (!dragInfoRef.current) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    setDragPos({
      x: e.clientX,
      y: e.clientY,
    });

    const el = document.elementFromPoint(e.clientX, e.clientY);

    const dropEl = el?.closest("[data-drop-id]");

    const id = dropEl?.getAttribute("data-drop-id") ?? null;

    const finalId = id && id !== dragInfoRef.current.id ? id : null;

    overIdRef.current = finalId;
    setOverId(finalId);
  }

  function handleDragEnd() {
    window.removeEventListener("pointermove", handleDragMove);

    window.removeEventListener("pointerup", handleDragEnd);

    const info = dragInfoRef.current;
    const targetId = overIdRef.current;

    dragInfoRef.current = null;
    overIdRef.current = null;

    setDragId(null);
    setDragSource(null);
    setDragPos(null);
    setOverId(null);

    if (info && targetId) {
      attemptMerge(info.id, targetId);
    }
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleDragMove);

      window.removeEventListener("pointerup", handleDragEnd);

      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function attemptMerge(sourceId: string, targetId: string) {
    const source = careers.find((c) => c.id === sourceId);

    if (!source) return;

    const targetSingle = careers.find((c) => c.id === targetId && !c.groupId);

    const targetGroupMembers = careers.filter((c) => c.groupId === targetId);

    let targetType: "single" | "group";
    let targetPlayer: string;
    let targetLabel: string;
    let resolvedTargetId: string;

    if (targetSingle) {
      targetType = "single";
      targetPlayer = targetSingle.player;
      targetLabel = targetSingle.team;
      resolvedTargetId = targetSingle.id;
    } else if (targetGroupMembers.length > 0) {
      targetType = "group";
      targetPlayer = targetGroupMembers[0].player;
      targetLabel = `save de ${targetPlayer}`;
      resolvedTargetId = targetId;
    } else {
      return;
    }

    // Só une carreiras do mesmo jogador/treinador.
    if (source.player !== targetPlayer) {
      setToast("Só é possível agrupar carreiras do mesmo jogador.");

      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }

      toastTimerRef.current = window.setTimeout(() => setToast(null), 2200);

      return;
    }

    setPendingMerge({
      sourceId,
      targetId: resolvedTargetId,
      targetType,
      sourceLabel: source.team,
      targetLabel,
      player: source.player,
    });
  }

  function confirmMerge() {
    if (!pendingMerge) return;

    setCareers((prev) => {
      if (pendingMerge.targetType === "single") {
        const newGroupId = `save-${Date.now()}`;

        return prev.map((c) =>
          c.id === pendingMerge.sourceId || c.id === pendingMerge.targetId
            ? {
                ...c,
                groupId: newGroupId,
              }
            : c,
        );
      }

      return prev.map((c) =>
        c.id === pendingMerge.sourceId
          ? {
              ...c,
              groupId: pendingMerge.targetId,
            }
          : c,
      );
    });

    setPendingMerge(null);
  }

  function cancelMerge() {
    setPendingMerge(null);
  }

  // ---- remover uma carreira de dentro de uma save ----
  function confirmRemoval() {
    if (!pendingRemoval) return;

    setCareers((prev) => {
      const groupMembers = prev.filter(
        (c) => c.groupId === pendingRemoval.groupId,
      );
      const remaining = groupMembers.filter(
        (c) => c.id !== pendingRemoval.careerId,
      );

      return prev.map((c) => {
        if (c.id === pendingRemoval.careerId) {
          // volta a ser uma carreira solta
          return { ...c, groupId: null };
        }

        // se sobrar só uma carreira no grupo, a save deixa de existir
        // e essa carreira restante também volta a ficar solta
        if (remaining.length === 1 && c.id === remaining[0].id) {
          return { ...c, groupId: null };
        }

        return c;
      });
    });

    setPendingRemoval(null);
  }

  function cancelRemoval() {
    setPendingRemoval(null);
  }

  const items = buildBoardItems(careers);

  return (
    <div className="cb-board">
      <style>{`
        .cb-board {
          --cb-bg-page: #14161a;
          --cb-card-bg: #262a31;
          --cb-card-bg-alt: #2c3039;
          --cb-border: #383c44;
          --cb-border-soft: #2f333a;
          --cb-text: #f5f6f7;
          --cb-text-muted: #9aa1ab;
          --cb-text-faint: #6b7280;
          --cb-accent: #47a980;
          --cb-accent-soft: rgba(71, 169, 128, 0.12);
          --cb-danger: #e0687a;
          --cb-danger-soft: rgba(224, 104, 122, 0.14);
          --cb-radius-lg: 16px;
          --cb-radius-md: 12px;
          --cb-radius-sm: 8px;
          --cb-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif;

          font-family: var(--cb-font);
          background: var(--cb-bg-page);
          padding: 32px 16px 64px;
        }

        .cb-board *,
        .cb-board *::before,
        .cb-board *::after {
          box-sizing: border-box;
        }

        .cb-hint {
          max-width: 900px;
          margin: 0 auto 20px;
          text-align: center;
          font-size: 12.5px;
          color: var(--cb-text-faint);
        }

        .cb-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(300px, 1fr)
          );
          gap: 20px;
          align-items: start;
        }

        /* ---- superfície comum dos cards ---- */

        .cb-card,
        .cb-group-card {
          position: relative;
          background: var(--cb-card-bg);
          border: 1px solid var(--cb-border-soft);
          border-radius: var(--cb-radius-lg);
          box-shadow: 0 12px 30px -14px rgba(0, 0, 0, 0.55);
          overflow: hidden;
          transition: opacity 0.15s ease;
        }

        .cb-card {
          padding: 50px 20px 20px;
        }

        .cb-group-card {
          padding: 20px;
        }

        .cb-card-dragging {
          opacity: 0.35;
        }

        .cb-icon-btn {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          border: 1px solid var(--cb-border);
          background: transparent;
          color: var(--cb-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            border-color 0.15s ease,
            color 0.15s ease;
        }

        .cb-icon-btn:hover {
          border-color: var(--cb-text-muted);
          color: var(--cb-text);
        }

        .cb-edit-btn {
          position: absolute;
          top: 14px;
          right: 14px;
        }

        .cb-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .cb-card-title {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
          color: var(--cb-text);
          line-height: 1.15;
        }

        .cb-card-sub {
          margin: 2px 0 0;
          font-size: 13px;
          color: var(--cb-text-muted);
        }

        .cb-crest {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          border: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
        }

        .cb-drag-handle {
          cursor: grab;
          touch-action: none;
          transition: transform 0.15s ease;
        }

        .cb-drag-handle:hover {
          transform: scale(1.06);
        }

        .cb-drag-handle:active {
          cursor: grabbing;
        }

        .cb-divider {
          height: 1px;
          background: var(--cb-border-soft);
          margin: 0 0 12px;
        }

        .cb-titles-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: var(--cb-text);
          margin-bottom: 12px;
        }

        .cb-titles-row strong {
          font-weight: 800;
        }

        .cb-row-icon {
          color: var(--cb-text-faint);
        }

        .cb-created {
          margin: 0 0 14px;
          text-align: center;
          font-size: 12.5px;
          font-weight: 700;
          color: var(--cb-accent);
        }

        .cb-actions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .cb-btn {
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          padding: 9px 6px;
          border-radius: var(--cb-radius-sm);
          cursor: pointer;
          transition:
            filter 0.15s ease,
            background 0.15s ease,
            color 0.15s ease,
            border-color 0.15s ease;
        }

        .cb-btn:focus-visible {
          outline: 2px solid var(--cb-accent);
          outline-offset: 2px;
        }

        .cb-btn-primary {
          border: 1px solid var(--cb-accent);
          background: var(--cb-accent);
          color: #0f1512;
        }

        .cb-btn-primary:hover {
          filter: brightness(1.08);
        }

        .cb-btn-outline {
          border: 1px solid rgba(71, 169, 128, 0.5);
          background: transparent;
          color: var(--cb-accent);
        }

        .cb-btn-outline:hover {
          background: var(--cb-accent-soft);
        }

        .cb-btn-danger:hover {
          border-color: var(--cb-danger);
          color: var(--cb-danger);
          background: var(--cb-danger-soft);
        }

        .cb-btn-outline-danger {
          border: 1px solid rgba(224, 104, 122, 0.55);
          background: transparent;
          color: var(--cb-danger);
        }

        .cb-btn-outline-danger:hover {
          background: var(--cb-danger-soft);
        }

        /* ---- overlay de drop ---- */

        .cb-drop-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 16px;
          font-size: 13px;
          font-weight: 700;
          border-radius: var(--cb-radius-lg);
          border: 2px dashed transparent;
          backdrop-filter: blur(1px);
        }

        .cb-drop-valid {
          border-color: var(--cb-accent);
          background: rgba(38, 42, 49, 0.85);
          color: var(--cb-accent);
        }

        .cb-drop-invalid {
          border-color: var(--cb-danger);
          background: rgba(38, 42, 49, 0.85);
          color: var(--cb-danger);
        }

        /* ---- cabeçalho do card de save ---- */

        .cb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 16px;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--cb-border-soft);
        }

        .cb-player {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .cb-avatar {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(
            145deg,
            #3a3f48,
            #22252b
          );
          border: 1px solid var(--cb-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: var(--cb-text);
        }

        .cb-player-name {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: var(--cb-text);
          line-height: 1.2;
        }

        .cb-meta {
          margin: 2px 0 0;
          font-size: 12.5px;
          color: var(--cb-text-muted);
        }

        .cb-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .cb-total-titles {
          display: flex;
          align-items: center;
          gap: 5px;
          background: var(--cb-accent-soft);
          color: var(--cb-accent);
          font-weight: 700;
          font-size: 12.5px;
          padding: 5px 9px;
          border-radius: 999px;
        }

        /* ---- timeline ---- */

        .cb-timeline-row {
          display: flex;
          gap: 12px;
        }

        .cb-timeline-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 12px;
          flex-shrink: 0;
          padding-top: 18px;
        }

        .cb-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--cb-text-faint);
          border: 2px solid var(--cb-card-bg);
          box-shadow: 0 0 0 1px var(--cb-border);
          flex-shrink: 0;
        }

        .cb-dot-current {
          background: var(--cb-accent);
          box-shadow: 0 0 0 1px var(--cb-accent);
        }

        .cb-line {
          flex: 1;
          width: 2px;
          background: var(--cb-border);
          margin: 4px 0;
          min-height: 20px;
        }

        .cb-career {
          flex: 1;
          min-width: 0;
          margin-bottom: 14px;
          border-radius: var(--cb-radius-md);
          border: 1px solid transparent;
          transition:
            border-color 0.15s ease,
            background 0.15s ease;
        }

        .cb-career-current {
          border-color: rgba(71, 169, 128, 0.35);
          background: var(--cb-card-bg-alt);
        }

        .cb-career-summary {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: transparent;
          border: none;
          border-radius: var(--cb-radius-md);
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }

        .cb-career-summary:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .cb-career-summary:focus-visible {
          outline: 2px solid var(--cb-accent);
          outline-offset: -2px;
        }

        .cb-career-info {
          flex: 1;
          min-width: 0;
        }

        .cb-career-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cb-team-name {
          font-size: 15.5px;
          font-weight: 800;
          color: var(--cb-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cb-badge {
          flex-shrink: 0;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--cb-accent);
          background: var(--cb-accent-soft);
          padding: 2px 7px;
          border-radius: 999px;
        }

        .cb-player-sub {
          display: block;
          font-size: 12.5px;
          color: var(--cb-text-muted);
          margin-top: 1px;
        }

        .cb-chevron {
          flex-shrink: 0;
          color: var(--cb-text-faint);
          transition: transform 0.18s ease;
        }

        .cb-chevron-open {
          transform: rotate(180deg);
        }

        .cb-unlink-btn {
          flex-shrink: 0;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--cb-text-faint);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            color 0.15s ease,
            border-color 0.15s ease,
            background 0.15s ease;
        }

        .cb-unlink-btn:hover {
          color: var(--cb-danger);
          border-color: rgba(224, 104, 122, 0.4);
          background: var(--cb-danger-soft);
        }

        .cb-unlink-btn:focus-visible {
          outline: 2px solid var(--cb-danger);
          outline-offset: 1px;
        }

        .cb-career-body {
          padding: 0 14px 14px;
        }

        /* ---- ghost ---- */

        .cb-ghost {
          position: fixed;
          z-index: 1000;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--cb-card-bg-alt);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 8px 14px 8px 8px;
          box-shadow: 0 16px 30px -10px rgba(0, 0, 0, 0.6);
          transform: rotate(-2deg);
          max-width: 220px;
        }

        .cb-ghost-crest {
          width: 30px;
          height: 30px;
          font-size: 11px;
          flex-shrink: 0;
        }

        .cb-ghost-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .cb-ghost-text strong {
          font-size: 12.5px;
          color: var(--cb-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cb-ghost-text span {
          font-size: 11px;
          color: var(--cb-text-muted);
        }

        /* ---- modal ---- */

        .cb-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1001;
          background: rgba(10, 11, 13, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cb-modal {
          width: 100%;
          max-width: 340px;
          background: var(--cb-card-bg);
          border: 1px solid var(--cb-border-soft);
          border-radius: var(--cb-radius-lg);
          padding: 20px;
          box-shadow: 0 24px 50px -16px rgba(0, 0, 0, 0.6);
        }

        .cb-modal-title {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 800;
          color: var(--cb-text);
        }

        .cb-modal-text {
          margin: 0 0 18px;
          font-size: 13.5px;
          color: var(--cb-text-muted);
          line-height: 1.45;
        }

        .cb-modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* ---- toast ---- */

        .cb-toast {
          position: fixed;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          z-index: 1001;
          background: var(--cb-card-bg-alt);
          border: 1px solid var(--cb-danger);
          color: var(--cb-danger);
          font-size: 13px;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 999px;
          box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 380px) {
          .cb-actions {
            gap: 6px;
          }

          .cb-btn {
            font-size: 12px;
            padding: 8px 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cb-board * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <p className="cb-hint">
        Arraste o escudo de uma carreira sobre outra para juntar na mesma save.
        Dentro de uma save, clique no ícone de desvincular pra tirar uma
        carreira do grupo.
      </p>

      <div className="cb-grid">
        {items.map((item) => {
          const isOver = overId === item.id;

          if (item.type === "single") {
            const dropInvalid =
              isOver &&
              dragSource !== null &&
              dragSource.player !== item.career.player;

            return (
              <StandaloneCard
                key={item.id}
                career={item.career}
                isDragging={dragId === item.id}
                isOver={isOver}
                dropInvalid={dropInvalid}
                onDragStart={handleDragStart}
              />
            );
          }

          const dropInvalid =
            isOver &&
            dragSource !== null &&
            dragSource.player !== item.careers[0]?.player;

          return (
            <GroupCard
              key={item.id}
              groupId={item.id}
              careers={item.careers}
              isOver={isOver}
              dropInvalid={dropInvalid}
              onRequestRemove={(career) =>
                setPendingRemoval({
                  careerId: career.id,
                  team: career.team,
                  player: career.player,
                  groupId: item.id,
                })
              }
            />
          );
        })}
      </div>

      {dragSource && dragPos && (
        <div
          className="cb-ghost"
          style={{
            left: `${dragPos.x - (dragInfoRef.current?.offsetX ?? 20)}px`,
            top: `${dragPos.y - (dragInfoRef.current?.offsetY ?? 20)}px`,
          }}
        >
          <div
            className="cb-crest cb-ghost-crest"
            style={{
              background: dragSource.crestBg,
              color: dragSource.crestFg,
            }}
          >
            {dragSource.initials}
          </div>
          <div className="cb-ghost-text">
            <strong>{dragSource.team}</strong>
            <span>{dragSource.player}</span>
          </div>
        </div>
      )}

      {pendingMerge && (
        <div className="cb-modal-backdrop" role="dialog" aria-modal="true">
          <div className="cb-modal">
            <h3 className="cb-modal-title">
              {pendingMerge.targetType === "group"
                ? `Adicionar à save de ${pendingMerge.player}?`
                : "Agrupar carreiras?"}
            </h3>

            <p className="cb-modal-text">
              {pendingMerge.targetType === "group"
                ? `"${pendingMerge.sourceLabel}" vai entrar na mesma save que "${pendingMerge.targetLabel}".`
                : `"${pendingMerge.sourceLabel}" e "${pendingMerge.targetLabel}" vão virar uma só save de ${pendingMerge.player}.`}
            </p>

            <div className="cb-modal-actions">
              <button
                type="button"
                className="cb-btn cb-btn-outline"
                onClick={cancelMerge}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="cb-btn cb-btn-primary"
                onClick={confirmMerge}
              >
                Agrupar
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingRemoval && (
        <div className="cb-modal-backdrop" role="dialog" aria-modal="true">
          <div className="cb-modal">
            <h3 className="cb-modal-title">Remover da save?</h3>

            <p className="cb-modal-text">
              {`"${pendingRemoval.team}" volta a ser uma carreira separada, fora da save de ${pendingRemoval.player}.`}
            </p>

            <div className="cb-modal-actions">
              <button
                type="button"
                className="cb-btn cb-btn-outline"
                onClick={cancelRemoval}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="cb-btn cb-btn-outline-danger"
                onClick={confirmRemoval}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="cb-toast">{toast}</div>}
    </div>
  );
}
