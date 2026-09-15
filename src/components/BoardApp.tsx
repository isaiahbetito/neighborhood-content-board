"use client";

import { useEffect } from "react";

type Status =
  | "Not Started"
  | "Drafted"
  | "Ready for Review"
  | "Scheduled"
  | "Published";

type Post = {
  id: string;
  date: string;
  day: string;
  time: string;
  area: string;
  areaUrl: string;
  title: string;
  keyword: string;
  status: Status;
  platforms: { gbp: Status; w1: Status; w2: Status; li: Status };
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
const STATUS_LABEL: Record<Status, string> = {
  "Not Started": "Not started",
  Drafted: "Drafted",
  "Ready for Review": "Ready for review",
  Scheduled: "Scheduled",
  Published: "Published",
};

const AREAS: [string, string][] = [
  ["Maple Heights", "maple-heights"],
  ["Riverside District", "riverside-district"],
  ["Downtown Corridor", "downtown-corridor"],
  ["Lakeview Terrace", "lakeview-terrace"],
  ["Oakwood Estates", "oakwood-estates"],
  ["Westbrook Village", "westbrook-village"],
  ["Sunset Hills", "sunset-hills"],
];

const TITLES: Record<string, [string, string][]> = {
  "Maple Heights": [
    [
      "Why Maple Heights is becoming the city's most sought-after family neighborhood",
      "homes for sale in Maple Heights",
    ],
    [
      "5 new listings in Maple Heights you need to see this week",
      "Maple Heights new listings",
    ],
    [
      "Maple Heights school district guide: what home buyers should know",
      "Maple Heights schools",
    ],
  ],
  "Riverside District": [
    [
      "Riverside District market update: home prices & trends",
      "Riverside District home prices",
    ],
    [
      "Living in Riverside District: a complete neighborhood guide",
      "living in Riverside District",
    ],
    [
      "Top 5 Riverside District spots near our latest listings",
      "Riverside District things to do",
    ],
  ],
  "Downtown Corridor": [
    [
      "Downtown Corridor condo market: what's selling right now",
      "Downtown Corridor condos for sale",
    ],
    [
      "Is Downtown Corridor right for you? Pros and cons for buyers",
      "Downtown Corridor living",
    ],
    [
      "New construction spotlight: Downtown Corridor's newest developments",
      "Downtown Corridor new construction",
    ],
  ],
  "Lakeview Terrace": [
    [
      "Lakeview Terrace waterfront homes: 2026 buyer's guide",
      "Lakeview Terrace waterfront homes",
    ],
    [
      "5 reasons families are moving to Lakeview Terrace",
      "moving to Lakeview Terrace",
    ],
    [
      "Lakeview Terrace open houses this weekend",
      "Lakeview Terrace open houses",
    ],
  ],
  "Oakwood Estates": [
    [
      "Oakwood Estates luxury homes: what's on the market now",
      "Oakwood Estates luxury homes",
    ],
    [
      "Oakwood Estates neighborhood spotlight: parks, schools & amenities",
      "Oakwood Estates neighborhood guide",
    ],
    [
      "How Oakwood Estates home values have changed this year",
      "Oakwood Estates home values",
    ],
  ],
  "Westbrook Village": [
    [
      "Westbrook Village first-time buyer's guide",
      "Westbrook Village first time buyers",
    ],
    [
      "New listings alert: Westbrook Village homes under budget",
      "Westbrook Village new listings",
    ],
    [
      "Westbrook Village community guide: everything to know before you move",
      "Westbrook Village community guide",
    ],
  ],
  "Sunset Hills": [
    ["Sunset Hills real estate market update", "Sunset Hills real estate market"],
    [
      "5 hidden gems in Sunset Hills every home buyer should know",
      "Sunset Hills neighborhood guide",
    ],
    [
      "Sunset Hills vs. nearby areas: which neighborhood fits your lifestyle?",
      "Sunset Hills vs",
    ],
  ],
};

const ROTATION = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 0, 1],
  [2, 3, 4],
  [5, 6, 0],
  [1, 2, 3],
  [4, 5, 6],
];
const TIME_SLOTS = ["9:00 AM", "12:00 PM", "3:00 PM"];

const PLATFORM_LABELS: Record<string, string> = {
  gbp: "GBP",
  w1: "Site 1",
  w2: "Site 2",
  li: "LinkedIn",
};

