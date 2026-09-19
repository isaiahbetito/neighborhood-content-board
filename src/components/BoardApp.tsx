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
  statusChangedAt?: string;
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
  ["Holly Ridge, Camas", "holly-ridge-camas-wa"],
  ["Lakeshore, Vancouver", "lakeshore-vancouver-wa"],
  ["Pleasant Valley, Vancouver", "pleasant-valley-vancouver-wa"],
  ["Hunter Ridge Estates, Camas", "hunter-ridge-estates-camas-wa"],
  ["Columbia Way, Vancouver", "columbia-way-vancouver-wa"],
  ["Deer Creek, Camas", "deer-creek-camas-wa"],
  ["Harney Heights, Vancouver", "harney-heights-vancouver-wa"],
];

type PostSeed = { title: string; keyword: string; paragraphs: string[] };

const TITLES: Record<string, PostSeed[]> = {
  "Holly Ridge, Camas": [
    {
      title: "Why Buyers Keep Circling Back to Holly Ridge in Camas",
      keyword: "Holly Ridge Camas homes for sale",
      paragraphs: [
        "Holly Ridge sits in the Camas Meadows corridor between Prune Hill and Lacamas Lake, and it's become one of those neighborhoods buyers mention by name before they've even toured a house — usually because a friend already lives there, or because they drove past it on the way to Grass Valley Park and couldn't stop thinking about it.",
        "What makes it work is the range: efficient three-bedroom townhomes start in the upper $400s, and larger single-family homes with daylight basements and bonus rooms run up toward $700K — so buyers at fairly different budgets end up on the same streets, backed by the same permanent Prune Hill greenspace that keeps the rear yards from ever feeling boxed in.",
        "Add in Camas School District access, Skyridge Middle and Camas High in the feeder pattern, and a 20-to-25-minute run into Portland via SR-14, and it's easy to see why homes here don't sit long once they're priced right.",
      ],
    },
    {
      title: "Holly Ridge Market Pulse: What's Moving Right Now",
      keyword: "Holly Ridge Camas market update",
      paragraphs: [
        "Inventory in Holly Ridge has stayed tight through the second half of the year, and townhome-style listings on the accessible end of the price range — upper $400s to low $500s — are the first to go, often inside two weeks.",
        "Larger single-family homes backed to Prune Hill greenspace are commanding the strongest interest, and buyers relocating from out of state keep asking the same question first: how close is it to the lake. The answer — walking distance — is usually what closes the deal.",
        "If you're watching this corridor, the move is to have financing ready before a listing hits, not after. Reach out and I'll flag anything in Holly Ridge before it's public, or catch the latest market breakdown on the YouTube channel.",
      ],
    },
    {
      title: "Is Holly Ridge the Right Camas Neighborhood for You?",
      keyword: "living in Holly Ridge Camas",
      paragraphs: [
        "Holly Ridge tends to attract three kinds of buyers: first-timers who want a genuine foothold in Camas without stretching past the upper $400s, growing families who need the extra bedroom and the bonus room the larger floor plans offer, and relocators from denser markets who want to walk to a lake on a Saturday without giving up good schools.",
        "What it's not is a fit for buyers chasing brand-new construction or a maintenance-free lock-and-leave lifestyle — this is a late-90s-to-early-2000s neighborhood with mature landscaping and real yards, which is exactly the draw for the people it's right for.",
        "If that sounds like you, the best next step is seeing two or three homes in person — the Prune Hill backing reads very differently on a listing photo than it does standing on the back deck.",
      ],
    },
  ],
  "Lakeshore, Vancouver": [
    {
      title: "Lakeshore: Vancouver's Answer to Lake Living",
      keyword: "Lakeshore Vancouver WA homes",
      paragraphs: [
        "Lakeshore sits in northwest Vancouver near Vancouver Lake, and the appeal is exactly what the name suggests — proximity to the water, to Vancouver Lake Regional Park, and to the kind of paved trail system that turns an evening walk into an actual destination rather than a lap around the block.",
        "Homes here skew a bit older than the newer builds further east in Clark County, which keeps the price point more approachable, and lots tend to be generous enough for mature trees and real separation from the neighbors.",
        "It's a straightforward I-5 commute in either direction — north toward Salmon Creek, south into downtown Vancouver and across into Portland — which keeps it on the list for buyers who want the lake lifestyle without sacrificing commute flexibility.",
      ],
    },
    {
      title: "Lakeshore Market Update: Home Prices & Inventory",
      keyword: "Lakeshore Vancouver home prices",
      paragraphs: [
        "Inventory near Vancouver Lake has been unusually tight this season — the combination of park access and established lot sizes doesn't come up for sale often, and when it does, well-priced listings are going under contract fast.",
        "Buyers specifically searching for water-adjacent living in Clark County keep landing on Lakeshore because the alternatives — waterfront property directly on the Columbia — run considerably higher, and this delivers a similar lifestyle at a more reasonable number.",
        "If Lakeshore is on your radar, I'd rather get you set up on alerts now than have you find out a listing already went pending. Reach out and I'll get that started.",
      ],
    },
    {
      title: "Is Lakeshore the Right Fit for Your Next Move?",
      keyword: "living in Lakeshore Vancouver WA",
      paragraphs: [
        "Lakeshore tends to draw outdoor-oriented buyers — people who actually use a park, not just live near one — along with move-up buyers who want more lot than the newer east-county subdivisions typically offer at a comparable price.",
        "It's a slightly longer trip into downtown Vancouver than Columbia Way or Harney Heights, which is the main trade-off buyers weigh against the park and lake access.",
        "If your weekends already revolve around trails and water, Lakeshore will feel like it was built for you — because for a lot of the people who live there now, it effectively was.",
      ],
    },
  ],
  "Pleasant Valley, Vancouver": [
    {
      title: "Pleasant Valley: Eastern Clark County's Semi-Rural Retreat",
      keyword: "Pleasant Valley Vancouver WA homes",
      paragraphs: [
        "Pleasant Valley sits about 20 minutes northeast of downtown Vancouver, off the I-5/I-205 corridor, and it's one of the few remaining pockets of Clark County where farmland, larger-lot homes, and newer construction genuinely coexist rather than one slowly replacing the other.",
        "Lot sizes here run well above what buyers find in Vancouver's inner subdivisions — space for a shop, a garden, or simply more distance from the neighbors — while still landing within a reasonable drive of Washington State University Vancouver and the retail corridor around Fisher's Landing.",
        "It's the right answer for buyers who've decided a standard suburban lot isn't going to cut it, but who still want to stay inside commuting range of Vancouver and Portland rather than moving further out.",
      ],
    },
    {
      title: "Pleasant Valley Acreage Listings: What's Available Now",
      keyword: "Pleasant Valley new listings",
      paragraphs: [
        "Acreage listings in Pleasant Valley move differently than standard subdivision homes — buyers take longer to decide, but once they commit, they tend to close without much negotiation, because there simply aren't many comparable properties to shop against.",
        "Newer construction on larger lots has been the biggest driver of interest this season, particularly from buyers relocating from tighter urban lots who want room to spread out without leaving Clark County entirely.",
        "If acreage or a semi-rural lot is on your list, the search radius matters — I can pull everything currently available in Pleasant Valley and the surrounding pockets in one pass so you're not missing anything just outside the exact boundary.",
      ],
    },
    {
      title: "Is Pleasant Valley Right for You? Pros and Cons",
      keyword: "Pleasant Valley Vancouver living",
      paragraphs: [
        "Pleasant Valley is the right call for buyers who want land — real space for animals, a shop, a garden — and are willing to trade some walkability and retail proximity to get it. It's not a neighborhood you stroll to dinner from.",
        "The commute is the other honest trade-off: it's a real drive into downtown Vancouver or across into Portland, longer than anything else in this rotation, though I-5/I-205 access keeps it manageable rather than punishing.",
        "If space matters more to you than proximity, Pleasant Valley is worth serious consideration. If you want to walk somewhere on a Friday night, look at Columbia Way or Harney Heights instead.",
      ],
    },
  ],
  "Hunter Ridge Estates, Camas": [
    {
      title: "Hunter Ridge Estates: Camas's Gated Hilltop Address",
      keyword: "Hunter Ridge Estates Camas homes",
      paragraphs: [
        "Hunter Ridge Estates sits above much of Camas, a gated community of custom and semi-custom homes on elevated lots that trade density for view — Mount Hood on a clear day from more than a few back decks, and the kind of privacy a guarded entry actually delivers rather than just implies.",
        "Homes here run larger and newer than most of the Camas Meadows corridor, typically four-plus bedrooms on generous lots, and price points reflect it — this is the upper end of the Camas market, not the accessible end.",
        "Still zoned for Camas School District, still a manageable run to Portland via SR-14, but with a level of quiet and separation from through-traffic that the more established, walkable neighborhoods in town simply can't offer.",
      ],
    },
    {
      title: "Hunter Ridge Estates: Where Camas's Luxury Market Stands",
      keyword: "Hunter Ridge Estates luxury homes Camas",
      paragraphs: [
        "Luxury inventory in Camas stays thin by nature, and Hunter Ridge Estates is usually the address buyers mean when they say they want gated and elevated — the pool of comparable listings anywhere else in town is small.",
        "View lots with unobstructed Mount Hood sightlines command a real premium over interior lots in the same community, and buyers who wait too long to decide tend to watch that specific lot go to someone else.",
        "If you're shopping this tier, I'd rather show you what's coming before it's public than have you find it on a portal after the fact — that's usually how the best Hunter Ridge opportunities move.",
      ],
    },
    {
      title: "Is Hunter Ridge Estates Worth the Premium?",
      keyword: "Hunter Ridge Estates Camas review",
      paragraphs: [
        "The honest answer: it depends what you're optimizing for. If privacy, a gated entry, and a view lot matter more to you than walkability to downtown Camas or Lacamas Lake, Hunter Ridge Estates is worth every bit of the premium over the rest of the Camas Meadows corridor.",
        "If what you actually want is to walk to the lake on a Saturday morning, you'll get more of that lifestyle for less money in Holly Ridge or Deer Creek — Hunter Ridge trades that walkability for elevation, space, and privacy instead.",
        "Buyers who choose it tend to be move-up families or relocating executives who've already lived in a more walkable neighborhood and know exactly what they're trading for the view.",
      ],
    },
  ],
  "Columbia Way, Vancouver": [
    {
      title: "Columbia Way: Living on Vancouver's Waterfront Side",
      keyword: "Columbia Way Vancouver WA homes",
      paragraphs: [
        "Columbia Way runs along the north bank of the Columbia River, close enough to downtown Vancouver's waterfront district that a lot of buyers here trade a car trip for a walk — to the restaurants along the river, to Esther Short Park, to the trail that follows the water toward Wintler Park.",
        "Housing stock is more mixed than the established Camas neighborhoods — a run of newer condos and townhomes closer to the waterfront redevelopment, older single-family homes further back — which means the price range spans wider than almost anywhere else in this rotation.",
        "The draw is location more than any single home feature: I-5 access is immediate, the Portland side of the river is a short bridge crossing away, and Vancouver Public Schools serve the area.",
      ],
    },
    {
      title: "Columbia Way Condo & Townhome Market: What's Selling",
      keyword: "Columbia Way condos for sale",
      paragraphs: [
        "The newer condo and townhome product along Columbia Way keeps attracting buyers who work in Portland but want Washington's tax advantage without giving up a walkable, river-adjacent lifestyle — that combination is hard to find on either side of the river at this price point.",
        "Units closest to the waterfront trail and downtown Vancouver's restaurant row move fastest, usually inside the first two to three weeks, while the older single-family stock further from the river takes longer and rewards patient buyers.",
        "If a downtown-adjacent, low-maintenance option is what you're after, I can set up alerts for new Columbia Way listings the moment they hit — this stretch turns over quickly enough that waiting a week can mean missing the best units.",
      ],
    },
    {
      title: "Who Columbia Way Is Actually Built For",
      keyword: "living in Columbia Way Vancouver",
      paragraphs: [
        "Columbia Way works best for buyers who want city-adjacent living without an Oregon address — commuters into Portland, empty nesters downsizing out of a bigger Camas or east Vancouver home, and anyone who'd rather walk to dinner than drive to it.",
        "It's a weaker fit for buyers who want a big yard or a quiet cul-de-sac — this is a denser, more urban corner of Vancouver than Harney Heights or Lakeshore, and that trade-off is the whole point for the people who choose it.",
        "If waterfront walkability is higher on your list than square footage, Columbia Way deserves a serious look before you widen the search elsewhere.",
      ],
    },
  ],
  "Deer Creek, Camas": [
    {
      title: "Deer Creek, Camas: The Wooded Side of Prune Hill Buyers Overlook",
      keyword: "Deer Creek Camas homes",
      paragraphs: [
        "Deer Creek sits on the wooded side of the Prune Hill corridor, a few minutes from the Holly Ridge and Camas Meadows area but with noticeably more tree cover and quieter cul-de-sac streets — the kind of neighborhood that doesn't show up in as many searches, which is part of why it's stayed relatively accessible.",
        "Homes here mostly date to the same late-1990s-to-2000s Camas building wave, with mature landscaping that new construction simply can't replicate yet, and lots that give some separation from the neighbors without leaving the city entirely.",
        "It's an easy walk or short drive to Lacamas Creek Trail, and the same Camas School District access applies — Skyridge Middle, Camas High — with the same SR-14 run into Portland that the rest of the Camas Meadows area enjoys.",
      ],
    },
    {
      title: "Deer Creek Inventory Update: What's on the Market",
      keyword: "Deer Creek Camas listings",
      paragraphs: [
        "Deer Creek doesn't turn over as fast as some of the more visible Camas neighborhoods, which means when a well-kept home does list here, it tends to draw serious buyers rather than lookers — the kind of listing that goes pending in the first weekend.",
        "Pricing has held steady relative to the broader Camas Meadows corridor, generally a step below Holly Ridge for comparable square footage, largely because it's a quieter address without direct lake frontage or greenspace backing on every lot.",
        "If wooded and quiet is on your list, it's worth setting up an alert for this one specifically — the listings that hit here get outsized interest for how little attention the neighborhood otherwise gets. Happy to set that up, or walk through current options on a quick call.",
      ],
    },
    {
      title: "Who Actually Buys in Deer Creek, Camas?",
      keyword: "Deer Creek Camas buyers guide",
      paragraphs: [
        "Deer Creek's buyers tend to be repeat Camas movers — people who've already lived in the area, know the school system, and are specifically looking for more privacy and more trees the second time around.",
        "It's less of a starter-home destination than Holly Ridge and more of a step-up move: established landscaping, a quieter street, still inside the Camas School District boundary, still a reasonable commute to Portland via SR-14.",
        "If that description fits where you are in your own search, Deer Creek deserves a look even though it rarely makes the highlight-reel lists — some of the best value in this corridor is sitting quietly on its side streets.",
      ],
    },
  ],
  "Harney Heights, Vancouver": [
    {
      title: "Harney Heights: Northeast Vancouver's Best-Kept Secret",
      keyword: "Harney Heights Vancouver WA homes",
      paragraphs: [
        "Harney Heights doesn't get the attention that some of Vancouver's newer subdivisions do, and that's exactly the appeal — an established, quiet pocket of northeast Vancouver with mature trees, settled landscaping, and noticeably less through-traffic than the busier east-county corridors.",
        "It sits close enough to the Mill Plain and SR-14 corridor for an easy commute, while feeling several steps removed from the retail density around Vancouver Mall — a real neighborhood rather than a collection of subdivisions stacked against arterial roads.",
        "Home styles run older and more varied than the newer east Vancouver developments, which means more character per square foot and, usually, more negotiating room for buyers willing to update a kitchen themselves.",
      ],
    },
    {
      title: "Harney Heights Market Pulse: Quiet Neighborhood, Active Market",
      keyword: "Harney Heights Vancouver market update",
      paragraphs: [
        "Harney Heights doesn't generate the listing volume of the bigger east-Vancouver developments, but that scarcity works in sellers' favor — homes here have been going under contract quickly whenever they're priced in line with recent comparable sales.",
        "Buyers coming from outside the immediate area are often surprised by how much house their budget covers here compared to the newer subdivisions closer to I-205, and that value gap is the main driver of current demand.",
        "If you want a heads-up the moment something lists in Harney Heights, that's an easy thing to set up — this is one of those neighborhoods where being first matters more than usual.",
      ],
    },
    {
      title: "Who Should Be Looking at Harney Heights?",
      keyword: "Harney Heights Vancouver buyers guide",
      paragraphs: [
        "Harney Heights suits buyers who've already ruled out the newer, denser subdivisions and want an established neighborhood instead — more mature trees, more varied architecture, and neighbors who've often been there for decades rather than years.",
        "It's a strong fit for buyers comfortable with a home that might need some updating in exchange for a quieter street and a lower price per square foot than comparable newer construction.",
        "If that trade-off sounds right to you, Harney Heights is worth a dedicated look rather than a drive-by — it rewards buyers who actually get out and walk the blocks.",
      ],
    },
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
  w1: "Main Site",
  w2: "eXp Site",
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
  "Holly Ridge, Camas": ["farmhouse", "stuccoTraditional", "cozyLivingRoom"],
  "Lakeshore, Vancouver": ["keychain", "modernTree", "loftDog"],
  "Pleasant Valley, Vancouver": ["modernLivingRoom", "modernWoodAccent", "minimalistWhite"],
  "Hunter Ridge Estates, Camas": ["luxuryVillaPool", "whiteVillaPool", "cozyLivingRoom"],
  "Columbia Way, Vancouver": ["whiteVillaPool", "craftsmanPalm", "keychain"],
  "Deer Creek, Camas": ["craftsmanPalm", "farmhouse", "modernLivingRoom"],
  "Harney Heights, Vancouver": ["cabinDusk", "minimalistWhite", "modernTree"],
};

function titleIndexForPost(post: Post): number {
  const titles = TITLES[post.area];
  return titles ? titles.findIndex((s) => s.title === post.title) : -1;
}

function photoForPost(post: Post): string {
  const idx = titleIndexForPost(post);
  const pool = AREA_PHOTOS[post.area];
  const key = pool && idx >= 0 ? pool[idx] : "farmhouse";
  return photoUrl(key);
}

function articleParagraphs(post: Post): string[] {
  const idx = titleIndexForPost(post);
  const seed = idx >= 0 ? TITLES[post.area]?.[idx] : undefined;
  return seed?.paragraphs ?? [];
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
    ROTATION[d].forEach((areaIdx, slot) => {
      const [areaName, slug] = AREAS[areaIdx];
      const n = useCount[areaName];
      const seed = TITLES[areaName][n];
      useCount[areaName]++;
      posts.push({
        id: "p" + id++,
        date: dateLabel,
        day: dayName,
        time: TIME_SLOTS[slot],
        area: areaName,
        areaUrl: "jamiemeushawrealestate.com/blog/" + slug,
        title: seed.title,
        keyword: seed.keyword,
        status: "Drafted",
        platforms: {
          gbp: "Not Started",
          w1: "Not Started",
          w2: "Not Started",
          li: "Not Started",
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

    async function moveStatus(post: Post, newStatus: Status) {
      if (post.status === newStatus) return;
      post.status = newStatus;
      post.statusChangedAt = new Date().toISOString();
      await saveData();
      renderAll();
      if (modalPostId === post.id) renderModal(post.id);
    }

    function formatMovedAt(iso: string): string {
      return new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
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

      const statusOptions = STATUS_ORDER.map(
        (s) =>
          `<option value="${s}" ${s === post.status ? "selected" : ""}>${STATUS_LABEL[s]}</option>`
      ).join("");

      card.innerHTML = `
        <div class="card-top">
          <span class="card-area">${post.area}</span>
          <span class="card-when">${post.date} · ${post.time}</span>
        </div>
        <p class="card-title">${post.title}</p>
        <div class="platform-row">${platRow}</div>
        <div class="card-footer">
          <select class="card-status-select" data-post="${post.id}" title="Move to a different stage">${statusOptions}</select>
          ${post.statusChangedAt ? `<span class="card-moved">Moved ${formatMovedAt(post.statusChangedAt)}</span>` : ""}
        </div>
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

      const select = card.querySelector<HTMLSelectElement>(".card-status-select")!;
      select.addEventListener("click", (e) => e.stopPropagation());
      select.addEventListener("change", async (e) => {
        e.stopPropagation();
        const p = boardData.find((x) => x.id === post.id);
        if (!p) return;
        await moveStatus(p, select.value as Status);
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
          if (post) await moveStatus(post, status);
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

      const statusOptions = STATUS_ORDER.map(
        (s) =>
          `<option value="${s}" ${s === post.status ? "selected" : ""}>${STATUS_LABEL[s]}</option>`
      ).join("");

      el<HTMLDivElement>("modalBody").innerHTML = `
        <img class="modal-photo" src="${photoForPost(post)}" alt="${post.title}" />
        <div class="modal-content">
          <div class="modal-top">
            <span class="card-area">${post.area}</span>
            <span class="card-when">${post.date} · ${post.time}</span>
          </div>
          <h2 class="modal-title">${post.title}</h2>
          <div class="modal-byline">By Jamie Meushaw | Buying, Renting | ${post.day}, ${post.date}</div>
          <div class="modal-kw">Target keyword: <strong>${post.keyword}</strong></div>
          <a class="card-link" href="#" onclick="return false;">${post.areaUrl}</a>
          <div class="modal-article">
            ${articleParagraphs(post)
              .map((p) => `<p>${p}</p>`)
              .join("")}
          </div>
          <div class="modal-section-label">Pipeline stage</div>
          <div class="card-footer">
            <select class="card-status-select" id="modalStatusSelect" title="Move to a different stage">${statusOptions}</select>
            ${post.statusChangedAt ? `<span class="card-moved">Moved ${formatMovedAt(post.statusChangedAt)}</span>` : ""}
          </div>
          <div class="modal-section-label">Publishing status</div>
          <div class="platform-row">${platRow}</div>
        </div>
      `;

      const modalSelect = el<HTMLSelectElement>("modalStatusSelect");
      modalSelect.addEventListener("change", async () => {
        await moveStatus(post, modalSelect.value as Status);
      });
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
      if (
        !window.confirm(
          "This replaces every card on the board with a fresh draft week. Any progress on the current week will be lost. Continue?"
        )
      ) {
        return;
      }
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
