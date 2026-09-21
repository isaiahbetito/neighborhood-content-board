"use client";

import { useEffect, useRef } from "react";

export type Status =
  | "Not Started"
  | "Drafted"
  | "Ready for Review"
  | "Scheduled"
  | "Published";

export type BoardItem = {
  id: string;
  status: Status;
  statusChangedAt?: string;
};

const STATUS_ORDER: Status[] = [
  "Not Started",
  "Drafted",
  "Ready for Review",
  "Scheduled",
  "Published",
];
const STATUS_CLASS: Record<Status, string> = {
  "Not Started": "notstarted",
  Drafted: "drafted",
  "Ready for Review": "review",
  Scheduled: "scheduled",
  Published: "published",
};
const DEFAULT_LABEL: Record<Status, string> = {
  "Not Started": "Not started",
  Drafted: "Drafted",
  "Ready for Review": "Ready for review",
  Scheduled: "Scheduled",
  Published: "Published",
};

function accentVar(status: Status) {
  switch (status) {
    case "Not Started":
      return "brick";
    case "Drafted":
      return "ink";
    case "Ready for Review":
      return "mauve";
    case "Scheduled":
      return "brass";
    case "Published":
      return "forest";
  }
}

function formatMovedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MiniBoard<T extends BoardItem>({
  storageKey,
  seed,
  renderCard,
  renderModalBody,
  statusLabels,
  resetLabel = "Reset to a fresh draft set",
}: {
  storageKey: "mailers" | "facebook-ads" | "canva";
  seed: () => T[];
  renderCard: (item: T) => string;
  renderModalBody: (item: T) => string;
  statusLabels?: Partial<Record<Status, string>>;
  resetLabel?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const LABEL: Record<Status, string> = { ...DEFAULT_LABEL, ...statusLabels };

    let items: T[] = [];
    let modalItemId: string | null = null;

    root.innerHTML = `
      <div class="mini-stats" data-role="stats"></div>
      <div class="board" data-role="board"></div>
      <div class="mini-board-footer">
        <button class="mini-reset" data-role="reset">${resetLabel}</button>
      </div>
      <div class="modal-overlay" data-role="modal-overlay" hidden>
        <div class="modal-panel">
          <button class="modal-close" data-role="modal-close" aria-label="Close">×</button>
          <div data-role="modal-body"></div>
        </div>
      </div>
    `;

    const statsEl = root.querySelector<HTMLDivElement>('[data-role="stats"]')!;
    const boardEl = root.querySelector<HTMLDivElement>('[data-role="board"]')!;
    const resetBtnEl = root.querySelector<HTMLButtonElement>('[data-role="reset"]')!;
    const overlayEl = root.querySelector<HTMLDivElement>('[data-role="modal-overlay"]')!;
    const modalBodyEl = root.querySelector<HTMLDivElement>('[data-role="modal-body"]')!;
    const modalCloseEl = root.querySelector<HTMLButtonElement>('[data-role="modal-close"]')!;

    async function loadData() {
      try {
        const res = await fetch(`/api/store/${storageKey}`, { cache: "no-store" });
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length) {
          items = data.items;
          return;
        }
      } catch {
        // fall through to seed
      }
      items = seed();
      await saveData();
    }

    async function saveData() {
      try {
        await fetch(`/api/store/${storageKey}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
      } catch (e) {
        console.error("save failed", e);
      }
    }

    async function moveStatus(item: T, newStatus: Status) {
      if (item.status === newStatus) return;
      item.status = newStatus;
      item.statusChangedAt = new Date().toISOString();
      await saveData();
      renderAll();
      if (modalItemId === item.id) renderModal(item.id);
    }

    function renderStats() {
      const total = items.length;
      const review = items.filter((i) => i.status === "Ready for Review").length;
      const scheduled = items.filter((i) => i.status === "Scheduled").length;
      const published = items.filter((i) => i.status === "Published").length;
      statsEl.innerHTML = [
        [total, "total"],
        [review, "ready for review"],
        [scheduled, "scheduled"],
        [published, LABEL["Published"].toLowerCase()],
      ]
        .map(
          ([n, l]) =>
            `<div class="stat"><div class="num">${n}</div><div class="lbl">${l}</div></div>`
        )
        .join("");
    }

    function emptyMessage(status: Status) {
      switch (status) {
        case "Not Started":
          return "Nothing waiting to start.";
        case "Drafted":
          return "No drafts sitting here right now.";
        case "Ready for Review":
          return "Nothing pending review.";
        case "Scheduled":
          return "Nothing queued.";
        case "Published":
          return `Nothing ${LABEL["Published"].toLowerCase()} yet.`;
        default:
          return "Nothing here.";
      }
    }

    function renderCardEl(item: T) {
      const card = document.createElement("div");
      card.className = "card";
      card.style.setProperty("--card-accent", `var(--${accentVar(item.status)})`);
      card.draggable = true;
      card.dataset.id = item.id;

      const statusOptions = STATUS_ORDER.map(
        (s) => `<option value="${s}" ${s === item.status ? "selected" : ""}>${LABEL[s]}</option>`
      ).join("");

      card.innerHTML = `
        ${renderCard(item)}
        <div class="card-footer">
          <select class="card-status-select" title="Move to a different stage">${statusOptions}</select>
          ${item.statusChangedAt ? `<span class="card-moved">Moved ${formatMovedAt(item.statusChangedAt)}</span>` : ""}
        </div>
      `;

      card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer?.setData("text/plain", item.id);
      });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));
      card.addEventListener("click", () => openModal(item.id));

      const select = card.querySelector<HTMLSelectElement>(".card-status-select")!;
      select.addEventListener("click", (e) => e.stopPropagation());
      select.addEventListener("change", async (e) => {
        e.stopPropagation();
        const it = items.find((x) => x.id === item.id);
        if (it) await moveStatus(it, select.value as Status);
      });

      return card;
    }

    function renderBoard() {
      const board = document.createElement("div");
      board.className = "board";

      STATUS_ORDER.forEach((status) => {
        const cls = STATUS_CLASS[status];
        const col = document.createElement("div");
        col.className = "column";
        const colItems = items.filter((i) => i.status === status);
        col.innerHTML = `
          <div class="column-head col-${cls}">
            <span class="name">${LABEL[status]}</span>
            <span class="count">${colItems.length}</span>
          </div>
          <div class="column-body"></div>
        `;
        const body = col.querySelector<HTMLDivElement>(".column-body")!;
        if (colItems.length === 0) {
          body.innerHTML = `<div class="empty-note">${emptyMessage(status)}</div>`;
        } else {
          colItems.forEach((item) => body.appendChild(renderCardEl(item)));
        }
        body.addEventListener("dragover", (e) => {
          e.preventDefault();
          body.classList.add("dragover");
        });
        body.addEventListener("dragleave", () => body.classList.remove("dragover"));
        body.addEventListener("drop", async (e) => {
          e.preventDefault();
          body.classList.remove("dragover");
          const id = e.dataTransfer?.getData("text/plain");
          const item = items.find((i) => i.id === id);
          if (item) await moveStatus(item, status);
        });
        board.appendChild(col);
      });

      boardEl.innerHTML = "";
      boardEl.appendChild(board);
    }

    function renderModal(id: string) {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const statusOptions = STATUS_ORDER.map(
        (s) => `<option value="${s}" ${s === item.status ? "selected" : ""}>${LABEL[s]}</option>`
      ).join("");

      modalBodyEl.innerHTML = `
        ${renderModalBody(item)}
        <div class="modal-section-label">Pipeline stage</div>
        <div class="card-footer">
          <select class="card-status-select" data-role="modal-status-select" title="Move to a different stage">${statusOptions}</select>
          ${item.statusChangedAt ? `<span class="card-moved">Moved ${formatMovedAt(item.statusChangedAt)}</span>` : ""}
        </div>
      `;

      const modalSelect = modalBodyEl.querySelector<HTMLSelectElement>(
        '[data-role="modal-status-select"]'
      )!;
      modalSelect.addEventListener("change", async () => {
        await moveStatus(item, modalSelect.value as Status);
      });
    }

    function openModal(id: string) {
      modalItemId = id;
      renderModal(id);
      overlayEl.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modalItemId = null;
      overlayEl.hidden = true;
      document.body.style.overflow = "";
    }

    function renderAll() {
      renderStats();
      renderBoard();
    }

    const onOverlayClick = (e: MouseEvent) => {
      if (e.target === overlayEl) closeModal();
    };
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalItemId) closeModal();
    };
    const onReset = async () => {
      if (
        !window.confirm(
          "This replaces every card with a fresh draft set. Any progress will be lost. Continue?"
        )
      ) {
        return;
      }
      items = seed();
      await saveData();
      renderAll();
    };
    overlayEl.addEventListener("click", onOverlayClick);
    modalCloseEl.addEventListener("click", closeModal);
    document.addEventListener("keydown", onKeydown);
    resetBtnEl.addEventListener("click", onReset);

    (async function init() {
      await loadData();
      renderAll();
    })();

    return () => {
      overlayEl.removeEventListener("click", onOverlayClick);
      modalCloseEl.removeEventListener("click", closeModal);
      document.removeEventListener("keydown", onKeydown);
      resetBtnEl.removeEventListener("click", onReset);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return (
    <div className="mini-board" ref={rootRef}>
      <div className="loading-screen">Loading board…</div>
    </div>
  );
}