function statusForDay(i: number): { content: Status; plat: Status[] } {
  if (i === 0)
    return {
      content: "Published",
      plat: ["Published", "Published", "Published", "Published"],
    };
  if (i === 1)
    return {
      content: "Scheduled",
      plat: ["Published", "Published", "Scheduled", "Scheduled"],
    };
  if (i === 2 || i === 3)
    return {
      content: "Scheduled",
      plat: ["Scheduled", "Scheduled", "Scheduled", "Scheduled"],
    };
  if (i === 4 || i === 5)
    return {
      content: "Drafted",
      plat: ["Drafted", "Drafted", "Drafted", "Drafted"],
    };
  return {
    content: "Ready for Review",
    plat: ["Drafted", "Drafted", "Not Started", "Not Started"],
  };
}

function buildSeedData(): Post[] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const posts: Post[] = [];
  const useCount: Record<string, number> = {};
  AREAS.forEach((a) => (useCount[a[0]] = 0));
  let id = 1;

  for (let d = 0; d < 7; d++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + d);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const dateLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const st = statusForDay(d);
    ROTATION[d].forEach((areaIdx, slot) => {
      const [areaName, slug] = AREAS[areaIdx];
      const n = useCount[areaName];
      const [title, kw] = TITLES[areaName][n];
      useCount[areaName]++;
      posts.push({
        id: "p" + id++,
        date: dateLabel,
        day: dayName,
        time: TIME_SLOTS[slot],
        area: areaName,
        areaUrl: "clientwebsite.com/neighborhoods/" + slug,
        title,
        keyword: kw,
        status: st.content,
        platforms: {
          gbp: st.plat[0],
          w1: st.plat[1],
          w2: st.plat[2],
          li: st.plat[3],
        },
      });
    });
  }
  return posts;
}

