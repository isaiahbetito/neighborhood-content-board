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

// Verified real photos from images.unsplash.com (direct CDN, no API key needed)
const PHOTOS = {
  farmhouse: "1570129477492-45c003edd2be",
  cabinDusk: "1568605114967-8130f3a36994",
  modernTree: "1600585154340-be6161a56a0c",
  whiteVillaPool: "1512917774080-9991f1c4c750",
  minimalistWhite: "1523217582562-09d0def993a6",
  keychain: "1560518883-ce09059eeffa",
  craftsmanPalm: "1583608205776-bfd35f0d9f83",
  modernLivingRoom: "1600607687939-ce8a6c25118c",
  luxuryVillaPool: "1600596542815-ffad4c1539a9",
  stuccoTraditional: "1592595896616-c37162298647",
  loftDog: "1600566753086-00f18fb6b3ea",
  modernWoodAccent: "1600047509807-ba8f99d2cdde",
  cozyLivingRoom: "1600210492486-724fe5c67fb0",
} as const;

function photoUrl(key: keyof typeof PHOTOS, w = 900) {
  return `https://images.unsplash.com/photo-${PHOTOS[key]}?w=${w}&q=70&auto=format&fit=crop`;
}

const AREA_PHOTOS: Record<string, (keyof typeof PHOTOS)[]> = {
  "Maple Heights": ["farmhouse", "stuccoTraditional", "cozyLivingRoom"],
  "Riverside District": ["keychain", "modernTree", "loftDog"],
  "Downtown Corridor": ["modernLivingRoom", "modernWoodAccent", "minimalistWhite"],
  "Lakeview Terrace": ["luxuryVillaPool", "whiteVillaPool", "cozyLivingRoom"],
  "Oakwood Estates": ["whiteVillaPool", "craftsmanPalm", "keychain"],
  "Westbrook Village": ["craftsmanPalm", "farmhouse", "modernLivingRoom"],
  "Sunset Hills": ["cabinDusk", "minimalistWhite", "modernTree"],
};

function photoForPost(post: Post): string {
  const titles = TITLES[post.area];
  const idx = titles ? titles.findIndex(([t]) => t === post.title) : -1;
  const pool = AREA_PHOTOS[post.area];
  const key = pool && idx >= 0 ? pool[idx] : "farmhouse";
  return photoUrl(key);
}

const INTRO_VARIANTS = [
  (area: string, keyword: string) =>
    `If you've been watching the ${area} market lately, you already know it's one of the more active corners of town right now — and "${keyword}" is exactly the kind of search bringing buyers here.`,
  (area: string, keyword: string) =>
    `Anyone searching "${keyword}" this month keeps landing on the same neighborhood: ${area}. Here's why it's worth a closer look.`,
];
const BODY_VARIANTS = [
  (area: string) =>
    `Here's what's standing out this season: inventory in ${area} is moving faster than the citywide average, and homes that are priced right rarely last more than a couple of weeks on the market. Buyers are drawn in by the walkability, the mix of housing styles, and a steady stream of new listings that keep the neighborhood feeling fresh without losing its character.`,
  (area: string) =>
    `A few things keep coming up in conversations with buyers touring ${area}: the tree-lined streets, the short commute into downtown, and a level of inventory that's finally starting to loosen up after a tight couple of years. It's the kind of neighborhood that photographs well but shows even better in person.`,
];
const CLOSE_VARIANTS = [
  (area: string) =>
    `For anyone comparing neighborhoods, ${area} tends to check the boxes that matter most: reasonable commute times, solid school options nearby, and a real sense of community — the kind of thing that's hard to manufacture and easy to notice once you've spent an afternoon walking the blocks.`,
  (area: string) =>
    `Prices here still leave room to negotiate compared to some of the more talked-about pockets of the city, which is part of why ${area} keeps showing up on buyers' shortlists once they've toured a few open houses.`,
];
const CTA_VARIANTS = [
  (area: string) =>
    `If this sounds like it could be the right fit, the best next step is simple: take a look at what's currently listed in ${area} and get a feel for the price range before you start touring.`,
  (area: string) =>
    `Ready to see it for yourself? The fastest way in is to browse what's currently available in ${area} and reach out about anything that catches your eye.`,
];

function hashPick<T>(seed: string, arr: T[]): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

function articleBody(post: Post): string[] {
  return [
    hashPick(post.id + "a", INTRO_VARIANTS)(post.area, post.keyword),
    hashPick(post.id + "b", BODY_VARIANTS)(post.area),
    hashPick(post.id + "c", CLOSE_VARIANTS)(post.area),
    hashPick(post.id + "d", CTA_VARIANTS)(post.area),
  ];
}

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
    let modalPostId: string | null = null;

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
        <div class="platform-row">${platRow}</div>
      `;

      card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer?.setData("text/plain", post.id);
      });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));

      card.addEventListener("click", () => openModal(post.id));

      card.querySelectorAll<HTMLSpanElement>(".plat").forEach((tag) => {
        tag.addEventListener("click", async (e) => {
          e.stopPropagation();
          const p = boardData.find((x) => x.id === post.id);
          if (!p) return;
          const key = tag.dataset.plat as keyof Post["platforms"];
          p.platforms[key] = cycleStatus(p.platforms[key]);
          await saveData();
          renderAll();
          if (modalPostId === post.id) renderModal(post.id);
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

    function renderModal(id: string) {
      const post = boardData.find((p) => p.id === id);
      if (!post) return;

      const platRow = Object.entries(post.platforms)
        .map(([key, val]) => {
          return `<span class="plat s-${STATUS_CLASS[val]}">${PLATFORM_LABELS[key]} · ${STATUS_LABEL[val]}</span>`;
        })
        .join("");

      el<HTMLDivElement>("modalBody").innerHTML = `
        <img class="modal-photo" src="${photoForPost(post)}" alt="${post.title}" />
        <div class="modal-content">
          <div class="modal-top">
            <span class="card-area">${post.area}</span>
            <span class="card-when">${post.date} · ${post.time}</span>
          </div>
          <h2 class="modal-title">${post.title}</h2>
          <div class="modal-kw">Target keyword: <strong>${post.keyword}</strong></div>
          <a class="card-link" href="#" onclick="return false;">${post.areaUrl}</a>
          <div class="modal-article">
            ${articleBody(post)
              .map((p) => `<p>${p}</p>`)
              .join("")}
          </div>
          <div class="modal-section-label">Publishing status</div>
          <div class="platform-row">${platRow}</div>
        </div>
      `;
    }

    function openModal(id: string) {
      modalPostId = id;
      renderModal(id);
      el<HTMLDivElement>("modalOverlay").hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modalPostId = null;
      el<HTMLDivElement>("modalOverlay").hidden = true;
      document.body.style.overflow = "";
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

    const modalOverlay = el<HTMLDivElement>("modalOverlay");
    const modalClose = el<HTMLButtonElement>("modalClose");
    const onOverlayClick = (e: MouseEvent) => {
      if (e.target === modalOverlay) closeModal();
    };
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalPostId) closeModal();
    };
    modalOverlay.addEventListener("click", onOverlayClick);
    modalClose.addEventListener("click", closeModal);
    document.addEventListener("keydown", onKeydown);

    (async function init() {
      await loadData();
      renderAll();
    })();

    return () => {
      resetBtn.removeEventListener("click", onReset);
      modalOverlay.removeEventListener("click", onOverlayClick);
      modalClose.removeEventListener("click", closeModal);
      document.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = "";
    };
  }, []);

  return null;
}