export default function BoardApp() {
  useEffect(() => {
    let boardData: Post[] = [];
    let activeDay = "All";
    let activeArea = "All";

    function el<T extends HTMLElement>(id: string): T {
      return document.getElementById(id) as T;
    }

    async function loadData() {
      try {
        const res = await fetch("/api/board", { cache: "no-store" });
        const data = await res.json();
        if (data && Array.isArray(data.posts) && data.posts.length) {
          boardData = data.posts;
          return;
        }
      } catch {
        // fall through to seed
      }
      boardData = buildSeedData();
      await saveData();
    }

    async function saveData() {
      try {
        await fetch("/api/board", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ posts: boardData }),
        });
      } catch (e) {
        console.error("save failed", e);
      }
    }

    function cycleStatus(cur: Status): Status {
      const idx = STATUS_ORDER.indexOf(cur);
      return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    }

    function renderStats() {
      const total = boardData.length;
      const published = boardData.filter((p) => p.status === "Published").length;
      const scheduled = boardData.filter((p) => p.status === "Scheduled").length;
      const areas = new Set(boardData.map((p) => p.area)).size;
      el<HTMLDivElement>("stats").innerHTML = [
        [total, "posts this week"],
        [published, "published"],
        [scheduled, "scheduled"],
        [areas, "areas rotating"],
      ]
        .map(
          ([n, l]) =>
            `<div class="stat"><div class="num">${n}</div><div class="lbl">${l}</div></div>`
        )
        .join("");
    }

    function renderFilters() {
      const days = ["All", ...Array.from(new Set(boardData.map((p) => p.day)))];
      el<HTMLDivElement>("dayFilters").innerHTML = days
        .map(
          (d) =>
            `<button class="chip ${d === activeDay ? "active" : ""}" data-day="${d}">${
              d === "All" ? "All days" : d
            }</button>`
        )
        .join("");
      const areas = ["All", ...AREAS.map((a) => a[0])];
      el<HTMLDivElement>("areaFilters").innerHTML = areas
        .map(
          (a) =>
            `<button class="chip ${a === activeArea ? "active" : ""}" data-area="${a}">${a}</button>`
        )
        .join("");

      document.querySelectorAll<HTMLButtonElement>("#dayFilters .chip").forEach((btn) => {
        btn.onclick = () => {
          activeDay = btn.dataset.day!;
          renderAll();
        };
      });
      document.querySelectorAll<HTMLButtonElement>("#areaFilters .chip").forEach((btn) => {
        btn.onclick = () => {
          activeArea = btn.dataset.area!;
          renderAll();
        };
      });
    }

    function renderLegend() {
      el<HTMLDivElement>("legend").innerHTML = STATUS_ORDER.map(
        (s) =>
          `<span class="legend-item"><span class="legend-dot s-${STATUS_CLASS[s]}"></span>${STATUS_LABEL[s]}</span>`
      ).join("");
    }

    function filteredData() {
      return boardData.filter(
        (p) =>
          (activeDay === "All" || p.day === activeDay) &&
          (activeArea === "All" || p.area === activeArea)
      );
    }

    function emptyMessage(status: Status) {
      switch (status) {
        case "Not Started":
          return "Nothing waiting to start — the backlog is fully in motion.";
        case "Drafted":
          return "No drafts sitting here right now.";
        case "Ready for Review":
          return "Nothing pending client sign-off.";
        case "Scheduled":
          return "Nothing queued in this filter.";
        case "Published":
          return "Nothing published yet for this filter.";
        default:
          return "Nothing here.";
      }
    }

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

    function renderCard(post: Post) {
      const card = document.createElement("div");
      card.className = "card";
      card.style.setProperty("--card-accent", `var(--${accentVar(post.status)})`);
      card.draggable = true;
      card.dataset.id = post.id;

      const platRow = Object.entries(post.platforms)
        .map(([key, val]) => {
          return `<span class="plat s-${STATUS_CLASS[val]}" data-post="${post.id}" data-plat="${key}" title="${PLATFORM_LABELS[key]}: ${STATUS_LABEL[val]} — click to advance">${PLATFORM_LABELS[key]}</span>`;
        })
        .join("");

      card.innerHTML = `
        <div class="card-top">
          <span class="card-area">${post.area}</span>
          <span class="card-when">${post.date} · ${post.time}</span>
        </div>
        <p class="card-title">${post.title}</p>
        <div class="card-kw">Keyword: ${post.keyword}</div>
        <a class="card-link" href="#" onclick="return false;">${post.areaUrl}</a>
        <div class="platform-row">${platRow}</div>
      `;

      card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer?.setData("text/plain", post.id);
      });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));

      card.querySelectorAll<HTMLSpanElement>(".plat").forEach((tag) => {
        tag.addEventListener("click", async (e) => {
          e.stopPropagation();
          const p = boardData.find((x) => x.id === post.id);
          if (!p) return;
          const key = tag.dataset.plat as keyof Post["platforms"];
          p.platforms[key] = cycleStatus(p.platforms[key]);
          await saveData();
          renderAll();
        });
      });

      return card;
    }

    function renderBoard() {
      const data = filteredData();
      const root = el<HTMLDivElement>("boardRoot");
      const board = document.createElement("div");
      board.className = "board";

      STATUS_ORDER.forEach((status) => {
        const cls = STATUS_CLASS[status];
        const col = document.createElement("div");
        col.className = "column";
        const items = data.filter((p) => p.status === status);
        col.innerHTML = `
          <div class="column-head col-${cls}">
            <span class="name">${STATUS_LABEL[status]}</span>
            <span class="count">${items.length}</span>
          </div>
          <div class="column-body" data-status="${status}"></div>
        `;
        const body = col.querySelector<HTMLDivElement>(".column-body")!;
        if (items.length === 0) {
          body.innerHTML = `<div class="empty-note">${emptyMessage(status)}</div>`;
        } else {
          items.forEach((post) => body.appendChild(renderCard(post)));
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
          const post = boardData.find((p) => p.id === id);
          if (post && post.status !== status) {
            post.status = status;
            await saveData();
            renderAll();
          }
        });
        board.appendChild(col);
      });

      root.innerHTML = "";
      root.appendChild(board);
    }

    function renderAll() {
      renderStats();
      renderFilters();
      renderLegend();
      renderBoard();
    }

    const resetBtn = el<HTMLButtonElement>("resetBtn");
    const onReset = async () => {
      boardData = buildSeedData();
      activeDay = "All";
      activeArea = "All";
      await saveData();
      renderAll();
    };
    resetBtn.addEventListener("click", onReset);

    (async function init() {
      await loadData();
      renderAll();
    })();

    return () => {
      resetBtn.removeEventListener("click", onReset);
    };
  }, []);

  return null;
}
