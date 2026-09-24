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
  metaDescription: string;
  status: Status;
  statusChangedAt?: string;
  platforms: { gbp: Status; w1: Status; w2: Status; li: Status; fb: Status };
  // Stable pointer into TITLES[area] — set at creation so editing a PostSeed's hook/wording
  // later never orphans an already-saved post (title-string matching alone is fragile: it
  // silently breaks articleParagraphs() for any post whose title no longer matches after an
  // edit). Optional only because posts saved before this field existed need one migration
  // pass to backfill it — see loadData().
  variant?: "guide" | "update" | "considerations";
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
  ["Pioneer Canyon, Ridgefield", "pioneer-canyon-ridgefield-wa"],
  ["Battle Ground Meadows, Battle Ground", "battle-ground-meadows-battle-ground-wa"],
  ["Stephens Hillside Farm, La Center", "stephens-hillside-farm-la-center-wa"],
  ["Northfork Landing, Woodland", "northfork-landing-woodland-wa"],
  ["Washougal, Washougal", "washougal-wa"],
  ["Hockinson, Hockinson", "hockinson-wa"],
  ["Amboy, Amboy", "amboy-wa"],
  ["Brush Prairie, Brush Prairie", "brush-prairie-wa"],
  ["Cascade Park, Vancouver", "cascade-park-vancouver-wa"],
  ["Fisher's Landing, Vancouver", "fishers-landing-vancouver-wa"],
  ["Downtown Vancouver, Vancouver", "downtown-vancouver-wa"],
  ["Salmon Creek, Vancouver", "salmon-creek-vancouver-wa"],
  ["Irvington, Portland", "irvington-portland-or"],
  ["Sexton Mountain, Beaverton", "sexton-mountain-beaverton-or"],
  ["Bull Mountain, Tigard", "bull-mountain-tigard-or"],
  ["North Bethany, Bethany", "north-bethany-or"],
  ["Orenco Station, Hillsboro", "orenco-station-hillsboro-or"],
  ["Mountain Park, Lake Oswego", "mountain-park-lake-oswego-or"],
  ["Hidden Springs, West Linn", "hidden-springs-west-linn-or"],
  ["Canemah, Oregon City", "canemah-oregon-city-or"],
  ["Historic Milwaukie, Milwaukie", "historic-milwaukie-or"],
  ["Rock Creek, Happy Valley", "rock-creek-happy-valley-or"],
];

// State grouping for the filter/checklist UI. WA areas above came first (7 original +
// 12-area expansion); OR areas (Portland, Beaverton, Tigard, Bethany, Hillsboro, Lake
// Oswego, West Linn, Oregon City, Milwaukie, Happy Valley) were added in the next phase.
const OR_AREA_NAMES = new Set([
  "Irvington, Portland",
  "Sexton Mountain, Beaverton",
  "Bull Mountain, Tigard",
  "North Bethany, Bethany",
  "Orenco Station, Hillsboro",
  "Mountain Park, Lake Oswego",
  "Hidden Springs, West Linn",
  "Canemah, Oregon City",
  "Historic Milwaukie, Milwaukie",
  "Rock Creek, Happy Valley",
]);
const AREA_STATE: Record<string, "WA" | "OR"> = Object.fromEntries(
  AREAS.map(([name]) => [name, OR_AREA_NAMES.has(name) ? ("OR" as const) : ("WA" as const)])
);
const STATE_LABEL: Record<"WA" | "OR", string> = { WA: "Washington", OR: "Oregon" };
const STATE_ORDER: ("WA" | "OR")[] = ["WA", "OR"];

// Real, verified property-search URLs — Camas/Vancouver/Ridgefield/Battle Ground/La Center/
// Woodland/Hockinson/Amboy/Washougal all come from the client's own "WASHINGTON CITY LINKS"
// doc. "Brush Prairie" isn't in that doc at all (no city-level link was ever given for it) —
// it's constructed from the same URL pattern as every confirmed one and returns a real page
// (tested), but it's lower-confidence than the others since it wasn't explicitly provided.
// Flag it for a real verification pass once site access exists, same as the pending
// neighborhood URLs below.
const CITY_URLS: Record<string, string> = {
  Camas: "https://jamiemeushawrealestate.com/properties/city-Camas,%20WA/",
  Vancouver: "https://jamiemeushawrealestate.com/properties/city-Vancouver,%20WA/",
  Ridgefield: "https://jamiemeushawrealestate.com/properties/city-Ridgefield,%20WA/",
  "Battle Ground": "https://jamiemeushawrealestate.com/properties/city-Battle%20Ground,%20WA/",
  "La Center": "https://jamiemeushawrealestate.com/properties/city-La%20Center,%20WA/",
  Woodland: "https://jamiemeushawrealestate.com/properties/city-Woodland,%20WA/",
  Hockinson: "https://jamiemeushawrealestate.com/properties/place-Hockinson,%20WA/",
  Amboy: "https://jamiemeushawrealestate.com/properties/city-Amboy,%20WA/",
  Washougal: "https://jamiemeushawrealestate.com/properties/city-Washougal,%20WA/",
  // Constructed, not client-provided — see comment above.
  "Brush Prairie": "https://jamiemeushawrealestate.com/properties/city-Brush%20Prairie,%20WA/",
  // Real, verified — from the client's own "OREGON CITY LINKS" doc.
  Portland: "https://jamiemeushawrealestate.com/properties/city-Portland,%20OR/",
  Beaverton: "https://jamiemeushawrealestate.com/properties/city-Beaverton,%20OR/",
  Tigard: "https://jamiemeushawrealestate.com/properties/place-Tigard,%20OR/",
  Bethany: "https://jamiemeushawrealestate.com/properties/place-Bethany,%20OR/",
  Hillsboro: "https://jamiemeushawrealestate.com/properties/place-Hillsboro,%20OR/",
  "Lake Oswego": "https://jamiemeushawrealestate.com/properties/city-Lake%20Oswego,%20OR/",
  "West Linn": "https://jamiemeushawrealestate.com/properties/city-West%20Linn,%20OR/",
  "Oregon City": "https://jamiemeushawrealestate.com/properties/city-Oregon%20City,%20OR/",
  Milwaukie: "https://jamiemeushawrealestate.com/properties/place-Milwaukie,%20OR/",
  "Happy Valley": "https://jamiemeushawrealestate.com/properties/city-Happy%20Valley,%20OR/",
};

// Per the official SOP, a real neighborhood search URL must be generated + tested via the
// live property search on jamiemeushawrealestate.com (requires an account the VA doesn't
// have yet as of 2026-09-23). Only these are confirmed real, from the client's own docs:
// Holly Ridge (Final Blog Example) and Fisher's Landing / Downtown Vancouver / Salmon Creek
// (WASHINGTON CITY LINKS, "large areas" section — used exactly as given, including the
// Downtown Vancouver polygon boundary). Everywhere else stays null, or — for towns with no
// distinct sub-neighborhood (Washougal, Hockinson, Amboy, Brush Prairie) — falls back to that
// town's own city-level link, since there's no narrower scope to search in the first place.
// Cascade Park has no client-provided link at all; its city-level URL is a same-pattern
// construction like Brush Prairie's, not a confirmed real search.
const NEIGHBORHOOD_URLS: Record<string, string | null> = {
  "Holly Ridge, Camas":
    "https://jamiemeushawrealestate.com/properties/neighborhood-Holly%20Ridge,%20Camas,%20WA/?box=-122.44137717237012%2C45.603188674527445%2C-122.43877191994316%2C45.60472275603769",
  "Lakeshore, Vancouver": null,
  "Pleasant Valley, Vancouver": null,
  "Hunter Ridge Estates, Camas": null,
  "Columbia Way, Vancouver": null,
  "Deer Creek, Camas": null,
  "Harney Heights, Vancouver": null,
  "Pioneer Canyon, Ridgefield": null,
  "Battle Ground Meadows, Battle Ground": null,
  "Stephens Hillside Farm, La Center": null,
  "Northfork Landing, Woodland": null,
  "Washougal, Washougal": CITY_URLS["Washougal"],
  "Hockinson, Hockinson": CITY_URLS["Hockinson"],
  "Amboy, Amboy": CITY_URLS["Amboy"],
  "Brush Prairie, Brush Prairie": CITY_URLS["Brush Prairie"],
  "Cascade Park, Vancouver": "https://jamiemeushawrealestate.com/properties/city-Cascade%20Park,%20WA/",
  "Fisher's Landing, Vancouver":
    "https://jamiemeushawrealestate.com/properties/neighborhood-Fisher's%20Landing,%20Vancouver,%20WA/",
  "Downtown Vancouver, Vancouver":
    "https://jamiemeushawrealestate.com/properties/#/p/-122.67577350198809,45.6184827040957|-122.65505341179498,45.612607119177014|-122.62252795133809,45.61067543945868|-122.64169983820209,45.63819675869527|-122.64113222032486,45.64670744631323|-122.65051007584096,45.650617471842565|-122.66219141584409,45.6509492125663|-122.66629762793411,45.65801425891175|-122.69061903800625,45.674790171788345|-122.69314593775398,45.67456946873304|-122.72473218460112,45.659559618987316|-122.73736668333973,45.64785797451367|-122.72820667175424,45.637699848292044|-122.67577350198809,45.6184827040957",
  "Salmon Creek, Vancouver": "https://jamiemeushawrealestate.com/properties/place-Salmon%20Creek,%20WA/",
  // No neighborhood-level OR links were ever provided — all pending, same as most of the WA
  // batch. Each falls back to its city-level URL (all real, from OREGON CITY LINKS) until a
  // real neighborhood search is run.
  "Irvington, Portland": null,
  "Sexton Mountain, Beaverton": null,
  "Bull Mountain, Tigard": null,
  "North Bethany, Bethany": null,
  "Orenco Station, Hillsboro": null,
  "Mountain Park, Lake Oswego": null,
  "Hidden Springs, West Linn": null,
  "Canemah, Oregon City": null,
  "Historic Milwaukie, Milwaukie": null,
  "Rock Creek, Happy Valley": null,
};

const SCHOOL_DISTRICTS: Record<string, string> = {
  "Holly Ridge, Camas": "Camas School District",
  "Lakeshore, Vancouver": "Vancouver Public Schools",
  "Pleasant Valley, Vancouver": "Vancouver Public Schools",
  "Hunter Ridge Estates, Camas": "Camas School District",
  "Columbia Way, Vancouver": "Vancouver Public Schools",
  "Deer Creek, Camas": "Camas School District",
  "Harney Heights, Vancouver": "Vancouver Public Schools",
  "Pioneer Canyon, Ridgefield": "Ridgefield School District",
  "Battle Ground Meadows, Battle Ground": "Battle Ground Public Schools",
  "Stephens Hillside Farm, La Center": "La Center School District",
  "Northfork Landing, Woodland": "Woodland School District",
  "Washougal, Washougal": "Washougal School District",
  "Hockinson, Hockinson": "Hockinson School District",
  "Amboy, Amboy": "Battle Ground Public Schools",
  "Brush Prairie, Brush Prairie":
    "Battle Ground Public Schools or Hockinson School District area (verify by exact address)",
  "Cascade Park, Vancouver": "Evergreen Public Schools",
  "Fisher's Landing, Vancouver": "Evergreen Public Schools",
  "Downtown Vancouver, Vancouver": "Vancouver Public Schools",
  "Salmon Creek, Vancouver": "Vancouver Public Schools",
  "Irvington, Portland": "Portland Public Schools",
  "Sexton Mountain, Beaverton": "Beaverton School District",
  "Bull Mountain, Tigard": "Tigard-Tualatin School District",
  "North Bethany, Bethany": "Beaverton School District",
  "Orenco Station, Hillsboro": "Hillsboro School District",
  "Mountain Park, Lake Oswego": "Lake Oswego School District",
  "Hidden Springs, West Linn": "West Linn-Wilsonville School District",
  "Canemah, Oregon City": "Oregon City School District",
  "Historic Milwaukie, Milwaukie": "North Clackamas School District",
  "Rock Creek, Happy Valley": "North Clackamas School District",
};

const YOUTUBE_URL = "https://www.youtube.com/@JamieMeushaw";
const CALENDLY_URL = "https://calendly.com/jamiemeushawrealestate";
const CONTACT_PHONE = "(360) 798-7127";
const CONTACT_EMAIL = "jamie@jamiemeushawrealestate.com";
const WEBSITE_URL = "https://www.jamiemeushawrealestate.com";
const SCHOOL_DISCLAIMER =
  "School boundaries and assignments can change. Buyers should verify current school assignments directly with the school district.";

// Jamie's business runs on Pacific Time (both WA and OR are in this zone) — every date/time
// shown or evaluated by this app should reflect Pacific, not whatever timezone a visitor's
// own browser/device happens to be set to. Plain `toLocaleDateString()`/`new Date(string)`
// calls are implicitly browser-local, so anywhere this app displays or parses a date/time,
// route it through these helpers instead.
const PACIFIC_TZ = "America/Los_Angeles";
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// How far Pacific time is from UTC, in minutes, at a given real instant (-480 for PST,
// -420 for PDT) — computed via Intl rather than hardcoded so daylight saving is handled.
function pacificOffsetMinutesAt(instant: Date): number {
  const parts: Record<string, string> = {};
  new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC_TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(instant)
    .forEach((p) => (parts[p.type] = p.value));
  const hour = parts.hour === "24" ? 0 : Number(parts.hour);
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second)
  );
  return (asUTC - instant.getTime()) / 60000;
}

// Pacific-local wall-clock components -> the real absolute instant they refer to.
function pacificComponentsToDate(
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number
): Date {
  const naiveUTC = Date.UTC(year, monthIndex, day, hour, minute);
  const offsetMin = pacificOffsetMinutesAt(new Date(naiveUTC));
  return new Date(naiveUTC - offsetMin * 60000);
}

// The current date in Pacific terms — used anywhere "today"/"tomorrow" needs to mean
// Pacific's today, not the visitor's own browser-local today.
function pacificDateParts(instant: Date): { year: number; month: number; day: number } {
  const parts: Record<string, string> = {};
  new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(instant)
    .forEach((p) => (parts[p.type] = p.value));
  return { year: Number(parts.year), month: Number(parts.month) - 1, day: Number(parts.day) };
}

function pacificWeekdayName(instant: Date): string {
  return instant.toLocaleDateString("en-US", { weekday: "long", timeZone: PACIFIC_TZ });
}

function pacificDateLabel(instant: Date): string {
  return instant.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: PACIFIC_TZ });
}

function pacificTimeLabel(instant: Date): string {
  return instant.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: PACIFIC_TZ });
}

// "## " renders as a section heading, "### " as a sub-heading — see renderModal.
function h2(text: string) {
  return "## " + text;
}
function h3(text: string) {
  return "### " + text;
}

function neighborhoodLinkLine(label: string, url: string | null): string {
  return url
    ? `${label}: <a href="${url}" target="_blank" rel="noopener">${url}</a>`
    : `${label}: <em>neighborhood search link pending — the VA is finalizing site search access</em>`;
}

function cityLinkLine(label: string, url: string): string {
  return `${label}: <a href="${url}" target="_blank" rel="noopener">${url}</a>`;
}

function exploreHomesBlock(
  neighborhood: string,
  city: string,
  stateAbbr: string,
  nUrl: string | null,
  cUrl: string
): string[] {
  return [
    h2("Explore Homes for Sale"),
    neighborhoodLinkLine(`View homes for sale in ${neighborhood}`, nUrl),
    cityLinkLine(`View all homes for sale in ${city}, ${stateAbbr}`, cUrl),
    "Inventory and pricing change quickly — these links show what's currently on the market rather than numbers from when this was written.",
  ];
}

function seeHomesBlock(
  neighborhood: string,
  city: string,
  stateAbbr: string,
  nUrl: string | null,
  cUrl: string
): string[] {
  return [
    h2(`See Homes in ${neighborhood}`),
    neighborhoodLinkLine(`View homes currently for sale in ${neighborhood}`, nUrl),
    cityLinkLine(`View all homes for sale in ${city}, ${stateAbbr}`, cUrl),
    "Don't see the right home? Inventory in individual neighborhoods can be limited — nearby neighborhoods with similar homes, locations and amenities are often worth a look too.",
  ];
}

function youtubeBlock(city: string, stateAbbr: string): string[] {
  return [
    h2(`Moving to ${city}, ${stateAbbr} or the Surrounding Area?`),
    "Jamie's YouTube channel has a growing library of videos covering Camas, Vancouver and other communities throughout Southwest Washington and the Portland metro area — a good way to get a feel for different neighborhoods and housing options before making a move.",
    `Watch Jamie Meushaw Real Estate on YouTube: <a href="${YOUTUBE_URL}" target="_blank" rel="noopener">${YOUTUBE_URL}</a>`,
  ];
}

function workWithJamieBlock(): string[] {
  return [
    h2("Work With Jamie"),
    "Jamie has been in real estate for 30 years and works with relocation buyers to compare cities, neighborhoods, commutes and property types until something actually fits — not to sell one particular neighborhood.",
    `Book a Strategy Call: <a href="${CALENDLY_URL}" target="_blank" rel="noopener">${CALENDLY_URL}</a><br />Call / Text: ${CONTACT_PHONE}<br />Email: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><br />Website: <a href="${WEBSITE_URL}" target="_blank" rel="noopener">${WEBSITE_URL}</a>`,
  ];
}

function costBlock(neighborhood: string, nUrl: string | null): string[] {
  return [
    h2(`How Much Do Homes Cost in ${neighborhood}?`),
    "Pricing depends on size, condition, updates, the lot and exactly where a property sits in the neighborhood, and it moves with the market — a fixed range printed here would go stale fast.",
    neighborhoodLinkLine(`See current ${neighborhood} homes for sale`, nUrl),
  ];
}

function schoolsBlock(neighborhood: string, district: string): string[] {
  return [h2(`Schools Serving ${neighborhood}`), `${neighborhood} is in the ${district}.`, SCHOOL_DISCLAIMER];
}

type PostSeed = {
  hook: string;
  keyword: string;
  metaDescription: string;
  variant: "guide" | "update" | "considerations";
  intro: string[];
  livingIn?: string[];
  whereLocated?: string[];
  homesIn?: string[];
  parks?: string[];
  commute?: string[];
  marketNotes?: string[];
  reasons?: string[];
  considerations?: string[];
  closing: string[];
};

function seedTitle(area: string, seed: PostSeed): string {
  const neighborhood = area.split(",")[0].trim();
  const city = area.split(",")[1].trim();
  return `Moving to ${city}, ${AREA_STATE[area] ?? "WA"}? Consider ${neighborhood}: ${seed.hook}`;
}

const TITLES: Record<string, PostSeed[]> = {
  "Holly Ridge, Camas": [
    {
      hook: "Prune Hill Greenspace, Lacamas Lake Access & Established Homes",
      keyword: "Holly Ridge Camas WA",
      metaDescription:
        "Moving to Camas, WA? See what living in Holly Ridge is like — location, homes, Lacamas Lake access, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Camas, Washington, Holly Ridge is worth a look — especially if you want an established home with easy access to the outdoor spaces that draw a lot of people to this part of Camas.",
        "Holly Ridge sits in the Camas Meadows area, between Prune Hill and Lacamas Lake. I've worked in Southwest Washington real estate for decades, and the neighborhood comes up often when buyers ask about established Camas addresses with some separation from newer subdivisions.",
      ],
      livingIn: [
        "Holly Ridge is an established part of Camas, built mostly between the late 1990s and early 2000s. That gives the neighborhood mature trees and settled landscaping you won't find in newer construction farther north or east in Camas.",
        "The housing stock is more varied than in subdivisions built from a handful of repeated floor plans — you'll see a mix of townhome-style properties and larger single-family homes on the same streets.",
      ],
      whereLocated: [
        "Holly Ridge sits in the Camas Meadows area, close to Prune Hill and Lacamas Lake, while staying within the City of Camas.",
        "Access toward Vancouver is fairly direct, and SR-14 is the main route toward Portland and the rest of the metro area. Everyday shopping and restaurants are nearby along the surrounding commercial corridors.",
      ],
      homesIn: [
        "Homes here run from smaller attached or townhome-style properties up to larger detached single-family homes, generally two-story with traditional Northwest architecture, open kitchen and family-room layouts, and bonus rooms.",
        "Many homes back up to permanent Prune Hill greenspace, which gives the rear yards more privacy and territorial views than you'll typically find on a standard suburban lot. Lot size, condition and updates vary property to property, so it's worth comparing more than one listing before drawing conclusions about the neighborhood as a whole.",
      ],
      parks: [
        "Prune Hill greenspace runs behind a number of Holly Ridge properties, giving some homes direct access to wooded open space without leaving the neighborhood.",
        "Lacamas Lake is close by, with trails and outdoor recreation that are one of the bigger draws for people moving to this part of Camas. It's a combination of an established residential setting with genuinely convenient outdoor access.",
      ],
      commute: [
        "SR-14 is the main route toward Portland from Holly Ridge, and access toward Vancouver is relatively direct from this part of Camas.",
        "Traffic across the Portland-Vancouver metro area varies a lot by time of day, especially around bridge crossings. If commute time matters to your decision, it's worth testing the actual drive during the hours you'd be traveling rather than relying on a map estimate.",
      ],
      reasons: [
        "<strong>Established neighborhood:</strong> trees and landscaping have had decades to mature, unlike newer construction elsewhere in Camas.",
        "<strong>Housing variety:</strong> a mix of home sizes and property types rather than one repeated floor plan.",
        "<strong>Prune Hill greenspace and Lacamas Lake access:</strong> some of the more convenient outdoor recreation in this part of Camas.",
        "<strong>West Camas location:</strong> relatively straightforward access toward Vancouver and the broader metro area.",
      ],
      considerations: [
        "<strong>Inventory can be limited:</strong> Holly Ridge isn't a large development, so there may not always be something on the market when you're ready to buy.",
        "<strong>Homes aren't new construction:</strong> buyers who specifically want brand-new finishes and floor plans may prefer other Camas developments.",
        "<strong>Condition varies:</strong> some homes have been updated, others still have more original finishes.",
        "<strong>Individual lots matter:</strong> greenspace backing, elevation and views differ meaningfully from one address to the next.",
      ],
      closing: [
        "If you're moving to Camas and your priorities include an established neighborhood, proximity to Lacamas Lake, mature landscaping and relatively convenient access toward Vancouver, Holly Ridge is worth comparing against other west Camas areas like Prune Hill and Camas Meadows.",
        "Don't start by deciding which neighborhood someone online calls the best option. Start with how you actually want to live — budget, commute, type of home, lot size and the places you'll use regularly — and narrow it down from there.",
      ],
    },
    {
      hook: "Why Listings Here Don't Last Long",
      keyword: "Holly Ridge Camas market update",
      metaDescription:
        "Holly Ridge listings in Camas have been moving fast this season — here's what's driving the pace and what buyers should know.",
      variant: "update",
      intro: [
        "Ask around about Holly Ridge and you'll hear the same thing: nothing sits long. Here's why, and what it means if you're watching this part of Camas.",
      ],
      marketNotes: [
        "Townhome-style listings are usually gone within two weeks. Larger single-family homes take a bit longer, but not by much.",
        "A recurring theme with out-of-state buyers: the first question is almost always about how close a listing is to Lacamas Lake, before price or square footage even come up.",
        "Financing pre-approval before a listing goes live, not after, has become the difference between competing seriously and missing out entirely in this neighborhood.",
      ],
      closing: [
        "Buyers who've had the best luck here are the ones already set up to move the day something new appears — worth getting there before you start touring.",
      ],
    },
    {
      hook: "The Honest Tradeoffs of an Established Address",
      keyword: "living in Holly Ridge Camas",
      metaDescription:
        "The real tradeoffs of buying in Holly Ridge, Camas — home age, lot differences, and what to expect on a tour of the neighborhood.",
      variant: "considerations",
      intro: [
        "Holly Ridge gets a lot of attention for good reason, but it helps to walk in knowing where the tradeoffs actually are.",
      ],
      reasons: [
        "<strong>Mature setting:</strong> established trees and landscaping that new construction can't replicate.",
        "<strong>Greenspace and lake proximity:</strong> some homes back directly to Prune Hill greenspace, with Lacamas Lake close by.",
      ],
      considerations: [
        "<strong>Some homes need updating:</strong> kitchens and bathrooms in particular are worth a close look on a tour, since the neighborhood was built mostly in the late 1990s and early 2000s.",
        "<strong>Lot sizes vary by street:</strong> if outdoor space matters to you, compare a few addresses rather than assuming they're all similar.",
        "<strong>Resale only:</strong> new construction isn't really part of the picture here, so a fully updated kitchen may mean paying for renovations rather than finding one move-in ready.",
      ],
      closing: [
        "None of that shows up well in photos — the greenspace backing, the light in a kitchen, how close a street actually feels to the lake. Seeing two or three homes in person tends to settle the question faster than more scrolling.",
      ],
    },
  ],
  "Lakeshore, Vancouver": [
    {
      hook: "Vancouver Lake Access on Larger, Established Lots",
      keyword: "Lakeshore Vancouver WA homes",
      metaDescription:
        "Moving to Vancouver, WA? See what Lakeshore is like — homes near Vancouver Lake, lot sizes, commute options and current listings.",
      variant: "guide",
      intro: [
        "Lakeshore sits in northwest Vancouver, close to Vancouver Lake. If easy access to the lake and a bit more room around the house matter to you, it's worth a look as you compare Vancouver neighborhoods.",
      ],
      livingIn: [
        "Homes in Lakeshore tend to be older than the newer construction farther east in Clark County. That keeps the neighborhood feeling more established, with mature trees and generally larger lots than you'll find in tighter subdivisions.",
      ],
      whereLocated: [
        "Lakeshore sits close to Vancouver Lake Regional Park and its paved trail system in northwest Vancouver. From here, I-5 provides access north toward Salmon Creek or south into downtown Vancouver and across into Portland.",
      ],
      homesIn: [
        "Housing stock here skews older than the newer east-county developments, with a range of single-family layouts and, on average, larger lots and more mature trees than tighter modern subdivisions.",
        "Because homes were built earlier, some may need updates to kitchens, roofs or mechanical systems — a home inspection is worth taking seriously here, especially on older properties.",
      ],
      parks: [
        "Vancouver Lake Regional Park is the defining outdoor feature near Lakeshore, with a paved trail system that turns an evening walk into an actual destination. The lake itself supports boating, paddling and other water recreation.",
      ],
      commute: [
        "I-5 runs both directions from Lakeshore — north toward Salmon Creek, or south into downtown Vancouver and across into Portland. Actual drive times depend a lot on when you're on the road, so it's worth checking during your normal commute hours rather than relying on a map estimate.",
      ],
      reasons: [
        "<strong>Vancouver Lake access:</strong> close to the regional park and its trail system, one of the bigger outdoor draws in this part of Vancouver.",
        "<strong>Larger, established lots:</strong> more room and mature trees compared with tighter, newer subdivisions.",
        "<strong>I-5 access in both directions:</strong> reasonably direct routes toward Salmon Creek, downtown Vancouver and Portland.",
      ],
      considerations: [
        "<strong>Longer drive to some central neighborhoods:</strong> Lakeshore sits farther from downtown Vancouver than areas like Columbia Way or Harney Heights.",
        "<strong>Home age:</strong> some properties may need updates to kitchens, roofs or mechanical systems.",
        "<strong>Lot sizes vary street to street:</strong> compare specific addresses rather than assuming the whole neighborhood is uniform.",
      ],
      closing: [
        "If you're moving to Vancouver and lake access and a bit more space are high on your list, Lakeshore is worth comparing against other northwest Vancouver neighborhoods. Start with your own priorities — commute, lot size, home age — and narrow it down from there.",
      ],
    },
    {
      hook: "What's Actually Driving Demand Near the Lake",
      keyword: "Lakeshore Vancouver home prices",
      metaDescription:
        "What's driving buyer demand for Lakeshore in Vancouver, WA right now, and how inventory near Vancouver Lake compares.",
      variant: "update",
      intro: [
        "Vancouver Lake access is the single biggest driver of interest in Lakeshore right now — here's how that's playing out in actual listings.",
      ],
      marketNotes: [
        "Park-adjacent homes on larger lots are genuinely rare here, and they don't sit on the market once priced realistically.",
        "A lot of buyers comparing Lakeshore against true waterfront property on the Columbia end up here instead — same general lifestyle, different price tier.",
        "Spring and early summer bring out the most competition, since touring a home with lake access hits differently on a nice weekend. Winter listings see less of a crowd.",
      ],
      closing: [
        "An alert set up now beats checking back manually — this isn't a neighborhood where waiting a week costs you nothing.",
      ],
    },
    {
      hook: "Is the Commute Trade Worth Lake Access?",
      keyword: "living in Lakeshore Vancouver WA",
      metaDescription:
        "The real commute-versus-lake-access tradeoff in Lakeshore, Vancouver — plus home age and lot size, explained clearly.",
      variant: "considerations",
      intro: [
        "Lakeshore asks buyers to make one real tradeoff more than most Vancouver neighborhoods: commute distance for lake access.",
      ],
      reasons: [
        "<strong>Lake access:</strong> close to Vancouver Lake Regional Park and its trail system.",
        "<strong>Larger lots:</strong> more separation from neighbors than many newer subdivisions.",
      ],
      considerations: [
        "<strong>Commute:</strong> Lakeshore is a longer drive into downtown Vancouver than more central neighborhoods — worth factoring in if a short commute matters more than lake access.",
        "<strong>Home age:</strong> some properties may need updates to kitchens, roofs or mechanical systems.",
        "<strong>Lot size varies:</strong> compare specific addresses rather than assuming the whole neighborhood is the same.",
      ],
      closing: [
        "For buyers who prioritize the lake, the extra minutes in the car tend to stop mattering fast. For buyers who don't, it's worth touring a more central neighborhood side by side before deciding.",
      ],
    },
  ],
  "Pleasant Valley, Vancouver": [
    {
      hook: "Larger Lots & a Semi-Rural Feel East of Vancouver",
      keyword: "Pleasant Valley Vancouver WA homes",
      metaDescription:
        "Moving to Vancouver, WA? See what Pleasant Valley is like — larger lots, semi-rural character, commute options and current listings.",
      variant: "guide",
      intro: [
        "Pleasant Valley sits northeast of downtown Vancouver, off the I-5 and I-205 corridor. It's one of the few pockets left in Clark County where farmland, larger-lot homes and newer construction still sit side by side.",
      ],
      livingIn: [
        "This isn't a walkable neighborhood in the way some closer-in Vancouver areas are — most errands mean getting in the car. In exchange, lot sizes run well above what you'll find in Vancouver's inner subdivisions.",
      ],
      whereLocated: [
        "Pleasant Valley sits off the I-5 and I-205 corridor northeast of downtown Vancouver, within a reasonable drive of Washington State University Vancouver and the shopping around Fisher's Landing.",
      ],
      homesIn: [
        "Housing here ranges from older farmhouses on acreage to newer construction on larger lots. Compared with standard subdivision lots, there's more room for a shop, a garden, or simply more distance from the next house.",
        "Well and septic systems, easement access and zoning for accessory structures are all worth checking early on acreage listings specifically — the due diligence looks different than a typical subdivision purchase.",
      ],
      parks: [
        "Pleasant Valley doesn't have the concentrated parks and trail access of some closer-in neighborhoods, but its larger lots and semi-rural setting are themselves part of the draw for buyers who want more outdoor space attached to the property itself.",
      ],
      commute: [
        "I-5 and I-205 both provide access toward downtown Vancouver and across into Portland. It's a longer drive than more central Vancouver neighborhoods, so it's worth mapping your actual commute during the hours you'd be traveling.",
      ],
      reasons: [
        "<strong>Larger lots:</strong> more room for a shop, garden or added distance from neighbors than standard subdivision lots.",
        "<strong>Semi-rural character:</strong> one of the few pockets in Clark County where farmland and newer construction sit side by side.",
        "<strong>Proximity to WSU Vancouver and Fisher's Landing:</strong> shopping and services within a reasonable drive.",
      ],
      considerations: [
        "<strong>Limited walkability:</strong> most errands mean getting in the car.",
        "<strong>Longer commute:</strong> a longer drive into downtown Vancouver or Portland than more central neighborhoods, though I-5 and I-205 access keeps it manageable.",
        "<strong>Acreage financing can differ:</strong> loan options may look different on larger or agriculturally-zoned parcels, worth discussing early with a lender.",
      ],
      closing: [
        "If space and land matter more to you than walkability to shops and restaurants, Pleasant Valley is worth serious comparison against other larger-lot options in Clark County.",
      ],
    },
    {
      hook: "Reading the Acreage Market Right Now",
      keyword: "Pleasant Valley new listings",
      metaDescription:
        "How acreage listings in Pleasant Valley, Vancouver are moving right now, and what to check before buying land here.",
      variant: "update",
      intro: [
        "Acreage doesn't behave like a normal subdivision listing, and Pleasant Valley is a good example of why.",
      ],
      marketNotes: [
        "Decisions take longer here, but once a buyer commits there's rarely much room to negotiate — there just aren't enough comparable properties to create leverage either way.",
        "The buyers moving fastest this season are the ones coming from tighter urban lots elsewhere in Clark County, chasing more room without leaving the area entirely.",
        "Well, septic, easement access and accessory-structure zoning are worth sorting out before an offer, not after — the due diligence timeline runs longer than a standard subdivision purchase.",
      ],
      closing: [
        "Widening the search radius slightly and watching new listings closely tends to serve acreage buyers better than waiting for the perfect match to appear.",
      ],
    },
    {
      hook: "Space Versus Walkability — The Real Question",
      keyword: "Pleasant Valley Vancouver living",
      metaDescription:
        "Weighing space against walkability before buying in Pleasant Valley, Vancouver — an honest look at both sides.",
      variant: "considerations",
      intro: [
        "Every buyer looking at Pleasant Valley eventually lands on the same question: is the space worth giving up walkability?",
      ],
      reasons: [
        "<strong>Space:</strong> larger lots than almost anywhere else in this rotation, with room for a shop, garden or added privacy.",
        "<strong>Semi-rural character:</strong> a genuinely different feel from Vancouver's inner subdivisions.",
      ],
      considerations: [
        "<strong>Walkability:</strong> this isn't a neighborhood where you stroll to dinner — most errands mean getting in the car.",
        "<strong>Commute:</strong> the longest drive into downtown Vancouver or Portland in this rotation, though I-5 and I-205 access keeps it manageable. Map your actual drive during the hours you'd normally be on the road before deciding.",
        "<strong>Financing on acreage:</strong> can look different, especially anything zoned for agricultural use — worth discussing loan options early.",
      ],
      closing: [
        "Buyers who've made the move here tend to say the same thing: once you stop needing to be five minutes from everything, the tradeoff barely registers.",
      ],
    },
  ],
  "Hunter Ridge Estates, Camas": [
    {
      hook: "Gated, Elevated Lots With Mount Hood Views",
      keyword: "Hunter Ridge Estates Camas homes",
      metaDescription:
        "Moving to Camas, WA? See what Hunter Ridge Estates is like — gated entry, elevated lots, Mount Hood views and current listings.",
      variant: "guide",
      intro: [
        "Hunter Ridge Estates sits above much of Camas — a gated community of custom and semi-custom homes on elevated lots. Some back decks have a clear view of Mount Hood on a clear day.",
      ],
      livingIn: [
        "This is one of the more private settings in Camas: a gated entry, larger lots and less through-traffic than more walkable, established neighborhoods closer to downtown.",
      ],
      whereLocated: [
        "Hunter Ridge Estates sits on elevated ground within Camas, with the same SR-14 route into Portland as the rest of the city.",
      ],
      homesIn: [
        "Homes here tend to run larger and newer than most of the Camas Meadows area, often four or more bedrooms on generous lots, with custom and semi-custom finishes throughout.",
        "View lots with a clear line toward Mount Hood are part of what sets this community apart from other Camas neighborhoods, though the premium and exact view vary lot to lot — it's worth touring at more than one time of day, since light and views can shift more than people expect.",
      ],
      parks: [
        "Hunter Ridge Estates trades proximity to downtown Camas and Lacamas Lake for elevation and privacy — it isn't set up around walkable parks and trails the way some other Camas neighborhoods are.",
      ],
      commute: [
        "SR-14 provides the same route into Portland as the rest of Camas. Traffic varies by time of day, so it's worth testing your actual commute during the hours you'd be driving.",
      ],
      reasons: [
        "<strong>Gated entry and privacy:</strong> less through-traffic than more walkable, established neighborhoods closer to downtown Camas.",
        "<strong>Elevated lots with view potential:</strong> some homes have a clear line toward Mount Hood.",
        "<strong>Larger, newer homes:</strong> generally more square footage and more recent construction than the Camas Meadows area.",
      ],
      considerations: [
        "<strong>Tradeoff with walkability:</strong> this community trades proximity to downtown Camas and Lacamas Lake for elevation and privacy.",
        "<strong>HOA structure:</strong> gated communities often have more involved covenants than older, established neighborhoods — worth reviewing before you get too far into the process.",
        "<strong>View varies by lot:</strong> not every property has the same sightlines, so it's worth touring more than one home and at different times of day.",
      ],
      closing: [
        "The right choice depends on what matters most to you. If daily walkability to the lake or local shops is a priority, neighborhoods like Holly Ridge or Deer Creek offer more of that. Hunter Ridge Estates is built around space, elevation and privacy instead.",
      ],
    },
    {
      hook: "Reading Camas's Gated-Community Market",
      keyword: "Hunter Ridge Estates luxury homes Camas",
      metaDescription:
        "Where Camas's gated-community luxury market stands, and what's setting the pace in Hunter Ridge Estates right now.",
      variant: "update",
      intro: [
        "There's no other Camas neighborhood quite like this one, which makes the market here behave differently too.",
      ],
      marketNotes: [
        "With so few directly comparable listings citywide, this community mostly sets its own pace rather than tracking broader Camas trends.",
        "Interior lots and view lots don't compete on the same terms — a clear line toward Mount Hood consistently pulls more attention.",
        "Buyers at this level are usually cross-shopping against gated communities elsewhere in the Portland metro, not just other Camas neighborhoods.",
      ],
      closing: [
        "Seeing a new listing before it's public tends to matter more here than in almost any other neighborhood in this rotation — worth asking directly rather than waiting for it to hit search sites.",
      ],
    },
    {
      hook: "What the Gate Actually Buys You",
      keyword: "Hunter Ridge Estates Camas review",
      metaDescription:
        "What buying into a gated Camas community actually involves, compared with more walkable neighborhoods nearby in the area.",
      variant: "considerations",
      intro: [
        "A gated entry changes more about daily life than people expect going in — here's what that actually means here.",
      ],
      reasons: [
        "<strong>Privacy and space:</strong> a gated entry and elevated, larger lots set this community apart from more walkable Camas neighborhoods.",
        "<strong>View potential:</strong> some homes have a clear line toward Mount Hood.",
      ],
      considerations: [
        "<strong>Distance from downtown Camas and Lacamas Lake:</strong> if daily walkability matters more than privacy, other Camas neighborhoods may fit better.",
        "<strong>HOA covenants:</strong> often more involved in gated communities — worth reviewing early.",
        "<strong>Light and views shift by time of day:</strong> worth touring more than once before deciding.",
      ],
      closing: [
        "Buyers drawn to Holly Ridge or Deer Creek tend to want proximity first. Buyers drawn here tend to want separation first. Knowing which one you are makes the rest of the search a lot faster.",
      ],
    },
  ],
  "Columbia Way, Vancouver": [
    {
      hook: "Walkable Waterfront Living Near Downtown Vancouver",
      keyword: "Columbia Way Vancouver WA homes",
      metaDescription:
        "Moving to Vancouver, WA? See what Columbia Way is like — waterfront walkability, home types, commute and current listings.",
      variant: "guide",
      intro: [
        "Columbia Way runs along the north bank of the Columbia River, close to downtown Vancouver's waterfront district. A lot of buyers here trade a car trip for a walk — to restaurants along the river, to Esther Short Park, or along the trail toward Wintler Park.",
      ],
      livingIn: [
        "This is a denser, more urban stretch of Vancouver than neighborhoods like Harney Heights or Lakeshore. That's part of the appeal for some buyers and a bigger adjustment for others, depending on what you're used to.",
      ],
      whereLocated: [
        "Columbia Way sits along Vancouver's waterfront, with immediate I-5 access and a short bridge crossing to the Portland side of the river.",
      ],
      homesIn: [
        "Housing stock is more mixed here than in the established Camas neighborhoods. Newer condos and townhomes sit closer to the waterfront redevelopment, while older single-family homes are set further back from the river.",
        "Parking and storage are worth asking about upfront on newer condo product, since it often trades square footage for location — if you're coming from a house with a garage, it helps to see exactly what's included before making an offer.",
      ],
      parks: [
        "Esther Short Park and the waterfront trail toward Wintler Park are within walking distance for many Columbia Way addresses, along with restaurants and shops along the river.",
      ],
      commute: [
        "I-5 access is immediate, and the Portland side of the river is a short bridge crossing away. As with any Portland-Vancouver commute, actual drive times depend heavily on time of day and bridge traffic — worth testing during your normal travel hours.",
      ],
      reasons: [
        "<strong>Walkability:</strong> restaurants, Esther Short Park and the waterfront trail are within reach on foot for many addresses.",
        "<strong>River and downtown proximity:</strong> immediate I-5 access and a short crossing into Portland.",
        "<strong>Housing variety:</strong> a mix of newer condos/townhomes and older single-family homes.",
      ],
      considerations: [
        "<strong>Less outdoor space:</strong> a larger yard or a quiet cul-de-sac isn't really part of the picture here — worth comparing against neighborhoods further from the river if that matters to you.",
        "<strong>Parking and storage:</strong> newer condo product often trades square footage for location, so confirm what's included before making an offer.",
        "<strong>Density:</strong> a more urban feel than neighborhoods like Harney Heights or Lakeshore — an adjustment for some buyers.",
      ],
      closing: [
        "If walkability and river access matter more to you than square footage or yard space, Columbia Way is worth a close look. The best way to know if it fits is to walk the area at different times of day — weekday mornings look different from a Saturday afternoon along the waterfront trail.",
      ],
    },
    {
      hook: "Who's Actually Buying Along the Waterfront",
      keyword: "Columbia Way condos for sale",
      metaDescription:
        "Who's buying condos and townhomes along Columbia Way in Vancouver, WA, and what's selling fastest right now this season.",
      variant: "update",
      intro: [
        "The buyer profile along Columbia Way is pretty consistent, and it's shaping what sells fastest here.",
      ],
      marketNotes: [
        "Portland commuters chasing Washington's tax advantage without giving up walkability make up a large share of activity along this stretch.",
        "Units near the waterfront trail and downtown's restaurant row typically go under contract in two to three weeks — older single-family homes set back from the river take noticeably longer.",
        "A week's hesitation on a new listing here regularly means missing it — this stretch turns over faster than almost anywhere else in this rotation.",
      ],
      closing: [
        "Buyers serious about a downtown-adjacent, low-maintenance option tend to do better with a standing alert than with periodic manual checks.",
      ],
    },
    {
      hook: "Trading a Yard for a Walk to Dinner",
      keyword: "living in Columbia Way Vancouver",
      metaDescription:
        "What you actually give up and gain living in Columbia Way, Vancouver — parking, density and walkability, explained.",
      variant: "considerations",
      intro: [
        "The appeal of Columbia Way is obvious on a walk through it. What's less obvious is everything you're trading to get it.",
      ],
      reasons: [
        "<strong>Walkability:</strong> restaurants, parks and the waterfront trail are reachable on foot for many addresses.",
        "<strong>Housing variety:</strong> newer condos/townhomes alongside older single-family homes gives buyers real options.",
      ],
      considerations: [
        "<strong>Parking and storage:</strong> worth asking about upfront, especially coming from a house with a garage.",
        "<strong>Limited outdoor space:</strong> a larger yard isn't part of the picture here — compare against neighborhoods further from the river if that matters.",
        "<strong>Density:</strong> a more urban feel than neighborhoods like Harney Heights or Lakeshore.",
      ],
      closing: [
        "A weekday morning here feels almost nothing like a Saturday afternoon along the waterfront trail — worth experiencing both before you decide this is the tradeoff you want.",
      ],
    },
  ],
  "Deer Creek, Camas": [
    {
      hook: "Wooded Lots & Quiet Streets on Prune Hill",
      keyword: "Deer Creek Camas homes",
      metaDescription:
        "Moving to Camas, WA? See what Deer Creek is like — wooded lots, quiet streets, schools and current listings on Prune Hill.",
      variant: "guide",
      intro: [
        "Deer Creek sits on the wooded side of the Prune Hill area, a few minutes from Holly Ridge, with noticeably more tree cover and quieter cul-de-sac streets. It doesn't come up in as many searches, which has kept it relatively accessible.",
      ],
      livingIn: [
        "Most homes here date to the same late-1990s-to-2000s building period as the rest of Camas Meadows. That means mature landscaping that new construction can't really replicate, along with lots that give some separation from the neighbors.",
      ],
      whereLocated: [
        "Deer Creek sits on the wooded side of Prune Hill, close to Holly Ridge and a short drive to the Lacamas Creek Trail, with the same SR-14 access into Portland as the rest of the Camas Meadows area.",
      ],
      homesIn: [
        "Housing stock here is similar in age and style to the rest of Camas Meadows — resale rather than new construction, with mature trees and lots that provide more separation from neighbors than newer subdivisions.",
        "Because it's a quieter, less-searched address, it can take a little longer to find directly comparable sales when evaluating a home here.",
      ],
      parks: [
        "The Lacamas Creek Trail is an easy walk or short drive from Deer Creek, giving the neighborhood convenient access to wooded trail recreation without the traffic that comes with a more visible address.",
      ],
      commute: [
        "SR-14 gets you into Portland on the same timeline as the rest of the Camas Meadows area. As with any Portland-area commute, actual drive times depend on time of day, so it's worth testing during the hours you'd actually be driving.",
      ],
      reasons: [
        "<strong>Wooded, quiet setting:</strong> more tree cover and quieter cul-de-sac streets than more visible Camas addresses.",
        "<strong>Lacamas Creek Trail access:</strong> an easy walk or short drive from the neighborhood.",
        "<strong>Established landscaping:</strong> mature trees and lots that give more separation from neighbors.",
      ],
      considerations: [
        "<strong>Resale only:</strong> new construction isn't part of the picture — some homes may need updated kitchens or systems, so a thorough inspection is worth the cost.",
        "<strong>Fewer comparable sales:</strong> because it's a quieter, less-searched address, it can take longer to gauge value when pricing a home here.",
        "<strong>Less visibility:</strong> Deer Creek doesn't come up in as many searches as neighboring Holly Ridge, which can be an advantage or a drawback depending on what you're looking for.",
      ],
      closing: [
        "If wooded and quiet is what you're after, Deer Creek is worth comparing directly against Holly Ridge and the rest of the Camas Meadows area. The best way to get a feel for it is to drive the streets at different times of day — it's a different pace than the busier corridors nearby, and that's easier to sense in person than in photos.",
      ],
    },
    {
      hook: "Why This Neighborhood Sells Faster Than It Should",
      keyword: "Deer Creek Camas listings",
      metaDescription:
        "Why Deer Creek in Camas sells faster than its visibility would suggest, and what's currently drawing buyer interest.",
      variant: "update",
      intro: [
        "Deer Creek doesn't get searched as often as its neighbors, but that hasn't slowed things down once a listing actually appears.",
      ],
      marketNotes: [
        "A well-kept home here tends to go pending within the first weekend — this isn't a neighborhood where buyers window-shop.",
        "Pricing has tracked a step below Holly Ridge for comparable square footage, mostly because Deer Creek lacks direct lake frontage or guaranteed greenspace backing.",
        "Buyers who find this neighborhood usually find it through a referral or a drive-by, not a keyword search — worth knowing if you're trying to gauge real competition.",
      ],
      closing: [
        "A standing alert for this specific neighborhood tends to catch listings that a broader Camas search would miss entirely.",
      ],
    },
    {
      hook: "A Step-Up Address, Not a Starter One",
      keyword: "Deer Creek Camas buyers guide",
      metaDescription:
        "Why Deer Creek functions as a step-up neighborhood in Camas, and what that means for buyers touring here first.",
      variant: "considerations",
      intro: [
        "Deer Creek isn't usually where a Camas search starts — it's more often where it lands after a buyer already knows what they want.",
      ],
      reasons: [
        "<strong>Established landscaping:</strong> homes here tend to be a bit larger and more settled than in Holly Ridge, with mature trees and quieter streets.",
        "<strong>Trail access:</strong> close to the Lacamas Creek Trail without the traffic of a more visible address.",
      ],
      considerations: [
        "<strong>Resale only:</strong> some homes may need updated kitchens or systems — a thorough inspection is worth the cost.",
        "<strong>Fewer comparable sales:</strong> because it's a quieter, less-searched address, it can take longer to gauge value here.",
      ],
      closing: [
        "A drive through at different times of day tells you more about Deer Creek's actual pace than any listing photo will.",
      ],
    },
  ],
  "Harney Heights, Vancouver": [
    {
      hook: "An Established, Quiet Corner of Northeast Vancouver",
      keyword: "Harney Heights Vancouver WA homes",
      metaDescription:
        "Moving to Vancouver, WA? See what Harney Heights is like — established homes, mature trees, commute and current listings.",
      variant: "guide",
      intro: [
        "Harney Heights doesn't get the attention that some of Vancouver's newer subdivisions do. It's an established, quiet pocket of northeast Vancouver with mature trees and settled landscaping, and noticeably less through-traffic than the busier east-county corridors.",
      ],
      livingIn: [
        "Home styles here run older and more varied than the newer east Vancouver developments. That means more character per square foot, but it can also mean more updating — worth factoring into your budget if you're comparing against newer construction.",
      ],
      whereLocated: [
        "Harney Heights sits close enough to the Mill Plain and SR-14 corridor for a reasonable commute, while feeling several steps removed from the retail density around Vancouver Mall.",
      ],
      homesIn: [
        "Housing stock is older and more varied than in the newer east Vancouver developments, with a mix of styles and floor plans rather than a single repeated design. Some properties have been updated, others haven't.",
        "There's generally no formal HOA across much of the neighborhood, which gives more flexibility with a property but also less consistency street to street — worth confirming on a home-by-home basis rather than assuming.",
      ],
      parks: [
        "Harney Heights is more defined by its established, tree-lined streets than by a single destination park — the mature landscaping itself is one of the neighborhood's bigger draws for buyers who want a quieter, settled setting.",
      ],
      commute: [
        "The Mill Plain and SR-14 corridor gives Harney Heights a reasonable commute toward the rest of Vancouver and into Portland. As with any metro-area drive, it's worth testing your actual commute during the hours you'd be traveling.",
      ],
      reasons: [
        "<strong>Established, tree-lined streets:</strong> mature landscaping and noticeably less through-traffic than busier east-county corridors.",
        "<strong>Character and variety:</strong> a mix of older home styles rather than one repeated floor plan.",
        "<strong>Value relative to newer subdivisions:</strong> homes here tend to cost less per square foot than newer construction closer to I-205.",
      ],
      considerations: [
        "<strong>Condition varies:</strong> some properties have been updated, others haven't — worth budgeting for updates if a move-in-ready kitchen matters to you.",
        "<strong>Inconsistent HOA coverage:</strong> generally no formal HOA across much of the neighborhood, which means more flexibility but less consistency street to street.",
        "<strong>Lots and floor plans vary:</strong> more than in a planned development, so it's worth comparing a few different addresses.",
      ],
      closing: [
        "If an established neighborhood with more negotiating room is what you're after, Harney Heights is worth a look. The best way to judge it is to walk a few blocks and see a couple of homes in person — it rewards buyers who take the time to look closely rather than judge from listing photos alone.",
      ],
    },
    {
      hook: "The Value Gap Buyers Keep Finding Here",
      keyword: "Harney Heights Vancouver market update",
      metaDescription:
        "Why buyers keep finding more house for their budget in Harney Heights, Vancouver, and how the market's been moving.",
      variant: "update",
      intro: [
        "Ask a buyer who just toured Harney Heights what surprised them, and it's almost always the same answer: how much more house their budget covered.",
      ],
      marketNotes: [
        "Homes priced in line with recent comparable sales have been going under contract quickly, despite the neighborhood's low listing volume.",
        "That value gap against newer subdivisions closer to I-205 has been the main thing pulling buyers here lately, more than any single feature.",
        "Because so few homes list here in a given month, the buyers who move fastest tend to be the ones already watching closely.",
      ],
      closing: [
        "A heads-up the moment something lists is easy to set up, and in a neighborhood this quiet, it's often the difference between seeing a home and hearing about it after the fact.",
      ],
    },
    {
      hook: "Character Comes With a Few Catches",
      keyword: "Harney Heights Vancouver buyers guide",
      metaDescription:
        "The real catches behind Harney Heights' character and value in Vancouver, WA — HOA structure and condition, explained.",
      variant: "considerations",
      intro: [
        "Harney Heights has real character, and character usually comes with a few catches worth knowing upfront.",
      ],
      reasons: [
        "<strong>Character and mature landscaping:</strong> established trees and varied home styles you won't find in newer subdivisions.",
        "<strong>Relative value:</strong> homes here tend to cost less per square foot than newer construction closer to I-205.",
      ],
      considerations: [
        "<strong>Condition varies:</strong> some properties have been updated, others haven't.",
        "<strong>Inconsistent HOA coverage:</strong> generally no formal HOA across much of the neighborhood — confirm on a home-by-home basis.",
        "<strong>Lots and floor plans vary more than in a planned development.</strong>",
      ],
      closing: [
        "None of that shows up in a listing summary — walking a few blocks and seeing two or three homes in person tells you more than any description can.",
      ],
    },
  ],
  "Pioneer Canyon, Ridgefield": [
    {
      hook: "New Construction Near I-5 and the Wildlife Refuge",
      keyword: "Pioneer Canyon Ridgefield WA",
      metaDescription:
        "Moving to Ridgefield, WA? See what Pioneer Canyon is like — newer construction, location, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Ridgefield, Washington, Pioneer Canyon is one of the newer neighborhoods worth a look — built east of downtown, close to I-5, on the north side of Pioneer Road.",
        "Ridgefield sits in northwest Clark County, and Pioneer Canyon is one of several newer subdivisions that have grown up around it over the last decade or so.",
      ],
      livingIn: [
        "Pioneer Canyon was built mostly between 2009 and 2017, so it's newer construction relative to a lot of the housing stock in this part of Clark County — fewer of the update-and-original-finish tradeoffs that come with an older neighborhood.",
      ],
      whereLocated: [
        "Pioneer Canyon sits east of downtown Ridgefield, north of Pioneer Road, a few minutes from I-5 Exit 14. Ridgefield itself sits in northwest Clark County, generally north of Vancouver along the I-5 corridor.",
      ],
      homesIn: [
        "Homes in Pioneer Canyon were built over roughly an eight-year window, 2009 to 2017 — expect more consistent modern layouts and finishes than in an older, more established neighborhood.",
        "As with any subdivision built out over several years, lot size and floor plan still vary by section, so it's worth comparing more than one address before drawing conclusions.",
      ],
      parks: [
        "Ridgefield National Wildlife Refuge is one of the area's defining features — roughly 5,300 acres between the Columbia River and town, with the River 'S' Unit auto tour, the Kiwa seasonal trail, and the Carty Unit's Oaks to Wetlands Trail open year-round.",
        "The Port of Ridgefield also operates boat launches on Lake River, including a day-use dock and picnic area at the Mill Street launch, part of a longer water trail running from the Lewis River down to Vancouver Lake.",
      ],
      commute: [
        "I-5 Exit 14 sits a few minutes from Pioneer Canyon in either direction. Bridge traffic and time of day both swing actual drive times more than a map suggests — worth a test run before you commit to a commute.",
      ],
      reasons: [
        "<strong>Newer construction:</strong> built mostly 2009–2017, with more consistent modern layouts than older neighborhoods nearby.",
        "<strong>Wildlife refuge access:</strong> close to the Ridgefield National Wildlife Refuge's trails and auto tour.",
        "<strong>I-5 access:</strong> a few minutes from Exit 14.",
      ],
      considerations: [
        "<strong>Still a newer area:</strong> less mature landscaping than an established neighborhood — trees and plantings are still filling in.",
        "<strong>Lot size varies by section:</strong> compare specific addresses within the subdivision rather than assuming uniformity.",
        "<strong>East of downtown:</strong> worth checking your actual routine driving pattern to shops and services in town.",
      ],
      closing: [
        "Newer construction near I-5 is a specific ask, and Pioneer Canyon answers it directly — worth comparing against Ridgefield's other newer subdivisions before deciding.",
      ],
    },
    {
      hook: "Reading the New-Construction Market Here",
      keyword: "Pioneer Canyon Ridgefield new construction",
      metaDescription:
        "A market update on Pioneer Canyon in Ridgefield, WA — demand for newer construction near I-5 and what's been moving lately.",
      variant: "update",
      intro: [
        "New construction near I-5 stays in demand in Ridgefield, and Pioneer Canyon is usually the first place that conversation goes.",
      ],
      marketNotes: [
        "Buyers relocating from more urban parts of Portland or Vancouver tend to search for newer construction first, and Pioneer Canyon fits that directly.",
        "Because the subdivision was built out over several years, inventory spans a real range within the same newer-construction bracket — worth comparing specific build years, not just the neighborhood name.",
        "Proximity to I-5 Exit 14 continues to come up early in conversations with buyers commuting south.",
      ],
      closing: [
        "Given how often this neighborhood comes up in relocation searches, an alert tends to beat checking back manually.",
      ],
    },
    {
      hook: "New Construction, Old Questions",
      keyword: "living in Pioneer Canyon Ridgefield",
      metaDescription:
        "What to weigh before buying in Pioneer Canyon, Ridgefield — home age, lot differences and commute, explained clearly.",
      variant: "considerations",
      intro: [
        "Newer construction solves some problems and introduces a few new questions — Pioneer Canyon is a good example of both sides of that trade.",
      ],
      reasons: [
        "<strong>Newer construction:</strong> more consistent modern layouts than older Ridgefield neighborhoods.",
        "<strong>I-5 access:</strong> a few minutes from Exit 14.",
      ],
      considerations: [
        "<strong>Still maturing:</strong> landscaping and trees are less established than in an older neighborhood.",
        "<strong>East of downtown:</strong> worth checking your actual routine driving pattern to shops and services in town.",
      ],
      closing: [
        "Touring homes in a couple of different sections of the subdivision usually clarifies more about lot orientation and finishes than any single listing can.",
      ],
    },
  ],
  "Battle Ground Meadows, Battle Ground": [
    {
      hook: "An Established Neighborhood Near the Center of Clark County",
      keyword: "Battle Ground Meadows WA",
      metaDescription:
        "Moving to Battle Ground, WA? See what Battle Ground Meadows is like — location, homes, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Battle Ground, Washington, Battle Ground Meadows is one of the larger, more established neighborhoods worth a look.",
        "Battle Ground sits near the geographic center of Clark County, and Battle Ground Meadows is one of several real, named neighborhoods that make up the city.",
      ],
      livingIn: [
        "Battle Ground has a genuinely wide range of neighborhoods, from starter-home subdivisions to acreage estates — Battle Ground Meadows is one of the larger, more established options among them.",
      ],
      whereLocated: [
        "Battle Ground sits near the center of Clark County, where SR-503 running north from Orchards meets SR-502, which connects to I-5.",
      ],
      homesIn: [
        "Housing across Battle Ground's neighborhoods ranges widely — Battle Ground Meadows sits on the more established end of that range, without the newest master-planned amenities of some of the city's newer developments.",
        "As with any established neighborhood, condition and updates vary property to property, so it's worth comparing more than one listing before drawing conclusions.",
      ],
      parks: [
        "Battle Ground Lake State Park is one of the area's signature outdoor features — about 280 acres roughly three miles northeast of the city, built around a volcanic lake, with around 5 miles of hiking trails and another 5 miles for equestrian and bike use, plus camping, swimming and fishing.",
      ],
      commute: [
        "SR-503 and SR-502 connect Battle Ground to I-5, though neither is a straight shot — plan on testing your specific route at the hours you'd actually be driving rather than trusting a single estimate.",
      ],
      reasons: [
        "<strong>Established setting:</strong> one of Battle Ground's larger, more settled neighborhoods.",
        "<strong>Central location:</strong> near the geographic center of Clark County, with SR-503/SR-502 access.",
        "<strong>Battle Ground Lake State Park nearby:</strong> hiking, swimming and equestrian trails a few miles northeast.",
      ],
      considerations: [
        "<strong>Not new construction:</strong> buyers who specifically want the newest finishes may prefer one of Battle Ground's newer master-planned neighborhoods instead.",
        "<strong>Condition varies:</strong> compare specific addresses rather than assuming uniformity across an established neighborhood.",
        "<strong>Commute distance:</strong> worth mapping your actual drive to Vancouver or Portland during normal travel hours.",
      ],
      closing: [
        "Battle Ground has real range, from starter homes to acreage estates, and Battle Ground Meadows sits toward the established, central end of that spectrum — worth seeing in person against the newer options nearby.",
      ],
    },
    {
      hook: "Steady Demand for an Established Address",
      keyword: "Battle Ground Meadows market update",
      metaDescription:
        "A market update on Battle Ground Meadows in Battle Ground, WA — demand and what's been moving in this established neighborhood.",
      variant: "update",
      intro: [
        "Battle Ground has so many named neighborhoods that comparing them can get confusing fast — here's a read on how Battle Ground Meadows specifically has been performing.",
      ],
      marketNotes: [
        "Buyers comparing Battle Ground's many neighborhoods often bring this one up early, given its size and central location.",
        "Because it's an established neighborhood rather than new construction, condition and updates vary more than in a newer subdivision — pricing reflects that property by property.",
        "SR-503/SR-502 access continues to be a frequently asked-about feature for buyers commuting toward Vancouver or I-5.",
      ],
      closing: [
        "This isn't a neighborhood with heavy listing volume, so a standing alert tends to work better than periodic manual searches.",
      ],
    },
    {
      hook: "Established Versus New in Battle Ground",
      keyword: "living in Battle Ground Meadows",
      metaDescription:
        "What to weigh before buying in Battle Ground Meadows — home condition, lot differences and commute, explained clearly.",
      variant: "considerations",
      intro: [
        "Battle Ground gives buyers a genuine choice between established and new construction, and Battle Ground Meadows sits firmly on the established side of that line.",
      ],
      reasons: [
        "<strong>Established setting:</strong> a settled, larger neighborhood rather than a newer, still-developing subdivision.",
        "<strong>Central Clark County location:</strong> SR-503/SR-502 access toward I-5.",
      ],
      considerations: [
        "<strong>Not new construction:</strong> buyers wanting the newest finishes may prefer a newer Battle Ground development.",
        "<strong>Condition varies:</strong> compare specific addresses rather than assuming uniformity.",
      ],
      closing: [
        "Seeing a couple of homes in person, side by side, tends to clarify the condition question faster than reading listing descriptions alone.",
      ],
    },
  ],
  "Stephens Hillside Farm, La Center": [
    {
      hook: "New Construction Near the East Fork Lewis River",
      keyword: "Stephens Hillside Farm La Center WA",
      metaDescription:
        "Moving to La Center, WA? See what Stephens Hillside Farm is like — newer construction, location, schools and commute, plus listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to La Center, Washington, Stephens Hillside Farm is one of the newer neighborhoods worth a look — a development of roughly 85 homesites with its own park, playground and walking trails.",
        "La Center sits along the East Fork Lewis River, less than 20 miles north of Vancouver, surrounded by forest and farmland.",
      ],
      livingIn: [
        "Stephens Hillside Farm is newer construction, built by New Tradition Homes/Generation Homes NW, with a neighborhood park, playground and walking trails built in as part of the development itself.",
      ],
      whereLocated: [
        "La Center sits along the East Fork Lewis River in Clark County, less than 20 miles north of Vancouver. The original townsite along Pacific Highway and La Center Road has older, craftsman-era homes, while newer subdivisions like Stephens Hillside Farm have grown up around it.",
      ],
      homesIn: [
        "Stephens Hillside Farm includes roughly 85 homesites, developed with a neighborhood park, playground and walking trails built in — more amenity-focused than La Center's older, original-townsite housing stock.",
        "As with any newer subdivision, lot size and floor plan vary by section, so it's worth comparing more than one address.",
      ],
      parks: [
        "The East Fork Lewis River runs through the area, with fishing and kayaking access. Paradise Point State Park and Holley Park, which has sports fields and a skate park, are both nearby outdoor options for La Center residents.",
      ],
      commute: [
        "La Center sits along I-5, a short drive north of Vancouver. Like anywhere in this corridor, the numbers on a map rarely match rush hour — worth a real test drive before deciding.",
      ],
      reasons: [
        "<strong>Newer construction:</strong> built with a neighborhood park, playground and walking trails as part of the development.",
        "<strong>River access:</strong> close to the East Fork Lewis River and Paradise Point State Park.",
        "<strong>Small-town setting:</strong> La Center is surrounded by forest and farmland, a different feel from denser Vancouver neighborhoods.",
      ],
      considerations: [
        "<strong>Distance from Vancouver:</strong> La Center is less centrally located than Camas or Vancouver neighborhoods — worth mapping your actual commute.",
        "<strong>Small school district:</strong> La Center School District is standalone and small, with just three schools — worth understanding if district size matters to you.",
        "<strong>Still a newer area:</strong> landscaping and community amenities are still maturing.",
      ],
      closing: [
        "La Center trades big-city convenience for small-town pace and river access — Stephens Hillside Farm is a genuine entry point if that trade appeals to you.",
      ],
    },
    {
      hook: "New Construction in a Small Market",
      keyword: "Stephens Hillside Farm new listings",
      metaDescription:
        "A market update on Stephens Hillside Farm in La Center, WA — demand for newer construction and what's been moving.",
      variant: "update",
      intro: [
        "La Center is a small market, which changes how buyers should think about timing here compared to a larger Vancouver-area search.",
      ],
      marketNotes: [
        "Buyers relocating from denser parts of Clark County often ask about La Center's newer subdivisions first, and Stephens Hillside Farm is usually part of that conversation given its built-in park and trail amenities.",
        "Well-priced new-construction listings tend to get attention quickly, simply because there isn't much competing inventory in a town this size.",
        "The East Fork Lewis River continues to be one of the more frequently asked-about features for buyers considering this neighborhood.",
      ],
      closing: [
        "Given how limited inventory can be in a market this small, it's worth getting an alert running before you start seriously touring.",
      ],
    },
    {
      hook: "Small Town, Real Tradeoffs",
      keyword: "living in La Center WA",
      metaDescription:
        "What to weigh before buying in La Center, WA — commute distance, school district size and small-town tradeoffs.",
      variant: "considerations",
      intro: [
        "Small-town living asks for a few specific tradeoffs, and La Center is a clear example of what those actually look like day to day.",
      ],
      reasons: [
        "<strong>Newer construction with built-in amenities:</strong> neighborhood park, playground and walking trails.",
        "<strong>Small-town character:</strong> surrounded by forest and farmland, a genuinely different feel from Vancouver.",
      ],
      considerations: [
        "<strong>Distance from Vancouver:</strong> less than 20 miles, but a longer commute than Camas or Vancouver neighborhoods — worth mapping your actual drive.",
        "<strong>Small school district:</strong> La Center School District has just three schools — worth understanding if district size matters to you.",
      ],
      closing: [
        "Comparing Stephens Hillside Farm against La Center's older, original-townsite housing stock in person tends to make the small-town-versus-newer-construction question a lot clearer.",
      ],
    },
  ],
  "Northfork Landing, Woodland": [
    {
      hook: "New Construction Near the Lewis River",
      keyword: "Northfork Landing Woodland WA",
      metaDescription:
        "Moving to Woodland, WA? See what Northfork Landing is like — newer construction, river trail access, schools and current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Woodland, Washington, Northfork Landing is one of the newer developments worth a look — a roughly 85-home neighborhood with a public trail leading to the Lewis River.",
        "Woodland sits where the Lewis River meets I-5, about 22 miles north of Vancouver, straddling the Cowlitz and Clark county line.",
      ],
      livingIn: [
        "Woodland is a small, historic town, incorporated in 1906, that's seen new residential growth in recent years. Northfork Landing is part of that newer wave of development.",
      ],
      whereLocated: [
        "Woodland sits at the confluence of the Lewis River and I-5, about 22 miles north of Vancouver. The town itself is mostly in Cowlitz County, though the surrounding school district also serves part of Clark County.",
      ],
      homesIn: [
        "Northfork Landing is a newer, roughly 85-home development with a public trail — about 1,700 feet — leading to the Lewis River, giving direct walkable river access as part of the neighborhood.",
        "As with any newer subdivision, lot size and floor plan vary by section, so it's worth comparing more than one address.",
      ],
      parks: [
        "The Lewis River is the defining outdoor feature near Northfork Landing, with the neighborhood's own public trail providing direct access. Woodland's small-town setting also means less traffic and a quieter overall pace than denser Vancouver-area neighborhoods.",
      ],
      commute: [
        "I-5 runs straight through Woodland, connecting south to Vancouver and Portland and north to Longview and Kelso. Traffic patterns shift enough by time of day that a test drive beats trusting an estimate.",
      ],
      reasons: [
        "<strong>Newer construction:</strong> a planned development with its own public trail to the Lewis River.",
        "<strong>River access:</strong> direct walkable access to the Lewis River via the neighborhood's trail.",
        "<strong>Small-town, historic setting:</strong> Woodland was incorporated in 1906, with a well-regarded school district.",
      ],
      considerations: [
        "<strong>Distance from Vancouver:</strong> about 22 miles, a longer commute than Camas or Vancouver neighborhoods — worth mapping your actual drive.",
        "<strong>County line location:</strong> Woodland straddles Cowlitz and Clark counties, worth understanding for anything tied to county services.",
        "<strong>Still a newer area:</strong> landscaping and community amenities are still maturing.",
      ],
      closing: [
        "A neighborhood with its own trail to the Lewis River is a specific kind of draw — Northfork Landing is worth seeing in person if river access is genuinely on your list.",
      ],
    },
    {
      hook: "New Construction Along the Lewis River",
      keyword: "Northfork Landing new listings",
      metaDescription:
        "A market update on Northfork Landing in Woodland, WA — demand for newer construction near the Lewis River right now.",
      variant: "update",
      intro: [
        "Woodland's small size means new-construction inventory here behaves differently than it would in a bigger Vancouver-area market.",
      ],
      marketNotes: [
        "Buyers relocating from denser parts of Clark County or from Portland often ask about Woodland's newer developments first, and Northfork Landing is usually part of that conversation given its river-trail access.",
        "Well-priced new-construction listings tend to get attention quickly, simply because there isn't much competing inventory in a market this size.",
        "A second nearby development, sometimes referenced as Woodland Creek, has also drawn interest from buyers comparing newer-construction options in the same area.",
      ],
      closing: [
        "Given how limited inventory can be in a market this small, it's worth getting an alert running before you start seriously touring.",
      ],
    },
    {
      hook: "What County-Line Living Involves",
      keyword: "living in Woodland WA",
      metaDescription:
        "What to weigh before buying in Woodland, WA — commute distance, county-line location and small-town tradeoffs.",
      variant: "considerations",
      intro: [
        "Sitting on a county line changes a few practical things about living somewhere, and Woodland is a real example of what that involves.",
      ],
      reasons: [
        "<strong>River-trail access:</strong> a public trail leads directly to the Lewis River from the neighborhood.",
        "<strong>Small-town, historic character:</strong> Woodland was incorporated in 1906, with a well-regarded school district.",
      ],
      considerations: [
        "<strong>Commute distance:</strong> about 22 miles from Vancouver — worth mapping your actual drive during normal travel hours.",
        "<strong>County-line location:</strong> Woodland straddles Cowlitz and Clark counties, worth understanding for anything tied to county services.",
      ],
      closing: [
        "Seeing the neighborhood's river trail in person tends to answer the river-access question faster than any listing description can.",
      ],
    },
  ],
  "Washougal, Washougal": [
    {
      hook: "Columbia River Access East of Camas",
      keyword: "Washougal WA homes",
      metaDescription:
        "Moving to Washougal, WA? See what living here is like — river access, parks, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Washougal, Washington, it's worth knowing this is a Columbia River town just east of Camas, with its own waterfront parks and a genuine mix of housing options.",
        "Washougal sits on the north bank of the Columbia River in the southeast corner of Clark County, about 18 miles east of Vancouver.",
      ],
      livingIn: [
        "Washougal doesn't have one single dominant named neighborhood the way Camas has Holly Ridge — instead there's a real mix of subdivisions, including Columbia View and Crown Pointe, plus the broader Washougal River area, spread across a town with a genuine range of housing ages and styles.",
      ],
      whereLocated: [
        "Washougal sits east of Camas on the north bank of the Columbia River, in the southeast corner of Clark County. SR-14 runs through as a four-lane freeway connecting Washougal to Camas and, further west, to I-205.",
      ],
      homesIn: [
        "Housing in Washougal ranges from manufactured homes and condos up to custom homes with river or hillside views — a genuinely wide mix rather than one uniform housing type. Many subdivisions have been built within the last decade alongside older, established stock.",
      ],
      parks: [
        "The City of Washougal operates 14 parks totaling more than 120 acres. Washougal Waterfront Park connects to the Columbia River Dike Trail and the Lewis and Clark Heritage Trail, running from Steamboat Landing Park out toward the Steigerwald Lake National Wildlife Refuge. The Washougal River Greenway Trail, a roughly 2.2-mile trail, is also closely associated with the area.",
      ],
      commute: [
        "SR-14 connects Washougal to Camas and on to Vancouver and I-205. Commute times here swing with time of day like anywhere in the metro — test the route yourself before counting on a number.",
      ],
      reasons: [
        "<strong>Columbia River access:</strong> Washougal Waterfront Park and the Dike Trail connect directly to the river.",
        "<strong>Housing variety:</strong> from manufactured homes and condos to custom hillside and river-view homes.",
        "<strong>SR-14 access:</strong> direct connection to Camas and on toward Vancouver.",
      ],
      considerations: [
        "<strong>No single defining neighborhood:</strong> unlike Camas, Washougal doesn't have one well-known named area — worth comparing specific subdivisions or streets rather than the town as a whole.",
        "<strong>Wide price and style range:</strong> the mix of housing types means more variation address to address than in a single planned subdivision.",
        "<strong>Commute:</strong> a bit farther east than Camas, worth mapping your actual drive time.",
      ],
      closing: [
        "Washougal doesn't offer one tidy answer the way a single named neighborhood does — it rewards buyers willing to compare a few specific streets or subdivisions directly.",
      ],
    },
    {
      hook: "A Market With No Single Center of Gravity",
      keyword: "Washougal WA market update",
      metaDescription:
        "A market update on Washougal, WA — current demand across its wide range of housing types near the Columbia River.",
      variant: "update",
      intro: [
        "Washougal's genuinely wide housing mix means different parts of the market move at different paces, which makes a single market summary less useful here than elsewhere.",
      ],
      marketNotes: [
        "Buyers looking for river or hillside views tend to focus on the custom-home end of the market, while manufactured-home and condo buyers are watching a different, more affordable segment entirely.",
        "Newer subdivisions like Columbia View and Crown Pointe have drawn steady interest from buyers who want more consistent modern construction.",
        "Because Washougal doesn't have one dominant named neighborhood, buyers often compare specific streets or subdivisions directly rather than the town as a single market.",
      ],
      closing: [
        "An alert across a few different subdivisions tends to serve Washougal buyers better than watching just one.",
      ],
    },
    {
      hook: "One Town, Several Different Markets",
      keyword: "living in Washougal WA",
      metaDescription:
        "What to weigh before buying in Washougal, WA — housing variety, commute and river access, explained clearly and honestly.",
      variant: "considerations",
      intro: [
        "Washougal functions less like one market and more like several smaller ones stitched together — worth understanding before you start touring.",
      ],
      reasons: [
        "<strong>River access:</strong> Washougal Waterfront Park and the Dike Trail connect directly to the Columbia River.",
        "<strong>Housing variety:</strong> a genuinely wide range of home types and price points across the town.",
      ],
      considerations: [
        "<strong>No single defining neighborhood:</strong> worth comparing specific subdivisions or streets rather than the town as a whole.",
        "<strong>Commute:</strong> east of Camas, worth mapping your actual drive time toward Vancouver or Portland.",
      ],
      closing: [
        "Touring a few different subdivisions in the same visit tends to show the housing variety here more clearly than reading listings alone.",
      ],
    },
  ],
  "Hockinson, Hockinson": [
    {
      hook: "Rural-Residential Acreage Northeast of Vancouver",
      keyword: "Hockinson WA homes",
      metaDescription:
        "Moving to the Hockinson, WA area? See what living here is like — acreage, parks, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to the Hockinson area of Clark County, it's worth knowing this is a rural-residential community about 14 miles northeast of downtown Vancouver — acreage properties, horse ranches and hillside lots rather than a dense subdivision.",
        "Hockinson doesn't have a distinct named sub-neighborhood the way Camas does — the area itself functions as its own community.",
      ],
      livingIn: [
        "Hockinson has a genuinely rural-residential character: acreage properties, horse ranches and hillside lots are common, a different feel from the denser subdivisions in Camas or Vancouver.",
      ],
      whereLocated: [
        "Hockinson sits about 14 miles northeast of downtown Vancouver, bordering Venersborg to the north, Battle Ground to the northwest, Brush Prairie to the west, and Orchards to the southwest.",
      ],
      homesIn: [
        "Housing here leans toward larger lots and acreage rather than standard subdivision parcels — horse property and hillside lots are part of the area's character, not the exception.",
      ],
      parks: [
        "NE 182nd Avenue is a key local corridor, leading to what's locally known as the 'Blueberry Corridor' — a mix of residential and agricultural land including several berry farms. Battle Ground Lake State Park, with its hiking trails and swimming lake, is just minutes away.",
      ],
      commute: [
        "There's no direct freeway through Hockinson itself — getting to I-5 or I-205 means routing through Battle Ground or Orchards first, and that add-on varies by time of day.",
      ],
      reasons: [
        "<strong>Rural-residential character:</strong> acreage, horse property and hillside lots rather than a dense subdivision.",
        "<strong>Own school district:</strong> Hockinson School District is a standalone district with its own identity.",
        "<strong>Battle Ground Lake State Park nearby:</strong> hiking and swimming just minutes away.",
      ],
      considerations: [
        "<strong>No freeway access directly in the area:</strong> reaching I-5 or I-205 means driving through Battle Ground or Orchards first.",
        "<strong>Larger lots mean more maintenance:</strong> acreage properties come with different upkeep than a standard subdivision lot.",
        "<strong>Limited inventory:</strong> as a smaller rural-residential area, Hockinson doesn't have a high volume of listings in a typical month.",
      ],
      closing: [
        "Acreage this close to Vancouver doesn't come along often — Hockinson is worth serious consideration if land and quiet are non-negotiable for you.",
      ],
    },
    {
      hook: "Why Acreage Here Doesn't Sit Long",
      keyword: "Hockinson WA market update",
      metaDescription:
        "A market update on the Hockinson, WA area — demand for acreage and rural-residential properties right now near Vancouver.",
      variant: "update",
      intro: [
        "Genuine acreage close to Vancouver is rare enough that it behaves like its own micro-market — here's what that's looked like in Hockinson lately.",
      ],
      marketNotes: [
        "Horse property and hillside lots with real acreage tend to draw serious buyers rather than lookers, given how limited that type of inventory is across Clark County overall.",
        "Buyers relocating from denser parts of Vancouver or Portland are often surprised by how much land their budget covers here compared to a standard subdivision lot.",
        "Because Hockinson doesn't generate high listing volume, the buyers who move fastest tend to be the ones already watching closely.",
      ],
      closing: [
        "Acreage listings here don't sit long enough to check back manually — a standing alert works better.",
      ],
    },
    {
      hook: "What Rural Living Actually Costs You",
      keyword: "living in Hockinson WA",
      metaDescription:
        "What to weigh before buying in the Hockinson, WA area — commute, acreage upkeep and rural tradeoffs, explained.",
      variant: "considerations",
      intro: [
        "Rural acreage sounds appealing in the abstract — the actual tradeoffs are worth understanding before you commit to touring Hockinson properties.",
      ],
      reasons: [
        "<strong>Genuine acreage and rural character:</strong> horse property and hillside lots are common, not the exception.",
        "<strong>Battle Ground Lake State Park nearby:</strong> hiking and swimming minutes away.",
      ],
      considerations: [
        "<strong>No direct freeway access:</strong> reaching I-5 or I-205 means driving through Battle Ground or Orchards first.",
        "<strong>Larger lots mean more maintenance:</strong> acreage upkeep is a real, different commitment than a standard subdivision lot.",
      ],
      closing: [
        "A couple of property tours, including the actual drive back toward Vancouver, tends to answer the rural-versus-convenient question better than any description.",
      ],
    },
  ],
  "Amboy, Amboy": [
    {
      hook: "Rural Acreage in Northern Clark County",
      keyword: "Amboy WA homes",
      metaDescription:
        "Moving to the Amboy, WA area? See what living here is like — rural acreage, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to the Amboy area, it's worth knowing this is a small, unincorporated rural community in northern Clark County, about 30 miles northeast of Vancouver.",
        "Amboy doesn't have a distinct named sub-neighborhood — the community itself, at the confluence of Chelatchie Creek and Cedar Creek, functions as its own area.",
      ],
      livingIn: [
        "Amboy has a genuinely rural, acreage-driven character — larger parcels than you'll typically find even in Battle Ground or Hockinson, with a quieter, more remote feel overall.",
      ],
      whereLocated: [
        "Amboy sits in northern Clark County at the confluence of Chelatchie Creek and Cedar Creek, a tributary of the Lewis River, roughly 30 miles northeast of Vancouver.",
      ],
      homesIn: [
        "Housing here leans heavily toward larger acreage parcels rather than standard subdivision lots — this is one of the more rural, spread-out areas in Jamie's service area.",
      ],
      parks: [
        "Moulton Falls Regional Park, with its waterfalls and trails, sits in the broader Yacolt/Amboy area — it's technically addressed in Yacolt, so it's more accurately described as nearby rather than directly in Amboy, but it's a real regional draw for people in this part of the county.",
      ],
      commute: [
        "County roads are the primary access here, and the drive to I-5 or I-205 takes real time regardless of route. Test it at the hours you'd actually be driving before deciding how much distance you can live with.",
      ],
      reasons: [
        "<strong>Genuine rural acreage:</strong> larger parcels than Battle Ground or Hockinson, with real distance from neighbors.",
        "<strong>Quiet, remote setting:</strong> a meaningfully different pace than anywhere closer to Vancouver.",
        "<strong>Moulton Falls area nearby:</strong> waterfalls and trails in the broader Yacolt/Amboy area.",
      ],
      considerations: [
        "<strong>Long commute:</strong> roughly 30 miles from Vancouver via county roads — a real consideration if you commute daily.",
        "<strong>Limited inventory:</strong> as a small rural community, Amboy doesn't have a high volume of listings in a typical month.",
        "<strong>Fewer nearby services:</strong> shopping and amenities mean a drive into Battle Ground or further.",
      ],
      closing: [
        "Amboy isn't for every buyer, and that's kind of the point — it's for buyers who've already decided proximity matters less than space and quiet.",
      ],
    },
    {
      hook: "A Small, Slow-Moving Rural Market",
      keyword: "Amboy WA market update",
      metaDescription:
        "A market update on the Amboy, WA area — demand for rural acreage and what's been moving right now in northern Clark County.",
      variant: "update",
      intro: [
        "Amboy's rural acreage market runs on its own schedule, nothing like a typical suburban subdivision.",
      ],
      marketNotes: [
        "Because Amboy is a small, rural market, inventory doesn't turn over often — when a well-kept acreage property does list, it tends to draw serious, prepared buyers.",
        "Buyers relocating from denser parts of Clark County or Portland are often surprised by how much land their budget covers this far out from Vancouver.",
        "Amboy Middle School, part of the Battle Ground Public Schools district, is physically located in Amboy — a useful local landmark for orienting a search.",
      ],
      closing: [
        "Given how infrequently rural acreage listings come up here, it's worth having an alert running well before you're ready to buy.",
      ],
    },
    {
      hook: "The Real Cost of Distance",
      keyword: "living in Amboy WA",
      metaDescription:
        "What to weigh before buying in the Amboy, WA area — commute distance, rural tradeoffs and services, explained.",
      variant: "considerations",
      intro: [
        "Distance is the real currency in Amboy — it buys space and quiet, and it costs time and convenience. Worth being honest about that trade upfront.",
      ],
      reasons: [
        "<strong>Genuine rural acreage:</strong> larger parcels and more distance from neighbors than anywhere closer to Vancouver.",
        "<strong>Quiet, remote setting:</strong> a real change of pace from suburban Clark County.",
      ],
      considerations: [
        "<strong>Long commute:</strong> roughly 30 miles from Vancouver — a real daily consideration.",
        "<strong>Fewer nearby services:</strong> shopping and amenities mean a drive into Battle Ground or further.",
      ],
      closing: [
        "Spending real time in the area at different points in the day, not just a single tour, tends to give the clearest read on whether the distance actually works for you.",
      ],
    },
  ],
  "Brush Prairie, Brush Prairie": [
    {
      hook: "Rural-Residential Living Between Battle Ground and Vancouver",
      keyword: "Brush Prairie WA homes",
      metaDescription:
        "Moving to the Brush Prairie, WA area? See what living here is like — rural-residential character, schools and current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to the Brush Prairie area, it's worth knowing this is an unincorporated Clark County community with a genuinely rural-residential character, sitting between Battle Ground and Vancouver.",
        "Brush Prairie doesn't have a distinct named sub-neighborhood — the community itself functions as its own area, similar to Hockinson and Amboy.",
      ],
      livingIn: [
        "Brush Prairie has a mix of hobby farms, equestrian properties, and newer custom-built homes alongside more established rural properties — a real range rather than one uniform housing type.",
      ],
      whereLocated: [
        "Brush Prairie sits in the rolling foothills of northeast Clark County, about 12 miles north of Vancouver. NE 117th Avenue, also SR-503, is the main route through the area, connecting to I-205 via the Padden Parkway exit.",
      ],
      homesIn: [
        "Housing in Brush Prairie ranges from hobby farms and equestrian properties to newer custom-built homes — a genuine mix rather than a single planned subdivision.",
      ],
      parks: [
        "Brush Prairie's 'Lucky' Dog Park, also known as Lucky Memorial Park, offers about 4.5 acres of open fields, a real local amenity for the area.",
      ],
      commute: [
        "NE 117th Avenue/SR-503 connects to I-205 via the Padden Parkway exit. As with any Clark County commute, the actual time depends more on when you leave than on the mileage.",
      ],
      reasons: [
        "<strong>Rural-residential mix:</strong> hobby farms, equestrian properties and newer custom homes side by side.",
        "<strong>SR-503/I-205 access:</strong> a reasonably direct route toward Vancouver and Portland via the Padden Parkway exit.",
        "<strong>Between Battle Ground and Vancouver:</strong> a middle-ground location for buyers weighing both.",
      ],
      considerations: [
        "<strong>School district varies by address:</strong> Brush Prairie is served by more than one district depending on the exact property — worth verifying directly rather than assuming.",
        "<strong>No single defining neighborhood:</strong> worth comparing specific properties or roads rather than the area as a whole.",
        "<strong>Rural upkeep:</strong> hobby farms and equestrian properties come with different maintenance needs than a standard subdivision lot.",
      ],
      closing: [
        "Brush Prairie splits the difference between Battle Ground and Vancouver in a way few areas do — worth a look if you want rural character without giving up reasonable access to both.",
      ],
    },
    {
      hook: "Hobby Farms and Acreage in Demand",
      keyword: "Brush Prairie WA market update",
      metaDescription:
        "A market update on the Brush Prairie, WA area — demand for hobby farms and rural-residential properties right now.",
      variant: "update",
      intro: [
        "Hobby farms and equestrian properties don't come up for sale often anywhere in Clark County, and Brush Prairie is one of the more consistent places to find them.",
      ],
      marketNotes: [
        "Buyers looking for horse property or acreage within a reasonable drive of Vancouver often land on Brush Prairie given its SR-503/I-205 access.",
        "Because the area has a genuine mix of property types, pricing varies more than in a standard subdivision — comparable sales can be harder to pin down.",
        "Newer custom-built homes alongside more established rural properties means real variation in condition and age address to address.",
      ],
      closing: [
        "This type of inventory is both varied and limited, which makes a standing alert more useful here than a one-time search.",
      ],
    },
    {
      hook: "Between Two Markets",
      keyword: "living in Brush Prairie WA",
      metaDescription:
        "What to weigh before buying in the Brush Prairie, WA area — school district, land use and commute, explained clearly.",
      variant: "considerations",
      intro: [
        "Sitting between Battle Ground and Vancouver means Brush Prairie doesn't fit neatly into either market — worth understanding what that actually means before you buy.",
      ],
      reasons: [
        "<strong>Rural-residential mix:</strong> hobby farms, equestrian properties and newer custom homes.",
        "<strong>SR-503/I-205 access:</strong> a reasonably direct route toward Vancouver and Portland.",
      ],
      considerations: [
        "<strong>School district varies by address:</strong> worth verifying directly rather than assuming one district applies.",
        "<strong>Rural upkeep:</strong> hobby farms and equestrian properties come with different maintenance needs.",
      ],
      closing: [
        "Touring a couple of properties tends to make the rural-residential mix here click faster than reading about it does.",
      ],
    },
  ],
  "Cascade Park, Vancouver": [
    {
      hook: "Established East Vancouver Living Near Mill Plain",
      keyword: "Cascade Park Vancouver WA homes",
      metaDescription:
        "Moving to Vancouver, WA? See what Cascade Park is like — location, parks, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Vancouver, Washington, Cascade Park is an established east-side neighborhood worth a look — bounded roughly by Mill Plain Boulevard to the north, the Columbia River to the south, and I-205 to the west.",
        "Cascade Park differs from some of Vancouver's other neighborhoods in this rotation, like Columbia Way, in one key way: it's in the Evergreen Public Schools district rather than Vancouver Public Schools.",
      ],
      livingIn: [
        "Cascade Park is an established east Vancouver neighborhood with a genuine mix of single-family homes and townhomes, several small neighborhood parks, and a commercial corridor along Mill Plain Boulevard.",
      ],
      whereLocated: [
        "Cascade Park sits south of Mill Plain Boulevard to the Columbia River, east of I-205 and west of SE 164th Avenue — placing it between the more central parts of Vancouver and the Fisher's Landing area further east.",
      ],
      homesIn: [
        "Housing in Cascade Park is a mix of single-family homes and townhomes. As with any established neighborhood, condition and updates vary property to property, so it's worth comparing more than one listing.",
      ],
      parks: [
        "Cascade Park itself is a roughly 3-acre neighborhood park with a shaded playground and walking paths, adjacent to Crestline Elementary. Biddlewood Park and Homestead Neighborhood Park on SE 160th Avenue are also nearby, both with walking paths and playgrounds.",
      ],
      commute: [
        "I-205 runs along the neighborhood's western edge, with Mill Plain Boulevard providing an east-west route. Rush hour changes the math here more than the map does — worth checking your specific route and time.",
      ],
      reasons: [
        "<strong>Established setting:</strong> a mix of single-family homes and townhomes with several small neighborhood parks.",
        "<strong>I-205 access:</strong> runs along the western edge of the neighborhood.",
        "<strong>Columbia Square shopping nearby:</strong> a commercial center along Mill Plain Boulevard.",
      ],
      considerations: [
        "<strong>Different school district than central Vancouver:</strong> Cascade Park is in Evergreen Public Schools, not Vancouver Public Schools — worth confirming directly if you're comparing east and central Vancouver neighborhoods.",
        "<strong>Condition varies:</strong> compare specific addresses rather than assuming uniformity across an established neighborhood.",
        "<strong>Denser than some neighborhoods:</strong> a mix of townhomes alongside single-family homes means less uniform lot sizes.",
      ],
      closing: [
        "Cascade Park delivers established, east Vancouver living without Columbia Way's density — worth comparing the two directly if waterfront walkability isn't a dealbreaker for you.",
      ],
    },
    {
      hook: "Steady East Vancouver Demand",
      keyword: "Cascade Park Vancouver market update",
      metaDescription:
        "A market update on Cascade Park in Vancouver, WA — demand for this established east-side neighborhood right now.",
      variant: "update",
      intro: [
        "East Vancouver has several established neighborhoods worth comparing, and Cascade Park consistently holds its own in that conversation.",
      ],
      marketNotes: [
        "Buyers comparing east Vancouver neighborhoods often bring up Cascade Park early, given its I-205 access and mix of home types.",
        "Because it's an established neighborhood with a mix of single-family and townhome product, pricing and condition vary more than in a single planned subdivision.",
        "Proximity to Columbia Square and the broader Mill Plain Boulevard corridor continues to be a frequently asked-about feature.",
      ],
      closing: [
        "Given how often this comes up in east Vancouver comparisons, it's worth setting up a dedicated search rather than folding it into a broader one.",
      ],
    },
    {
      hook: "East Side, Different District",
      keyword: "living in Cascade Park Vancouver",
      metaDescription:
        "What to weigh before buying in Cascade Park, Vancouver — school district, home type and commute, explained clearly.",
      variant: "considerations",
      intro: [
        "The biggest surprise for buyers new to Cascade Park usually isn't the homes — it's learning the school district differs from central Vancouver.",
      ],
      reasons: [
        "<strong>I-205 access:</strong> runs along the western edge of the neighborhood.",
        "<strong>Mix of home types:</strong> single-family homes and townhomes give buyers real options.",
      ],
      considerations: [
        "<strong>Evergreen Public Schools, not Vancouver Public Schools:</strong> worth confirming directly if district matters to your decision.",
        "<strong>Condition varies:</strong> compare specific addresses rather than assuming uniformity.",
      ],
      closing: [
        "A couple of home tours, paired with a direct call to the district about your specific address, covers both the big questions at once.",
      ],
    },
  ],
  "Fisher's Landing, Vancouver": [
    {
      hook: "Established 1990s Neighborhoods Near SE 164th",
      keyword: "Fishers Landing Vancouver WA homes",
      metaDescription:
        "Moving to Vancouver, WA? See what Fisher's Landing is like — homes, shopping, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Vancouver, Washington, Fisher's Landing is an established east-side area worth a look — actually a cluster of three related neighborhoods, Fisher's Creek, Fisher's Landing East, and Village at Fisher's Landing, that grew up together in the 1990s.",
        "Like Cascade Park, Fisher's Landing is in the Evergreen Public Schools district rather than Vancouver Public Schools.",
      ],
      livingIn: [
        "Fisher's Landing's homes are largely single-level Craftsman-style and two-level homes built in the 1990s, many within active HOA communities.",
      ],
      whereLocated: [
        "Fisher's Landing sits along the SE 164th Avenue corridor in east Vancouver, home to the Fisher's Landing Marketplace shopping center and further retail access up toward Fred Meyer to the north.",
      ],
      homesIn: [
        "Housing here is predominantly single-level Craftsman-style and two-level homes from the 1990s development boom, when a reduced minimum-lot-size rule spurred a wave of subdivision growth in this part of Vancouver. Active HOAs are common across the three related neighborhoods.",
      ],
      parks: [
        "Heritage Park has a circular walking path and playground, and Clearmeadows Park features pollinator-themed play structures. Fisher's Landing East alone has roughly six parks — a genuinely well-parked area for east Vancouver.",
      ],
      commute: [
        "SE 164th Avenue connects to SR-14 and the rest of east Vancouver. Like anywhere near the interchanges, actual travel time swings by hour — a test drive beats an estimate.",
      ],
      reasons: [
        "<strong>Established 1990s neighborhoods:</strong> a genuine cluster of related communities with consistent Craftsman-style architecture.",
        "<strong>Well-parked:</strong> roughly six parks in Fisher's Landing East alone, plus Heritage Park and Clearmeadows Park.",
        "<strong>Shopping and retail access:</strong> Fisher's Landing Marketplace and Fred Meyer along SE 164th Avenue.",
      ],
      considerations: [
        "<strong>Different school district than central Vancouver:</strong> Fisher's Landing is in Evergreen Public Schools, not Vancouver Public Schools — worth confirming directly.",
        "<strong>Active HOAs:</strong> common across the neighborhood cluster — worth reviewing covenants and dues before you're under contract.",
        "<strong>Consistent architecture:</strong> if you want more variety in home style, some of Vancouver's older, more established neighborhoods may offer more range.",
      ],
      closing: [
        "Between the parks and the shopping access, Fisher's Landing covers a lot of ground for buyers who want established 1990s construction without going downtown.",
      ],
    },
    {
      hook: "A Well-Parked Corridor Keeps Drawing Interest",
      keyword: "Fishers Landing Vancouver market update",
      metaDescription:
        "A market update on Fisher's Landing in Vancouver, WA — demand for this established east-side neighborhood right now.",
      variant: "update",
      intro: [
        "Buyers weighing east Vancouver options usually put Fisher's Landing on the shortlist for one specific reason: the parks.",
      ],
      marketNotes: [
        "Buyers comparing east Vancouver neighborhoods often ask about Fisher's Landing specifically for its park access — six parks in Fisher's Landing East alone is a real draw.",
        "Because the area is largely built out from the 1990s, inventory here is mostly resale rather than new construction — well-priced listings in active HOA communities tend to move at a steady pace.",
        "Proximity to Fisher's Landing Marketplace and the broader SE 164th Avenue retail corridor continues to be a frequently asked-about feature.",
      ],
      closing: [
        "Given the steady pace here, checking in periodically works reasonably well, though an alert still catches things faster.",
      ],
    },
    {
      hook: "HOA Living, East Vancouver Style",
      keyword: "living in Fishers Landing Vancouver",
      metaDescription:
        "What to weigh before buying in Fisher's Landing, Vancouver — HOA structure, school district and commute, explained.",
      variant: "considerations",
      intro: [
        "Active HOAs shape daily life here more than in most other neighborhoods in this rotation — worth understanding what that actually involves.",
      ],
      reasons: [
        "<strong>Genuine park access:</strong> roughly six parks in Fisher's Landing East alone.",
        "<strong>Shopping and retail nearby:</strong> Fisher's Landing Marketplace and Fred Meyer along SE 164th Avenue.",
      ],
      considerations: [
        "<strong>Active HOAs:</strong> common across the neighborhood cluster — review covenants and dues before you're under contract.",
        "<strong>Evergreen Public Schools, not Vancouver Public Schools:</strong> worth confirming directly if district matters to your decision.",
      ],
      closing: [
        "Reading a couple of HOA covenant packets alongside touring homes tends to save real headaches down the line.",
      ],
    },
  ],
  "Downtown Vancouver, Vancouver": [
    {
      hook: "Walkable Urban-Core Living Near Esther Short Park",
      keyword: "Downtown Vancouver WA condos",
      metaDescription:
        "Moving to Vancouver, WA? See what Downtown Vancouver is like — condo living, Esther Short Park, waterfront access and listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Vancouver, Washington, and want a genuinely walkable, urban-core setting, Downtown Vancouver, centered on Esther Short Park and the waterfront, is worth a look.",
        "This is a different setting than Columbia Way, another waterfront-adjacent neighborhood in this rotation — Downtown Vancouver is centered on the historic civic core and skews heavily toward condo living, while Columbia Way reads more like a residential stretch.",
      ],
      livingIn: [
        "Downtown Vancouver is Vancouver's most walkable, urban-core neighborhood — condos make up the large majority of housing here, with only a small share of detached single-family homes.",
      ],
      whereLocated: [
        "Downtown Vancouver centers on Esther Short Park, the oldest public park in the Pacific Northwest, dating to 1853, with immediate I-5 access and a short bridge crossing to Portland.",
      ],
      homesIn: [
        "Housing here is predominantly condos, a genuinely different housing type than most other neighborhoods in this rotation. Detached single-family homes make up only a small share of what's available downtown.",
      ],
      parks: [
        "Esther Short Park is the anchor — 5 acres, the oldest public park in the Pacific Northwest, and a hub for the year-round farmers market and community events. The Waterfront district, a major redevelopment project south of Esther Short, has added significant new retail and open space along the Columbia River.",
      ],
      commute: [
        "I-5 access is immediate from downtown, with a short bridge crossing to Portland. Bridge traffic in particular can turn a quick trip into a long one — worth checking at the hours you'd actually cross.",
      ],
      reasons: [
        "<strong>Walkability:</strong> Esther Short Park, the farmers market, and the Waterfront district's retail are all reachable on foot.",
        "<strong>Immediate I-5 access:</strong> a short bridge crossing to Portland.",
        "<strong>Urban-core character:</strong> public art, breweries, and a genuinely different pace than Vancouver's residential neighborhoods.",
      ],
      considerations: [
        "<strong>Condo-dominant:</strong> buyers specifically wanting a detached single-family home have far fewer options downtown than elsewhere in Vancouver.",
        "<strong>Limited outdoor space:</strong> a yard or garage isn't part of the picture for most downtown condos.",
        "<strong>Density:</strong> a genuinely more urban feel than any other neighborhood in this rotation — an adjustment for some buyers, the whole appeal for others.",
      ],
      closing: [
        "Urban-core living isn't for every buyer, but for the ones who want it, Downtown Vancouver delivers it more completely than anywhere else in this rotation.",
      ],
    },
    {
      hook: "Condo Demand Tracks the Waterfront Buildout",
      keyword: "Downtown Vancouver condo market",
      metaDescription:
        "A market update on Downtown Vancouver, WA — condo demand near Esther Short Park and the Waterfront district right now.",
      variant: "update",
      intro: [
        "The ongoing Waterfront district redevelopment continues to shape condo demand downtown in a pretty direct way.",
      ],
      marketNotes: [
        "Buyers who work in Portland but want Washington's tax advantage without giving up a walkable, urban setting continue to be a steady source of demand downtown.",
        "Units closest to Esther Short Park and the Waterfront district's retail tend to draw the most interest, given the walkability to the farmers market, restaurants and breweries.",
        "Because condos make up the large majority of what's available, buyers specifically wanting a detached single-family home should expect a much smaller pool of options downtown than elsewhere in Vancouver.",
      ],
      closing: [
        "With the Waterfront district still actively developing, this is a market worth watching closely rather than checking in on occasionally.",
      ],
    },
    {
      hook: "What Condo Living Downtown Actually Involves",
      keyword: "living in Downtown Vancouver WA",
      metaDescription:
        "What daily life in Downtown Vancouver actually involves, from condo living to walkability, before you make an offer.",
      variant: "considerations",
      intro: [
        "Downtown Vancouver's walkability is a real draw, but it's worth understanding what daily life here actually involves before you make an offer.",
      ],
      reasons: [
        "<strong>Walkability:</strong> Esther Short Park, the farmers market and Waterfront district retail are all reachable on foot.",
        "<strong>Urban-core character:</strong> public art, breweries and a genuinely different pace than Vancouver's residential neighborhoods.",
      ],
      considerations: [
        "<strong>Condo-dominant:</strong> detached single-family homes are a small share of what's available.",
        "<strong>Limited outdoor space:</strong> a yard or garage isn't part of the picture for most downtown condos.",
      ],
      closing: [
        "A weekday morning near Esther Short Park looks almost nothing like a Saturday during the farmers market — worth experiencing both before you decide.",
      ],
    },
  ],
  "Salmon Creek, Vancouver": [
    {
      hook: "Suburban Living at the I-5/I-205 Interchange",
      keyword: "Salmon Creek Vancouver WA homes",
      metaDescription:
        "Moving to Vancouver, WA? See what Salmon Creek is like — location, parks, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Vancouver, Washington, Salmon Creek is a north Vancouver/Clark County area worth a look — a genuinely suburban setting near the I-5/I-205 interchange, with a population of roughly 21,000.",
        "Salmon Creek is in the Vancouver Public Schools district, the same as several of the other Vancouver-area neighborhoods in this rotation.",
      ],
      livingIn: [
        "Salmon Creek has a genuine mix of housing, from entry-level condos to higher-end homes, including some with creek or estuary views.",
      ],
      whereLocated: [
        "Salmon Creek sits at the I-5/I-205 interchange in north Vancouver/Clark County. Clark College's main campus is nearby, just east of I-5 in Vancouver's Central Park area.",
      ],
      homesIn: [
        "Housing in Salmon Creek ranges from entry-level condos up to higher-end homes, some with creek or estuary views. As with any area with this much variety, it's worth comparing specific addresses rather than assuming uniformity.",
      ],
      parks: [
        "The Salmon Creek Greenway Trail is a real, county-maintained wooded trail with creek access, a genuine outdoor amenity for the area. Legacy Salmon Creek Medical Center, opened in 2005 and recognized for its eco-friendly design, is also a notable local landmark.",
      ],
      commute: [
        "Sitting right at the I-5/I-205 interchange gives Salmon Creek access in multiple directions, though that same interchange can back up badly at the wrong hour — test your specific route before counting on a number.",
      ],
      reasons: [
        "<strong>I-5/I-205 interchange access:</strong> direct routes in multiple directions from a genuinely central Clark County location.",
        "<strong>Salmon Creek Greenway Trail:</strong> wooded trail with creek access.",
        "<strong>Housing variety:</strong> from entry-level condos to higher-end homes with creek or estuary views.",
      ],
      considerations: [
        "<strong>Interchange proximity means more traffic in spots:</strong> worth checking specific addresses relative to the freeway for noise and access.",
        "<strong>Wide price range:</strong> the mix of condos and higher-end homes means comparing like-for-like matters more here than in a single planned subdivision.",
        "<strong>Density varies:</strong> some pockets are more suburban-dense, others quieter — worth touring more than one part of the area.",
      ],
      closing: [
        "Central access matters more to some buyers than any single amenity, and Salmon Creek's interchange location is hard to match anywhere else in this rotation.",
      ],
    },
    {
      hook: "A Wide Range, Steady Demand Either Way",
      keyword: "Salmon Creek Vancouver market update",
      metaDescription:
        "A market update on Salmon Creek in Vancouver, WA — demand across its wide range of housing types right now near I-5.",
      variant: "update",
      intro: [
        "Salmon Creek's condo-to-estate range means this market moves at more than one speed at once.",
      ],
      marketNotes: [
        "Buyers valuing I-5/I-205 access continue to be a steady source of demand, given how central this location is within Clark County.",
        "Homes with creek or estuary views tend to draw the most attention relative to more standard interior-lot properties.",
        "Entry-level condos here continue to be a common starting point for buyers new to the Vancouver market.",
      ],
      closing: [
        "Given how wide this market's range is, it's worth narrowing your alert to a specific home type rather than watching the whole area at once.",
      ],
    },
    {
      hook: "Interchange Access, Real Tradeoffs",
      keyword: "living in Salmon Creek Vancouver",
      metaDescription:
        "What to weigh before buying in Salmon Creek, Vancouver — traffic, housing variety and commute, explained clearly.",
      variant: "considerations",
      intro: [
        "Living next to a major interchange has upsides and downsides, and Salmon Creek is a straightforward example of both.",
      ],
      reasons: [
        "<strong>I-5/I-205 access:</strong> a genuinely central Clark County location.",
        "<strong>Salmon Creek Greenway Trail:</strong> a real wooded trail with creek access.",
      ],
      considerations: [
        "<strong>Interchange proximity:</strong> some addresses see more traffic and noise than others — worth checking specific locations.",
        "<strong>Wide price range:</strong> compare like-for-like given the mix of condos and higher-end homes.",
      ],
      closing: [
        "Touring homes in more than one part of the area tends to show how much the traffic exposure actually varies block to block.",
      ],
    },
  ],
  "Irvington, Portland": [
    {
      hook: "Portland's Largest Historic District, Steps from Grant Park",
      keyword: "Irvington Portland OR homes",
      metaDescription:
        "Moving to Portland, OR? See what Irvington is like — historic homes, parks, schools and commute, plus current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Portland, Oregon, Irvington is one of the city's most established neighborhoods worth a look — Oregon's largest historic residential district, added to the National Register of Historic Places in 2010.",
        "Irvington sits in Northeast Portland, bordered roughly by NE 7th Avenue to NE 26th Avenue and NE Fremont Street to NE Broadway.",
      ],
      livingIn: [
        "Irvington is genuinely historic, not just old — it's the largest intact historic district in Oregon, with architecture spanning Queen Anne, Craftsman and Prairie School styles built mostly between the 1890s and 1930s.",
      ],
      whereLocated: [
        "Irvington sits just south of NE Broadway in Northeast Portland, close to I-84 and I-5, neighboring Sabin, Alameda, Eliot and Grant Park.",
      ],
      homesIn: [
        "Homes here are predominantly Queen Anne, Craftsman/Period Revival Bungalow and Prairie School styles, most built between the 1890s and 1930s — expect real architectural character, and real variation in what's been updated versus preserved as original.",
      ],
      parks: [
        "Irving Park, about 16 acres at NE 7th and Fremont, has ball fields, courts, a playground and an off-leash dog area. Grant Park, nearly 20 acres, sits just east in the neighboring Grant Park neighborhood with its own playground, dog park and athletic fields.",
      ],
      commute: [
        "I-84 and I-5 are both close by, and Northeast Portland's grid makes cross-town driving fairly direct. Portland-area traffic still varies significantly by time of day, so it's worth mapping your specific commute before assuming a number from a map.",
      ],
      reasons: [
        "<strong>Genuine historic character:</strong> Oregon's largest historic residential district, real architecture from the 1890s–1930s.",
        "<strong>Park access:</strong> Irving Park and nearby Grant Park both within reach.",
        "<strong>Central Northeast Portland location:</strong> close to I-84 and I-5.",
      ],
      considerations: [
        "<strong>Historic-district rules:</strong> exterior changes may be subject to preservation guidelines — worth understanding before planning any renovation.",
        "<strong>Older systems:</strong> homes from this era may need updated wiring, plumbing or mechanical systems — a thorough inspection matters here.",
        "<strong>Premium for character:</strong> genuinely historic homes in intact districts tend to draw more competition than comparable newer construction.",
      ],
      closing: [
        "If real architectural character and an established Northeast Portland address matter to you, Irvington is worth a serious look — and worth comparing against neighboring Alameda and Grant Park, which share a similar historic feel.",
      ],
    },
    {
      hook: "Demand for a Real Historic District Doesn't Slow Down",
      keyword: "Irvington Portland market update",
      metaDescription:
        "A market update on Irvington in Portland, OR — demand for this historic Northeast Portland district right now.",
      variant: "update",
      intro: [
        "Genuine historic districts don't come along often in Portland, and Irvington's status as the largest one in Oregon keeps it in steady demand.",
      ],
      marketNotes: [
        "Buyers specifically searching for pre-1930s architecture with intact original details tend to treat Irvington as a first stop, not a backup option.",
        "Homes that have been thoughtfully updated while preserving historic exterior details tend to draw the most competition.",
        "Proximity to both Irving Park and Grant Park continues to be a frequently cited reason buyers choose this neighborhood over comparable Northeast Portland addresses.",
      ],
      closing: [
        "Given how limited genuine historic inventory is in this part of Portland, it's worth having a search alert running well before you're ready to make an offer.",
      ],
    },
    {
      hook: "What Owning a Historic Home Here Really Involves",
      keyword: "living in Irvington Portland",
      metaDescription:
        "What owning a historic home in Irvington, Portland actually involves — preservation rules, upkeep and commute, explained.",
      variant: "considerations",
      intro: [
        "Irvington's historic character is the whole draw, but owning a home in a real historic district comes with real responsibilities worth understanding first.",
      ],
      reasons: [
        "<strong>Genuine architecture:</strong> real Queen Anne, Craftsman and Prairie School homes, not reproductions.",
        "<strong>Established, walkable streets:</strong> mature trees and a real neighborhood feel uncommon in newer construction.",
      ],
      considerations: [
        "<strong>Preservation guidelines:</strong> exterior renovations may require additional review — worth researching before you buy if changes are part of your plan.",
        "<strong>Older home systems:</strong> wiring, plumbing and mechanical systems may need updating depending on the property's history.",
      ],
      closing: [
        "Touring a few homes with an inspector who's worked in historic Portland districts before tends to surface the real condition questions faster than a listing description ever will.",
      ],
    },
  ],
  "Sexton Mountain, Beaverton": [
    {
      hook: "Hillside Living on Beaverton's Southwest Edge",
      keyword: "Sexton Mountain Beaverton OR homes",
      metaDescription:
        "Moving to Beaverton, OR? See what Sexton Mountain is like — hillside homes, trail access, schools and current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Beaverton, Oregon, Sexton Mountain is a hillside neighborhood on the city's southwest edge worth a look — officially recognized by the City of Beaverton with its own dedicated neighborhood page.",
        "Beaverton itself sits about 8 miles west of downtown Portland.",
      ],
      livingIn: [
        "Sexton Mountain has a genuinely elevated, hillside setting — a mix of homes built mostly in the 1990s and 2000s, with a quieter, more suburban feel than central Beaverton.",
      ],
      whereLocated: [
        "Sexton Mountain sits on the southwestern edge of Beaverton, which itself is about 8 miles west of downtown Portland.",
      ],
      homesIn: [
        "Housing here is a mix from the 1990s and 2000s on hillside, elevated lots — expect more topography and views than in flatter parts of Beaverton, along with the tradeoffs that come with hillside construction.",
      ],
      parks: [
        "The Westside Regional Trail runs through Sexton Mountain, connecting to several parks within the neighborhood — a real, usable outdoor amenity built into the area.",
      ],
      commute: [
        "OR-217 (the Beaverton-Tigard Freeway) and US-26 (Sunset Highway) both serve Beaverton, and TriMet's WES commuter rail connects Beaverton and Tigard. OR-217 in particular sees real congestion at peak hours — worth testing your actual route rather than trusting a map estimate.",
      ],
      reasons: [
        "<strong>Hillside setting:</strong> elevated lots and more topography than central Beaverton.",
        "<strong>Westside Regional Trail access:</strong> a real, built-in outdoor amenity connecting to several neighborhood parks.",
        "<strong>City-recognized neighborhood:</strong> Beaverton's own site has a dedicated Sexton Mountain page — this is a genuinely established, defined area.",
      ],
      considerations: [
        "<strong>Hillside construction:</strong> elevated lots can mean more retaining walls, drainage considerations and steeper driveways — worth a close look during inspection.",
        "<strong>OR-217 congestion:</strong> a real factor at peak commute hours — test your specific route and timing.",
        "<strong>Distance from central Beaverton:</strong> being on the southwest edge means a slightly longer drive to the core retail and transit hub.",
      ],
      closing: [
        "If a quieter, hillside setting with real trail access is what you're after in Beaverton, Sexton Mountain is worth a look — and worth comparing against other southwest Beaverton neighborhoods for lot orientation and views.",
      ],
    },
    {
      hook: "A Quieter Corner of a Fast-Growing Suburb",
      keyword: "Sexton Mountain Beaverton market update",
      metaDescription:
        "A market update on Sexton Mountain in Beaverton, OR — demand for this hillside neighborhood right now this season.",
      variant: "update",
      intro: [
        "Beaverton keeps growing, and Sexton Mountain's hillside setting continues to draw buyers who want distance from the busier core without leaving the city.",
      ],
      marketNotes: [
        "Buyers relocating from denser parts of the Portland metro often ask about Sexton Mountain specifically for its quieter, more suburban feel relative to central Beaverton.",
        "Homes with genuine views or larger hillside lots tend to draw more attention than interior-lot properties in the same price tier.",
        "Westside Regional Trail access continues to come up as a deciding factor for buyers comparing Sexton Mountain against other southwest Beaverton options.",
      ],
      closing: [
        "Given Beaverton's overall growth, it's worth setting up a dedicated search here rather than relying on a broader citywide alert.",
      ],
    },
    {
      hook: "Hillside Homes Come With Hillside Questions",
      keyword: "living in Sexton Mountain Beaverton",
      metaDescription:
        "What to weigh before buying in Sexton Mountain, Beaverton — hillside construction, commute and trail access, explained.",
      variant: "considerations",
      intro: [
        "A hillside setting is a real selling point in Sexton Mountain, but it also raises a few questions worth asking before you tour.",
      ],
      reasons: [
        "<strong>Elevated, hillside lots:</strong> more topography and views than central Beaverton.",
        "<strong>Westside Regional Trail:</strong> real, walkable access built into the neighborhood.",
      ],
      considerations: [
        "<strong>Hillside construction details:</strong> retaining walls, drainage and steep driveways are worth a close inspection look.",
        "<strong>OR-217 congestion:</strong> a genuine factor at peak hours — test your actual commute.",
      ],
      closing: [
        "Driving the neighborhood's streets at different times of day, not just touring homes, tends to give the clearest read on how the hillside setting actually feels day to day.",
      ],
    },
  ],
  "Bull Mountain, Tigard": [
    {
      hook: "Elevated New Construction on Tigard's Signature Hilltop",
      keyword: "Bull Mountain Tigard OR homes",
      metaDescription:
        "Moving to Tigard, OR? See what the Bull Mountain area is like — newer homes, trail access, schools and current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Tigard, Oregon, the Bull Mountain area is worth a look — a hilltop area, roughly 710 feet in elevation, about 12 miles southwest of Portland.",
        "A quick note on geography: Bull Mountain is an unincorporated Washington County area in and around Tigard, not entirely inside the city limits everywhere — worth confirming the exact jurisdiction for any specific property.",
      ],
      livingIn: [
        "Bull Mountain has a genuinely elevated, newer-construction character — mostly traditional and Craftsman-style homes built over roughly the last 20 years, many on view lots.",
      ],
      whereLocated: [
        "Bull Mountain sits on a hilltop in and around Tigard, about 12 miles southwest of downtown Portland. Tigard itself is built around Pacific Highway (Hwy 99W), with OR-217 and I-5 both serving the city.",
      ],
      homesIn: [
        "Housing on Bull Mountain is mostly newer traditional and Craftsman-style construction from the last two decades, often on elevated or view lots — expect more consistent modern layouts than in Tigard's older, more central neighborhoods.",
      ],
      parks: [
        "Bull Mountain Park, maintained by the City of Tigard, has 9 trails supporting hiking, mountain biking and trail running — a real, substantial outdoor amenity for the area.",
      ],
      commute: [
        "Tigard sits along Pacific Highway (99W), with OR-217 and I-5 access, and TriMet's WES commuter rail connects Tigard and Beaverton as a transit alternative. OR-217 sees real congestion at peak hours — worth testing your specific route rather than trusting a map estimate.",
      ],
      reasons: [
        "<strong>Newer construction:</strong> mostly built within the last 20 years, more consistent modern layouts.",
        "<strong>Elevation and views:</strong> a genuine hilltop setting, roughly 710 feet up.",
        "<strong>Bull Mountain Park access:</strong> 9 trails maintained by the City of Tigard.",
      ],
      considerations: [
        "<strong>Jurisdiction varies:</strong> parts of Bull Mountain are unincorporated Washington County rather than inside Tigard city limits — worth confirming for any specific address.",
        "<strong>OR-217 congestion:</strong> a real factor at peak hours.",
        "<strong>Hillside construction:</strong> elevated lots can mean more retaining walls and drainage considerations — worth a close inspection.",
      ],
      closing: [
        "If newer construction on an elevated, view-oriented lot is what you're after near Tigard, the Bull Mountain area is worth a look — just confirm the exact jurisdiction and any HOA details for the specific property you're considering.",
      ],
    },
    {
      hook: "New Construction Keeps Bull Mountain in Demand",
      keyword: "Bull Mountain Tigard market update",
      metaDescription:
        "A market update on the Bull Mountain area near Tigard, OR — demand for newer hilltop construction right now this season.",
      variant: "update",
      intro: [
        "Newer construction on a real hilltop setting is a specific combination, and Bull Mountain continues to deliver on it for buyers who want both.",
      ],
      marketNotes: [
        "Buyers relocating from denser parts of the Portland metro often ask about Bull Mountain specifically for its newer construction and elevation.",
        "View lots tend to draw more attention and competition than interior lots within the same general area.",
        "Bull Mountain Park's trail system continues to come up as a deciding factor for buyers comparing this area against other Tigard neighborhoods.",
      ],
      closing: [
        "Given the area's popularity with relocation buyers, it's worth having a dedicated search running rather than a broad Tigard-wide alert.",
      ],
    },
    {
      hook: "What the Hilltop Setting Actually Means Day to Day",
      keyword: "living in Bull Mountain Tigard",
      metaDescription:
        "What living on Bull Mountain near Tigard actually involves — jurisdiction, commute and hillside upkeep, explained.",
      variant: "considerations",
      intro: [
        "The Bull Mountain area's hilltop setting is a real draw, but it's worth understanding a few practical details before you tour.",
      ],
      reasons: [
        "<strong>Newer construction:</strong> mostly built within the last two decades.",
        "<strong>Bull Mountain Park:</strong> 9 trails for hiking and mountain biking, maintained by the City of Tigard.",
      ],
      considerations: [
        "<strong>Jurisdiction varies by address:</strong> confirm whether a specific property is inside Tigard city limits or unincorporated Washington County.",
        "<strong>OR-217 congestion:</strong> a genuine factor at peak commute hours.",
      ],
      closing: [
        "The best next step is usually confirming the exact jurisdiction and any HOA details for a specific property before touring, since both can vary block to block on Bull Mountain.",
      ],
    },
  ],
  "North Bethany, Bethany": [
    {
      hook: "A Planned Community in Northwest Washington County",
      keyword: "North Bethany OR homes",
      metaDescription:
        "Moving to the Bethany, OR area? See what North Bethany is like — planned community, parks, schools and current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to the Bethany area, North Bethany is worth a look — a planned community that's been developing since 2006, in the northwest corner of Washington County.",
        "Bethany itself is an unincorporated community between Beaverton, Hillsboro and Portland, with two recognized sub-areas: the older, more mixed Central Bethany, and the newer, planned North Bethany.",
      ],
      livingIn: [
        "North Bethany is a genuinely planned community — newer single-family homes with more consistent design than Central Bethany's older mix of townhomes, condos and apartments.",
      ],
      whereLocated: [
        "North Bethany sits in the northwest corner of Washington County, between Beaverton, Hillsboro and Portland, accessible via US-26.",
      ],
      homesIn: [
        "Homes in North Bethany are newer, single-detached construction as part of a planned development that began in 2006 — expect more consistent layouts and finishes than the older, mixed housing stock in Central Bethany.",
      ],
      parks: [
        "The Rock Creek Regional Trail (3.5 miles, ADA-accessible) and the Waterhouse Trail (10 miles, ADA-accessible) both run through the broader Bethany area. Bethany Lake Park, a 42-acre park with trails, picnic areas and a community garden, is also nearby.",
      ],
      commute: [
        "US-26 is the primary route connecting Bethany to Portland and Hillsboro. As with any Portland-metro commute, actual drive times vary significantly by time of day — worth testing your specific route before counting on an estimate.",
      ],
      reasons: [
        "<strong>Planned community:</strong> newer, more consistent construction than Central Bethany's older mix.",
        "<strong>Extensive trail access:</strong> the Rock Creek Regional Trail and Waterhouse Trail both serve the broader Bethany area.",
        "<strong>Northwest Washington County location:</strong> between Beaverton, Hillsboro and Portland, with US-26 access.",
      ],
      considerations: [
        "<strong>Newer, still-developing area:</strong> landscaping and some community amenities may still be maturing depending on the specific phase of development.",
        "<strong>Distance from Vancouver WA:</strong> this is genuinely farther from Jamie's home base than the Washington-side neighborhoods — worth mapping your actual commute if that matters to your daily routine.",
        "<strong>HOA likely:</strong> planned communities like North Bethany often have HOA structures — worth confirming dues and rules for a specific property.",
      ],
      closing: [
        "If a planned community with real trail access in northwest Washington County is what you're after, North Bethany is worth a look — and worth comparing against Central Bethany if you want a wider range of home styles and ages.",
      ],
    },
    {
      hook: "A Still-Developing Community Worth Watching",
      keyword: "North Bethany market update",
      metaDescription:
        "A market update on North Bethany, OR — demand for this planned community in Washington County right now this season.",
      variant: "update",
      intro: [
        "North Bethany has been developing steadily since 2006, and that ongoing growth shapes how the market here behaves.",
      ],
      marketNotes: [
        "Buyers relocating from more established parts of the Portland metro often ask about North Bethany specifically for its newer, more consistent construction.",
        "Because development is ongoing, inventory includes homes from different phases and build years within the same general area — worth comparing specific build years, not just the neighborhood name.",
        "Trail access via the Rock Creek Regional Trail and Waterhouse Trail continues to be a frequently cited reason buyers choose this area.",
      ],
      closing: [
        "Given how actively this area continues to develop, it's worth checking in on new listings regularly rather than relying on a one-time search.",
      ],
    },
    {
      hook: "Newer Community, Different Tradeoffs",
      keyword: "living in North Bethany OR",
      metaDescription:
        "What to weigh before buying in North Bethany, OR — HOA structure, commute distance and development stage, explained.",
      variant: "considerations",
      intro: [
        "North Bethany has real advantages as a planned community, but it's worth understanding how it differs from more established Portland-area neighborhoods.",
      ],
      reasons: [
        "<strong>Newer, consistent construction:</strong> more uniform layouts and finishes than older parts of Bethany.",
        "<strong>Trail access:</strong> the Rock Creek Regional Trail and Waterhouse Trail both serve the area.",
      ],
      considerations: [
        "<strong>Still developing:</strong> landscaping and amenities may vary by phase — worth asking about the specific section of the development.",
        "<strong>HOA structure likely:</strong> worth confirming dues and rules for any specific property.",
      ],
      closing: [
        "Comparing a few homes across different phases of the development tends to clarify how the community has matured so far.",
      ],
    },
  ],
  "Orenco Station, Hillsboro": [
    {
      hook: "A Transit-Oriented Community Built on Century-Old Roots",
      keyword: "Orenco Station Hillsboro OR homes",
      metaDescription:
        "Moving to Hillsboro, OR? See what Orenco Station is like — walkable design, MAX access, schools and current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Hillsboro, Oregon, Orenco Station is a genuinely distinctive neighborhood worth a look — a New Urbanist, transit-oriented community built starting in 1997 on the site of a company town founded in 1906.",
        "The name comes from the Oregon Nursery Company, which originally built Orenco as a company town with its own school, police, fire department and post office before residents voted to disincorporate in 1938.",
      ],
      livingIn: [
        "Orenco Station is designed to be walkable — narrower streets, alley-loaded garages and live-work spaces, with architecture deliberately styled to look like an older, established neighborhood even though most of it was built starting in the late 1990s.",
      ],
      whereLocated: [
        "Orenco Station is centered around NE Century Boulevard and Cornell Road in Hillsboro, built on roughly 209 acres of former nursery land.",
      ],
      homesIn: [
        "Housing here is genuinely diverse — apartments, single-family homes, condos and townhouses, all built with a walkable, higher-density format in mind rather than a single repeated layout.",
      ],
      parks: [
        "Central Park anchors the neighborhood just north of the retail core, along with several smaller distributed parks. A seasonal farmers market runs late spring through summer.",
      ],
      commute: [
        "The Orenco MAX Station (TriMet Blue and Red Line, opened 1998) gives residents a genuine transit alternative to driving — a 2002 study found 22% of residents commuted by transit versus 6% regionally. For drivers, US-26 provides the primary route toward Portland, with the usual variability by time of day.",
      ],
      reasons: [
        "<strong>Walkable, transit-oriented design:</strong> genuinely built around the Orenco MAX Station, not just close to it.",
        "<strong>Housing variety:</strong> apartments, single-family homes, condos and townhouses all within the same walkable community.",
        "<strong>Real neighborhood core:</strong> Central Park, a seasonal farmers market, and a retail core give this a genuine town-center feel.",
      ],
      considerations: [
        "<strong>Higher density:</strong> narrower streets and alley-loaded garages mean less traditional yard space than a standard suburban lot.",
        "<strong>Popularity means competition:</strong> this is one of the more sought-after transit-oriented communities in the Portland metro, and that shows in how quickly well-priced listings move.",
        "<strong>HOA likely:</strong> many of the townhome and condo products here carry HOA dues — worth confirming for a specific property.",
      ],
      closing: [
        "If walkability and a genuine transit alternative to driving matter to you, Orenco Station is worth a close look — it's a meaningfully different model than most other neighborhoods in this rotation.",
      ],
    },
    {
      hook: "One of the Metro's Most Requested Transit-Oriented Addresses",
      keyword: "Orenco Station Hillsboro market update",
      metaDescription:
        "A market update on Orenco Station in Hillsboro, OR — demand for this transit-oriented community right now this season.",
      variant: "update",
      intro: [
        "Transit-oriented, walkable communities are in real demand across the Portland metro, and Orenco Station is often the first one buyers ask about by name.",
      ],
      marketNotes: [
        "Buyers specifically prioritizing walkability and MAX access tend to treat Orenco Station as a first stop rather than a backup option.",
        "Townhomes and condos closest to the retail core and MAX station tend to move fastest among the various housing types here.",
        "Buyers relocating from denser cities outside Oregon often recognize this development style immediately and gravitate toward it.",
      ],
      closing: [
        "Given how consistently in-demand this neighborhood is, it's worth having a dedicated alert running well before you're ready to make an offer.",
      ],
    },
    {
      hook: "Density Trades Yard Space for Walkability",
      keyword: "living in Orenco Station Hillsboro",
      metaDescription:
        "What to weigh before buying in Orenco Station, Hillsboro — density, HOA structure and walkability, explained clearly.",
      variant: "considerations",
      intro: [
        "Orenco Station's walkable design is the whole point, but it's worth understanding what that trades away before you commit to touring.",
      ],
      reasons: [
        "<strong>Walkability and transit access:</strong> genuinely built around the Orenco MAX Station.",
        "<strong>Real neighborhood core:</strong> Central Park, a farmers market and a walkable retail district.",
      ],
      considerations: [
        "<strong>Less yard space:</strong> narrower streets and alley-loaded garages mean less traditional outdoor space.",
        "<strong>HOA dues likely:</strong> common across the townhome and condo product here — confirm for any specific property.",
      ],
      closing: [
        "Walking the neighborhood at different times of day, including a stop at the farmers market if the timing works out, tends to show whether the walkable, denser format actually fits how you want to live.",
      ],
    },
  ],
  "Mountain Park, Lake Oswego": [
    {
      hook: "A Large HOA Community With Private Trails Near Portland",
      keyword: "Mountain Park Lake Oswego OR homes",
      metaDescription:
        "Moving to Lake Oswego, OR? See what Mountain Park is like — HOA trails, homes, schools and current listings today.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Lake Oswego, Oregon, Mountain Park is worth a look — an established community founded in 1968 with around 8,500 residents, in the northwest part of the city.",
        "One important clarification upfront: despite Lake Oswego's name, most Mountain Park properties do not carry lake access rights — that's tied to specific easements on certain homes elsewhere in the city, not a general neighborhood amenity here.",
      ],
      livingIn: [
        "Mountain Park is built around one of the largest homeowners associations in the country — nearly every property belongs to the Mountain Park HOA, with automatic membership and monthly dues that fund the community's private amenities.",
      ],
      whereLocated: [
        "Mountain Park sits in northwest Lake Oswego, bordered by Southwest Portland to the north, the Uplands and Holly Orchard neighborhoods to the south, Oak Creek to the west and Forest Highlands to the east — near Highway 43 and I-5, roughly 8 miles from downtown Portland.",
      ],
      homesIn: [
        "Housing in Mountain Park genuinely spans a wide range — entry-level condos and townhomes, mid-range single-level ranch and mid-century modern homes, and premium contemporary estates, all within the same HOA community.",
      ],
      parks: [
        "The Mountain Park HOA maintains more than 8 miles of private walking trails within the community. Nearby, Tryon Creek State Natural Area and the Lake Oswego Recreation & Aquatics Center (LORAC) offer additional outdoor and recreation options.",
      ],
      commute: [
        "Highway 43 and I-5 both serve Lake Oswego, with downtown Portland roughly 8 miles away. As with any Portland-area commute, actual drive time depends heavily on time of day — worth testing your specific route rather than relying on that approximate distance.",
      ],
      reasons: [
        "<strong>Large, established HOA community:</strong> over 8 miles of private trails and shared amenities, funded and maintained by one of the largest HOAs in the country.",
        "<strong>Housing variety:</strong> a genuine range from entry-level condos to premium contemporary estates.",
        "<strong>Proximity to Portland:</strong> roughly 8 miles from downtown via Highway 43 and I-5.",
      ],
      considerations: [
        "<strong>No general lake access:</strong> despite the city's name, most Mountain Park properties don't carry Oswego Lake access rights — don't assume this without verifying for a specific property.",
        "<strong>Mandatory HOA dues:</strong> membership and monthly dues are automatic for nearly every property — a real ongoing cost worth budgeting for.",
        "<strong>Wide price range:</strong> comparing like-for-like matters more here than in a single uniform subdivision, given the housing variety.",
      ],
      closing: [
        "If a large, amenity-rich HOA community close to Portland is what you're after — and lake access isn't a must-have — Mountain Park is worth a serious look. Just verify HOA dues and any lake-access specifics directly for whatever property you're considering.",
      ],
    },
    {
      hook: "Steady Interest Across a Genuinely Wide Price Range",
      keyword: "Mountain Park Lake Oswego market update",
      metaDescription:
        "A market update on Mountain Park in Lake Oswego, OR — demand across its wide range of housing types right now.",
      variant: "update",
      intro: [
        "Mountain Park's genuinely wide housing mix means this market moves at more than one pace depending on the segment.",
      ],
      marketNotes: [
        "Buyers drawn to the HOA's private trail system and shared amenities tend to be a steady source of demand regardless of the specific home type.",
        "Entry-level condos and townhomes here continue to be a common starting point for buyers who want a Lake Oswego address without the premium-estate price tag.",
        "Buyers specifically hoping for lake access sometimes discover partway through their search that most Mountain Park properties don't carry it — worth clarifying early to avoid a mismatch.",
      ],
      closing: [
        "Given the range of housing types here, it's worth narrowing your search to a specific price tier rather than watching the whole community at once.",
      ],
    },
    {
      hook: "What the HOA Actually Covers — and What It Doesn't",
      keyword: "living in Mountain Park Lake Oswego",
      metaDescription:
        "What to weigh before buying in Mountain Park, Lake Oswego — HOA dues, lake access and commute, explained clearly.",
      variant: "considerations",
      intro: [
        "Mountain Park's HOA is central to daily life here, and it's worth understanding exactly what it does and doesn't include before you buy.",
      ],
      reasons: [
        "<strong>Private trail system:</strong> over 8 miles maintained by the HOA, a genuine shared amenity.",
        "<strong>Housing variety:</strong> a real range from entry-level to premium within the same community.",
      ],
      considerations: [
        "<strong>No general lake access:</strong> verify this directly rather than assuming it comes with a Lake Oswego address.",
        "<strong>Mandatory monthly dues:</strong> a real ongoing cost across nearly every property in the community.",
      ],
      closing: [
        "Asking to see the HOA's current budget and rules directly, alongside touring a couple of homes, tends to answer the practical questions faster than general research can.",
      ],
    },
  ],
  "Hidden Springs, West Linn": [
    {
      hook: "One of West Linn's Eleven Official Neighborhoods, West of the Willamette",
      keyword: "Hidden Springs West Linn OR homes",
      metaDescription:
        "Moving to West Linn, OR? See what Hidden Springs is like — hillside homes, parks, schools and current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to West Linn, Oregon, Hidden Springs is one of the city's eleven official neighborhood associations worth a look — a hilly but walkable area west of Willamette Drive.",
        "West Linn itself sits about 15 miles south of Portland along the Willamette River.",
      ],
      livingIn: [
        "Hidden Springs has a genuine mix of architectural styles — federal, colonial, salt box and traditional homes — across roughly 1,236 homes and about 3,179 residents, making it one of West Linn's smaller neighborhoods.",
      ],
      whereLocated: [
        "Hidden Springs sits west of Willamette Drive, nestled into the West Linn hills, bordering Marylhurst to the north, Robinwood and Bolton to the east, and Rosemont Summit to the south.",
      ],
      homesIn: [
        "Housing here spans a genuine mix of styles and eras rather than one uniform product — mature flowering trees and manicured sidewalks give the neighborhood a settled, established feel despite the hilly terrain.",
      ],
      parks: [
        "Three named parks serve the neighborhood directly: Benski Park, Palomino Park and Sunburst Park — real, local amenities rather than a single shared destination park.",
      ],
      commute: [
        "West Linn sits along Highway 43 and I-205, about 15 miles from downtown Portland. Willamette Falls, the largest waterfall by volume in the Pacific Northwest, sits on the river between Oregon City and West Linn. As with any Portland-area commute, actual drive time varies by time of day — worth testing your specific route.",
      ],
      reasons: [
        "<strong>Official, established neighborhood:</strong> one of West Linn's eleven recognized neighborhood associations, with real local infrastructure.",
        "<strong>Three local parks:</strong> Benski, Palomino and Sunburst all serve the immediate area.",
        "<strong>Genuinely walkable despite the hills:</strong> mature landscaping and sidewalks throughout.",
      ],
      considerations: [
        "<strong>Hilly terrain:</strong> the neighborhood's setting means some homes and streets have real elevation change — worth considering if that matters to you.",
        "<strong>One of the smaller neighborhoods:</strong> with about 1,236 homes, inventory can be more limited than in larger West Linn neighborhoods.",
        "<strong>Architectural variety:</strong> the mix of styles means comparing specific homes matters more than assuming uniformity.",
      ],
      closing: [
        "If an established, walkable West Linn neighborhood with real local parks is what you're after, Hidden Springs is worth a look — and worth comparing against West Linn's other ten neighborhood associations for the right fit.",
      ],
    },
    {
      hook: "A Smaller Neighborhood Where Inventory Moves Quickly",
      keyword: "Hidden Springs West Linn market update",
      metaDescription:
        "A market update on Hidden Springs in West Linn, OR — demand in one of the city's smaller neighborhoods right now.",
      variant: "update",
      intro: [
        "Hidden Springs is one of West Linn's smaller neighborhoods by home count, and that scarcity shapes how quickly things move here.",
      ],
      marketNotes: [
        "With around 1,236 homes total, well-priced listings in Hidden Springs don't stay on the market long relative to some of West Linn's larger neighborhoods.",
        "Buyers who value proximity to Benski, Palomino and Sunburst parks tend to treat this as a specific, deliberate choice rather than a general West Linn search.",
        "Architectural variety here means buyers comparing homes should expect real differences in style and era from one listing to the next.",
      ],
      closing: [
        "Given the neighborhood's smaller size, it's worth setting up a dedicated Hidden Springs alert rather than relying on a broader West Linn search.",
      ],
    },
    {
      hook: "Hills, History and What They Mean for a Tour",
      keyword: "living in Hidden Springs West Linn",
      metaDescription:
        "What to weigh before buying in Hidden Springs, West Linn — hillside terrain, home variety and commute, explained.",
      variant: "considerations",
      intro: [
        "Hidden Springs has real character, but its hilly setting and architectural variety are both worth understanding before you tour.",
      ],
      reasons: [
        "<strong>Three local parks:</strong> Benski, Palomino and Sunburst all serve the immediate neighborhood.",
        "<strong>Established, walkable streets:</strong> mature trees and sidewalks despite the hilly terrain.",
      ],
      considerations: [
        "<strong>Hilly terrain:</strong> real elevation change across the neighborhood — worth understanding for daily walkability.",
        "<strong>Smaller inventory:</strong> around 1,236 homes total means fewer listings at any given time than in larger neighborhoods.",
      ],
      closing: [
        "Walking a few blocks in person tends to show how the hillside terrain actually affects daily life here more clearly than a map ever could.",
      ],
    },
  ],
  "Canemah, Oregon City": [
    {
      hook: "A National Register Historic District Above Willamette Falls",
      keyword: "Canemah Oregon City OR homes",
      metaDescription:
        "Moving to Oregon City, OR? See what Canemah is like — historic homes, river views, schools and current listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Oregon City, Oregon, Canemah is one of the most historically significant neighborhoods worth a look — a National Register of Historic Places district and one of the oldest mapped neighborhoods west of the Mississippi.",
        "Oregon City sits along the Willamette River, near Willamette Falls, about 26 miles upriver from where the Willamette meets the Columbia.",
      ],
      livingIn: [
        "Canemah is genuinely historic — the median build year is 1937, with some homes dating back to the 1800s, and exterior-preservation rules apply as part of the district's historic designation.",
      ],
      whereLocated: [
        "Canemah sits along the Willamette River in Oregon City, near Willamette Falls. OR-99E connects Oregon City through Gladstone and Milwaukie into Portland, and I-205 intersects OR-99E about a mile south of OR-213.",
      ],
      homesIn: [
        "Homes in Canemah are predominantly bungalows, cottages and Craftsman-style construction, with a median build year of 1937 and some homes dating to the 1800s — genuine historic character, not a modern reproduction.",
      ],
      parks: [
        "Canemah Neighborhood Children's Park and the adjacent Canemah Bluff Nature Park both serve the area — the bluff park offers trails, wildlife viewing and overlooks of the Willamette River.",
      ],
      commute: [
        "OR-99E is the primary route connecting Oregon City through Gladstone and Milwaukie toward Portland, with I-205 also accessible nearby. As with any Portland-metro commute, actual drive time depends on time of day — worth testing your specific route.",
      ],
      reasons: [
        "<strong>Genuine historic significance:</strong> a National Register district, one of the oldest mapped neighborhoods west of the Mississippi.",
        "<strong>River bluff setting:</strong> Canemah Bluff Nature Park offers trails and real Willamette River overlooks.",
        "<strong>Established architecture:</strong> bungalows, cottages and Craftsman homes with a median build year of 1937.",
      ],
      considerations: [
        "<strong>Historic-district rules:</strong> exterior preservation guidelines apply — worth understanding before planning any renovation.",
        "<strong>Older home systems:</strong> given the age of the housing stock, wiring, plumbing and mechanical systems may need updating.",
        "<strong>Willamette Falls Locks currently under repair:</strong> expected to reopen in 2026 — a nearby landmark worth knowing the status of if it factors into your interest in the area.",
      ],
      closing: [
        "If genuine historic character with real river-bluff views is what you're after, Canemah is worth a serious look — and worth pairing with a visit to Willamette Falls itself to get a feel for the setting.",
      ],
    },
    {
      hook: "A Historic District That Doesn't Turn Over Often",
      keyword: "Canemah Oregon City market update",
      metaDescription:
        "A market update on Canemah in Oregon City, OR — demand for this historic riverside district right now this season.",
      variant: "update",
      intro: [
        "Genuine 19th- and early-20th-century housing stock is rare in the Portland metro, and Canemah's historic designation keeps it in steady, specific demand.",
      ],
      marketNotes: [
        "Buyers specifically searching for pre-1940s architecture with river-bluff proximity tend to treat Canemah as a distinct, deliberate search rather than a general Oregon City look.",
        "Homes that have preserved historic exterior details while updating interior systems tend to draw the most competition.",
        "Canemah Bluff Nature Park's river overlooks continue to be a frequently cited reason buyers choose this specific district.",
      ],
      closing: [
        "Given how limited genuine historic riverside inventory is in this part of Oregon City, it's worth having a dedicated alert running well ahead of time.",
      ],
    },
    {
      hook: "Owning History Above the Falls",
      keyword: "living in Canemah Oregon City",
      metaDescription:
        "What owning a historic home in Canemah, Oregon City actually involves — preservation rules, upkeep and commute.",
      variant: "considerations",
      intro: [
        "Canemah's history is the whole draw, but a genuine historic district comes with genuine responsibilities worth understanding first.",
      ],
      reasons: [
        "<strong>Real historic character:</strong> median build year 1937, some homes dating to the 1800s.",
        "<strong>River bluff setting:</strong> Canemah Bluff Nature Park offers trails and Willamette River overlooks.",
      ],
      considerations: [
        "<strong>Preservation guidelines:</strong> exterior changes may require additional review as part of the historic district designation.",
        "<strong>Older systems:</strong> wiring, plumbing and mechanical systems may need updating depending on the property's history.",
      ],
      closing: [
        "Touring with an inspector experienced in historic Oregon City homes tends to surface the real condition questions faster than a listing description can.",
      ],
    },
  ],
  "Historic Milwaukie, Milwaukie": [
    {
      hook: "A Walkable Downtown Core Along the MAX Orange Line",
      keyword: "Historic Milwaukie OR homes",
      metaDescription:
        "Moving to Milwaukie, OR? See what Historic Milwaukie is like — downtown character, MAX access, schools and listings.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Milwaukie, Oregon, Historic Milwaukie is the city's downtown/core neighborhood worth a look — bungalow-era character with a genuinely active Main Street.",
        "Milwaukie sits along OR-99E, on the way from Oregon City into Portland.",
      ],
      livingIn: [
        "Historic Milwaukie has real bungalow character — 1920s and 1930s homes with original details, tree-lined sidewalks and small grassy lots, mixed with some ranch-style, cottage-style and contemporary homes.",
      ],
      whereLocated: [
        "Historic Milwaukie sits along OR-99E, with downtown as the neighborhood's social and commercial center.",
      ],
      homesIn: [
        "Housing here is predominantly 1920s–1930s bungalows with original character, tree-lined sidewalks and small grassy lots, alongside some ranch-style, cottage-style, contemporary and split-level homes mixed in — a genuine mix of eras rather than one uniform product.",
      ],
      parks: [
        "Downtown Milwaukie's Main Street is the real neighborhood anchor — home to what's widely cited as the longest-running Sunday farmers market in the Portland metro, with 80+ vendors, plus the old city hall building and a growing restaurant and coffee scene.",
      ],
      commute: [
        "The TriMet MAX Orange Line runs through downtown Milwaukie directly to downtown Portland and the Pearl District, giving residents a genuine transit alternative to driving. OR-99E provides the primary driving route, with the usual time-of-day variability.",
      ],
      reasons: [
        "<strong>Genuine downtown character:</strong> a real Main Street with an active farmers market and growing restaurant scene.",
        "<strong>MAX Orange Line access:</strong> a direct transit connection to downtown Portland and the Pearl District.",
        "<strong>Bungalow-era architecture:</strong> 1920s–1930s homes with tree-lined streets and real character.",
      ],
      considerations: [
        "<strong>Older home systems:</strong> given the age of much of the housing stock, wiring and mechanical systems may need updating.",
        "<strong>Small lots:</strong> bungalow-era construction typically means less outdoor space than newer suburban subdivisions.",
        "<strong>Mixed architecture:</strong> comparing specific homes matters more here than assuming uniformity across the neighborhood.",
      ],
      closing: [
        "If genuine downtown character with a real transit alternative to driving is what you're after, Historic Milwaukie is worth a look — the Sunday farmers market alone is worth experiencing before you decide.",
      ],
    },
    {
      hook: "Downtown Character Keeps This Neighborhood in Demand",
      keyword: "Historic Milwaukie market update",
      metaDescription:
        "A market update on Historic Milwaukie, OR — demand for this walkable downtown neighborhood right now this season.",
      variant: "update",
      intro: [
        "Genuine downtown character with MAX access is a specific combination, and Historic Milwaukie continues to deliver it for buyers who want both.",
      ],
      marketNotes: [
        "Buyers who work in downtown Portland but want a walkable, small-town feel often treat Historic Milwaukie as a serious alternative to denser Portland neighborhoods.",
        "Homes closest to Main Street and the MAX Orange Line station tend to draw more competition than those further from the downtown core.",
        "The neighborhood's Sunday farmers market continues to be a frequently cited reason buyers choose this specific area.",
      ],
      closing: [
        "Given the neighborhood's popularity with commuter-minded buyers, it's worth having a dedicated search running rather than a broad Milwaukie-wide alert.",
      ],
    },
    {
      hook: "Character Homes Need a Closer Look",
      keyword: "living in Historic Milwaukie",
      metaDescription:
        "What to weigh before buying in Historic Milwaukie, OR — home age, lot size and transit access, explained clearly.",
      variant: "considerations",
      intro: [
        "Historic Milwaukie's bungalow character is a real draw, but the age of the housing stock is worth a closer look before you make an offer.",
      ],
      reasons: [
        "<strong>Genuine downtown access:</strong> Main Street, a real farmers market and MAX Orange Line service.",
        "<strong>Bungalow-era character:</strong> 1920s–1930s homes with tree-lined streets.",
      ],
      considerations: [
        "<strong>Older systems:</strong> wiring and mechanical systems may need updating depending on the home's age.",
        "<strong>Small lots:</strong> less outdoor space than newer suburban construction.",
      ],
      closing: [
        "A weekday walk through downtown, paired with a Sunday visit during the farmers market, tends to show both sides of what living here actually feels like.",
      ],
    },
  ],
  "Rock Creek, Happy Valley": [
    {
      hook: "A Practical, Established Corner of a Fast-Growing Suburb",
      keyword: "Rock Creek Happy Valley OR homes",
      metaDescription:
        "Moving to Happy Valley, OR? See what Rock Creek is like — homes, nature parks, schools and current listings today.",
      variant: "guide",
      intro: [
        "If you're thinking about moving to Happy Valley, Oregon, Rock Creek is one of the city's practical, established residential areas worth a look — alongside neighboring Sunnyside, it sits at a lower elevation than some of Happy Valley's newer hillside developments.",
        "Happy Valley sits about 13 miles southeast of Portland in Clackamas County, and is known as one of the Portland metro's fastest-growing, heavily master-planned suburbs.",
      ],
      livingIn: [
        "Rock Creek has a genuinely practical character — classic multi-level homes, mature trees and convenient shopping plazas, often described as balancing price, school access and commute better than some of Happy Valley's premium hillside areas.",
      ],
      whereLocated: [
        "Rock Creek sits within easy reach of Highway 212 and I-205 in Happy Valley, about 13 miles southeast of downtown Portland.",
      ],
      homesIn: [
        "Housing in Rock Creek is predominantly classic multi-level construction with mature trees, a step apart from the newer master-planned developments elsewhere in Happy Valley — expect more established landscaping and a more settled feel.",
      ],
      parks: [
        "Mount Talbert Nature Park (trails, wildlife, scenic viewpoints) and Scouters Mountain Nature Park (a popular trail system for after-school and weekend hikes) are both nearby outdoor destinations.",
      ],
      commute: [
        "Highway 212 and I-205 both serve the Rock Creek area, with downtown Portland roughly 13 miles away. As with any Portland-metro commute, actual drive time depends heavily on time of day — worth testing your specific route before counting on that distance.",
      ],
      reasons: [
        "<strong>Practical, established setting:</strong> mature trees and classic multi-level homes rather than a newer, still-developing subdivision.",
        "<strong>Nature park access:</strong> Mount Talbert and Scouters Mountain both offer real trail systems nearby.",
        "<strong>Convenient shopping:</strong> established plazas nearby, a genuine practical advantage over some newer, more remote developments.",
      ],
      considerations: [
        "<strong>Not the newest construction:</strong> buyers specifically wanting brand-new finishes may prefer one of Happy Valley's newer master-planned areas.",
        "<strong>North Clackamas School District serves a large area:</strong> over 40 square miles — worth confirming the specific school assignment for any address rather than assuming.",
        "<strong>Elevation is lower than some Happy Valley areas:</strong> if hillside views specifically matter to you, other parts of the city may fit better.",
      ],
      closing: [
        "If a practical, established Happy Valley address with real nature-park access is what you're after, Rock Creek is worth a look — and worth comparing against the city's newer, more elevated developments depending on what matters most to you.",
      ],
    },
    {
      hook: "The Practical Choice in a Fast-Growing City",
      keyword: "Rock Creek Happy Valley market update",
      metaDescription:
        "A market update on Rock Creek in Happy Valley, OR — demand for this established, practical neighborhood right now.",
      variant: "update",
      intro: [
        "Happy Valley keeps growing fast, and Rock Creek's practical, established character continues to draw a specific kind of buyer.",
      ],
      marketNotes: [
        "Buyers balancing price, school access and commute often land on Rock Creek after comparing it against Happy Valley's newer, pricier hillside developments.",
        "Homes near Mount Talbert or Scouters Mountain nature parks tend to draw more attention than those further from trail access.",
        "Because North Clackamas School District covers such a large area, buyers should expect real variation in specific school assignments even within Rock Creek — worth confirming per address.",
      ],
      closing: [
        "Given how quickly Happy Valley continues to grow overall, it's worth setting up a dedicated Rock Creek search rather than a broad citywide alert.",
      ],
    },
    {
      hook: "Practical Doesn't Mean Without Tradeoffs",
      keyword: "living in Rock Creek Happy Valley",
      metaDescription:
        "What to weigh before buying in Rock Creek, Happy Valley — home age, elevation and school district, explained clearly.",
      variant: "considerations",
      intro: [
        "Rock Creek's practical reputation is well-earned, but it's worth understanding how it compares to Happy Valley's newer developments before you tour.",
      ],
      reasons: [
        "<strong>Established, practical setting:</strong> mature trees and classic multi-level homes.",
        "<strong>Nature park access:</strong> Mount Talbert and Scouters Mountain both nearby.",
      ],
      considerations: [
        "<strong>Not new construction:</strong> buyers wanting the newest finishes may prefer other Happy Valley areas.",
        "<strong>Lower elevation than some Happy Valley neighborhoods:</strong> worth comparing if hillside views are a priority.",
      ],
      closing: [
        "Comparing a Rock Creek home directly against a newer Happy Valley listing, back to back, tends to clarify which tradeoffs actually matter to you.",
      ],
    },
  ],
};

// One-time repair map: the 14 "update"/"considerations" posts across the original 7
// neighborhoods were rewritten (2026-09-24) to fix duplicate hooks/boilerplate Jamie
// flagged as repeated content, but posts already saved to the live board still carried the
// old titles, which silently broke their article body (titleIndexForPost couldn't match the
// old title to any current PostSeed). This lets loadData() find those exact old titles and
// refresh them to the current content — see the `variant` field on Post for how this class
// of drift is now prevented going forward.
const STALE_TITLE_VARIANTS: Record<string, "update" | "considerations"> = {
  "Moving to Camas, WA? Consider Holly Ridge: Market Pulse: Tight Inventory, Fast-Moving Listings":
    "update",
  "Moving to Camas, WA? Consider Holly Ridge: What to Weigh Before You Buy": "considerations",
  "Moving to Vancouver, WA? Consider Lakeshore: Market Update: Inventory & Demand Near the Lake":
    "update",
  "Moving to Vancouver, WA? Consider Lakeshore: What to Weigh Before You Buy": "considerations",
  "Moving to Vancouver, WA? Consider Pleasant Valley: Acreage Listings: What's Available Now":
    "update",
  "Moving to Vancouver, WA? Consider Pleasant Valley: Pros and Cons to Weigh": "considerations",
  "Moving to Camas, WA? Consider Hunter Ridge Estates: Where the Luxury Market Stands Right Now":
    "update",
  "Moving to Camas, WA? Consider Hunter Ridge Estates: Is the Space and Privacy Worth the Tradeoffs?":
    "considerations",
  "Moving to Vancouver, WA? Consider Columbia Way: Condo & Townhome Market: What's Selling":
    "update",
  "Moving to Vancouver, WA? Consider Columbia Way: What Daily Life Here Actually Involves":
    "considerations",
  "Moving to Camas, WA? Consider Deer Creek: Inventory Update: What's on the Market": "update",
  "Moving to Camas, WA? Consider Deer Creek: What to Know Before You Buy": "considerations",
  "Moving to Vancouver, WA? Consider Harney Heights: Market Pulse: Quiet Area, Steady Demand":
    "update",
  "Moving to Vancouver, WA? Consider Harney Heights: What to Know Before You Buy":
    "considerations",
};

// One row per area, 3 slots/day — guarantees each area's 3 posts (guide/update/
// considerations) land on different days, spread evenly across the full rotation cycle,
// and that the cycle returns to area 0 only after every area has had all 3 posted once.
// (For AREAS.length === 7 this reproduces the original hand-written 7-day rotation exactly.)
const ROTATION = AREAS.map((_, d) =>
  [0, 1, 2].map((s) => (3 * d + s) % AREAS.length)
);
const TIME_SLOTS = ["9:00 AM", "12:00 PM", "3:00 PM"];

const PLATFORM_LABELS: Record<string, string> = {
  gbp: "GBP",
  w1: "Main Site",
  w2: "eXp Site",
  li: "LinkedIn",
  fb: "Facebook Page",
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
  "Pioneer Canyon, Ridgefield": ["modernWoodAccent", "craftsmanPalm", "cozyLivingRoom"],
  "Battle Ground Meadows, Battle Ground": ["stuccoTraditional", "modernLivingRoom", "farmhouse"],
  "Stephens Hillside Farm, La Center": ["farmhouse", "modernTree", "cozyLivingRoom"],
  "Northfork Landing, Woodland": ["cabinDusk", "farmhouse", "modernWoodAccent"],
  "Washougal, Washougal": ["craftsmanPalm", "modernTree", "stuccoTraditional"],
  "Hockinson, Hockinson": ["farmhouse", "cabinDusk", "modernWoodAccent"],
  "Amboy, Amboy": ["cabinDusk", "farmhouse", "modernTree"],
  "Brush Prairie, Brush Prairie": ["farmhouse", "modernWoodAccent", "cabinDusk"],
  "Cascade Park, Vancouver": ["modernLivingRoom", "keychain", "minimalistWhite"],
  "Fisher's Landing, Vancouver": ["modernLivingRoom", "craftsmanPalm", "keychain"],
  "Downtown Vancouver, Vancouver": ["loftDog", "minimalistWhite", "whiteVillaPool"],
  "Salmon Creek, Vancouver": ["modernTree", "cozyLivingRoom", "minimalistWhite"],
  "Irvington, Portland": ["craftsmanPalm", "stuccoTraditional", "cozyLivingRoom"],
  "Sexton Mountain, Beaverton": ["modernWoodAccent", "modernTree", "minimalistWhite"],
  "Bull Mountain, Tigard": ["modernLivingRoom", "whiteVillaPool", "modernWoodAccent"],
  "North Bethany, Bethany": ["modernWoodAccent", "stuccoTraditional", "modernLivingRoom"],
  "Orenco Station, Hillsboro": ["loftDog", "modernLivingRoom", "keychain"],
  "Mountain Park, Lake Oswego": ["whiteVillaPool", "minimalistWhite", "cozyLivingRoom"],
  "Hidden Springs, West Linn": ["cabinDusk", "farmhouse", "cozyLivingRoom"],
  "Canemah, Oregon City": ["craftsmanPalm", "farmhouse", "stuccoTraditional"],
  "Historic Milwaukie, Milwaukie": ["craftsmanPalm", "cozyLivingRoom", "farmhouse"],
  "Rock Creek, Happy Valley": ["modernLivingRoom", "farmhouse", "modernTree"],
};

function titleIndexForPost(post: Post): number {
  const titles = TITLES[post.area];
  if (!titles) return -1;
  if (post.variant) {
    const byVariant = titles.findIndex((s) => s.variant === post.variant);
    if (byVariant !== -1) return byVariant;
  }
  return titles.findIndex((s) => seedTitle(post.area, s) === post.title);
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
  if (!seed) return [];

  const neighborhood = post.area.split(",")[0].trim();
  const city = post.area.split(",")[1].trim();
  const stateAbbr = AREA_STATE[post.area] ?? "WA";
  const cityUrl = CITY_URLS[city];
  const nUrl = NEIGHBORHOOD_URLS[post.area] ?? null;
  const district = SCHOOL_DISTRICTS[post.area];

  if (seed.variant === "guide") {
    return [
      ...seed.intro,
      ...exploreHomesBlock(neighborhood, city, stateAbbr, nUrl, cityUrl),
      h2(`What Is It Like Living in ${neighborhood} in ${city}, ${stateAbbr}?`),
      ...(seed.livingIn ?? []),
      h2(`Where Is ${neighborhood} Located?`),
      ...(seed.whereLocated ?? []),
      h2(`Homes in ${neighborhood}`),
      ...(seed.homesIn ?? []),
      ...costBlock(neighborhood, nUrl),
      h2(`Parks, Trails & Things to Do Near ${neighborhood}`),
      ...(seed.parks ?? []),
      ...schoolsBlock(neighborhood, district),
      h2("Commute & Getting Around"),
      ...(seed.commute ?? []),
      h2(`Pros & Considerations of Living in ${neighborhood}`),
      h3("Reasons Buyers May Consider"),
      ...(seed.reasons ?? []),
      h3("Things to Consider"),
      ...(seed.considerations ?? []),
      h2(`Should You Consider ${neighborhood} if You're Moving to ${city}, ${stateAbbr}?`),
      ...seed.closing,
      ...seeHomesBlock(neighborhood, city, stateAbbr, nUrl, cityUrl),
      ...youtubeBlock(city, stateAbbr),
      ...workWithJamieBlock(),
    ];
  }

  if (seed.variant === "update") {
    return [
      ...seed.intro,
      ...exploreHomesBlock(neighborhood, city, stateAbbr, nUrl, cityUrl),
      h2(`${neighborhood} Market Notes`),
      ...(seed.marketNotes ?? []),
      ...seed.closing,
      ...seeHomesBlock(neighborhood, city, stateAbbr, nUrl, cityUrl),
      ...youtubeBlock(city, stateAbbr),
      ...workWithJamieBlock(),
    ];
  }

  return [
    ...seed.intro,
    ...exploreHomesBlock(neighborhood, city, stateAbbr, nUrl, cityUrl),
    h2(`Pros & Considerations of Living in ${neighborhood}`),
    h3("Reasons Buyers May Consider"),
    ...(seed.reasons ?? []),
    h3("Things to Consider"),
    ...(seed.considerations ?? []),
    ...schoolsBlock(neighborhood, district),
    ...seed.closing,
    ...seeHomesBlock(neighborhood, city, stateAbbr, nUrl, cityUrl),
    ...youtubeBlock(city, stateAbbr),
    ...workWithJamieBlock(),
  ];
}

type SeoCheck = { label: string; pass: boolean; detail: string };

// Per the client's real Writing Voice & Style Guide: avoid hype/AI filler words,
// and never frame content around who a neighborhood is "for" (Fair Housing).
const BANNED_PHRASES = [
  "nestled in",
  "boasts",
  "hidden gem",
  "dream home",
  "something for everyone",
  "perfect for",
  "family-friendly",
  "highly sought-after",
  "idyllic",
  "picturesque",
  "sanctuary",
  "stunning",
  "amazing",
  "incredible",
  "gorgeous",
  "spectacular",
  "vibrant community",
  "breathtaking",
  "endless opportunities",
  "perfect blend",
  "ideal for",
  "great for",
  "best schools",
  "safe neighborhood",
  "good for kids",
  "haven",
];

function findBannedPhrase(text: string): string | null {
  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re =
      phrase === "haven"
        ? /\bhaven\b(?!['’]t)/
        : new RegExp(`\\b${escaped}\\b`, "i");
    if (re.test(lower)) return phrase;
  }
  return null;
}

function seoChecklist(post: Post): SeoCheck[] {
  const descLen = post.metaDescription.length;
  const paragraphs = articleParagraphs(post);
  const wordCount = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  const areaCore = post.area.split(",")[0].trim();
  const titleHasArea = post.title.toLowerCase().includes(areaCore.toLowerCase());
  const fullText = `${post.title} ${post.metaDescription} ${paragraphs.join(" ")}`;
  const bannedHit = findBannedPhrase(fullText);
  const hasWhoFraming =
    /\bwho (buys|should|actually|thrives)\b|attracts\b[^.]{0,40}buyers\b|right for you\b/i.test(
      `${post.title} ${paragraphs.join(" ")}`
    );
  const hasPriceRange = /\$\d/.test(fullText);
  const followsTitleFormat = /^Moving to .+\? Consider .+: .+/.test(post.title);
  const hasRealNeighborhoodLink = !!NEIGHBORHOOD_URLS[post.area];

  return [
    {
      label: "Required title format",
      pass: followsTitleFormat,
      detail: followsTitleFormat
        ? "Follows \"Moving to {City}? Consider {Neighborhood}: {hook}\""
        : "Title doesn't follow the required \"Moving to {City}? Consider {Neighborhood}: {hook}\" format",
    },
    {
      label: "Meta description length",
      pass: descLen >= 110 && descLen <= 160,
      detail: `${descLen} characters (aim for 110–160)`,
    },
    {
      label: "Neighborhood in title",
      pass: titleHasArea,
      detail: titleHasArea
        ? `"${areaCore}" appears in the title`
        : `"${areaCore}" is missing from the title`,
    },
    {
      label: "Content length",
      pass: wordCount >= 120,
      detail: `${wordCount} words (aim for 120+ for a short-form post)`,
    },
    {
      label: "Real neighborhood search link",
      pass: hasRealNeighborhoodLink,
      detail: hasRealNeighborhoodLink
        ? "Verified neighborhood search URL is in place"
        : "Still pending — using the city-wide search as a placeholder until the VA verifies a real neighborhood URL",
    },
    {
      label: "No home-price ranges",
      pass: !hasPriceRange,
      detail: hasPriceRange
        ? "A dollar figure was found — the SOP requires directing readers to the live search instead of publishing a price range"
        : "No price ranges — readers are pointed to the live search instead",
    },
    {
      label: "Neutral, hype-free language",
      pass: !bannedHit,
      detail: bannedHit
        ? `Avoid "${bannedHit}" — flagged by the voice guide's banned-phrase list`
        : "No flagged hype words found",
    },
    {
      label: "Fair Housing-neutral framing",
      pass: !hasWhoFraming,
      detail: hasWhoFraming
        ? `Describe objective features, not who the neighborhood is "for"`
        : "Framed around objective features, not buyer type",
    },
  ];
}

function buildSeedData(): Post[] {
  // Calendar-date arithmetic done entirely against Pacific's Y/M/D, using UTC-constructed
  // dates purely as a neutral scratch space so browser-local timezone never enters into it —
  // see the PACIFIC_TZ helpers above.
  const todayPacific = pacificDateParts(new Date());
  const todayUTCNoon = new Date(Date.UTC(todayPacific.year, todayPacific.month, todayPacific.day, 12));
  const todayDow = todayUTCNoon.getUTCDay();
  const mondayUTCNoon = new Date(todayUTCNoon);
  mondayUTCNoon.setUTCDate(todayUTCNoon.getUTCDate() - ((todayDow + 6) % 7));

  const posts: Post[] = [];
  const useCount: Record<string, number> = {};
  AREAS.forEach((a) => (useCount[a[0]] = 0));
  let id = 1;

  for (let d = 0; d < ROTATION.length; d++) {
    const date = new Date(mondayUTCNoon);
    date.setUTCDate(mondayUTCNoon.getUTCDate() + d);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
    const dateLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    ROTATION[d].forEach((areaIdx, slot) => {
      const [areaName] = AREAS[areaIdx];
      const n = useCount[areaName];
      const seed = TITLES[areaName][n];
      useCount[areaName]++;
      const city = areaName.split(",")[1].trim();
      posts.push({
        id: "p" + id++,
        date: dateLabel,
        day: dayName,
        time: TIME_SLOTS[slot],
        area: areaName,
        areaUrl: NEIGHBORHOOD_URLS[areaName] ?? CITY_URLS[city],
        title: seedTitle(areaName, seed),
        keyword: seed.keyword,
        metaDescription: seed.metaDescription,
        variant: seed.variant,
        status: "Drafted",
        platforms: {
          gbp: "Not Started",
          w1: "Not Started",
          w2: "Not Started",
          li: "Not Started",
          fb: "Not Started",
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
    let areaFiltersOpen = false;
    let checklistOpen = false;

    function el<T extends HTMLElement>(id: string): T {
      return document.getElementById(id) as T;
    }

    async function loadData() {
      try {
        const res = await fetch("/api/board", { cache: "no-store" });
        const data = await res.json();
        if (data && Array.isArray(data.posts) && data.posts.length) {
          // Backfill any platform keys added after these posts were first saved
          // (e.g. "fb") without touching existing progress on older keys.
          let migrated = false;
          boardData = data.posts.map((p: Post) => {
            if (p.platforms.fb !== undefined) return p;
            migrated = true;
            return { ...p, platforms: { ...p.platforms, fb: "Not Started" as Status } };
          });

          // Backfill the stable `variant` pointer, and repair the 14 posts whose content
          // went stale when their PostSeed was rewritten before this field existed (see
          // STALE_TITLE_VARIANTS). Leaves id/date/day/time/status/statusChangedAt/platforms
          // untouched — only title/keyword/metaDescription/variant are ever corrected here.
          boardData = boardData.map((p) => {
            if (p.variant) return p;
            const titles = TITLES[p.area];
            if (!titles) return p;

            const liveIdx = titles.findIndex((s) => seedTitle(p.area, s) === p.title);
            if (liveIdx !== -1) {
              migrated = true;
              return { ...p, variant: titles[liveIdx].variant };
            }

            const staleVariant = STALE_TITLE_VARIANTS[p.title];
            const seed = staleVariant && titles.find((s) => s.variant === staleVariant);
            if (seed) {
              migrated = true;
              return {
                ...p,
                title: seedTitle(p.area, seed),
                keyword: seed.keyword,
                metaDescription: seed.metaDescription,
                variant: seed.variant,
              };
            }

            return p; // unrecognized title (e.g. an auto-spawned "New post needed for X" placeholder)
          });

          // Additive migration: if new areas were added to AREAS after this board was
          // first seeded, append fresh Drafted posts for just those areas — never touch
          // or renumber existing posts, so real progress/status/timestamps are preserved.
          const existingAreas = new Set(boardData.map((p) => p.area));
          const missingAreaNames = new Set(
            AREAS.map((a) => a[0]).filter((name) => !existingAreas.has(name))
          );
          if (missingAreaNames.size) {
            const fullSeed = buildSeedData();
            let nextId =
              1 + Math.max(0, ...boardData.map((p) => parseInt(p.id.slice(1), 10) || 0));
            const newPosts = fullSeed
              .filter((p) => missingAreaNames.has(p.area))
              .map((p) => ({ ...p, id: "p" + nextId++ }));
            boardData = [...boardData, ...newPosts];
            migrated = true;
          }

          if (migrated) await saveData();
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
      const chip = (a: string) =>
        `<button class="chip ${a === activeArea ? "active" : ""}" data-area="${a}">${a}</button>`;

      const groups = STATE_ORDER.map((st) => {
        const names = AREAS.map((a) => a[0]).filter((name) => AREA_STATE[name] === st);
        if (!names.length) return "";
        return `<span class="area-state-label">${STATE_LABEL[st]}</span>${names.map(chip).join("")}`;
      }).join("");

      const areaFiltersEl = el<HTMLDivElement>("areaFilters");
      areaFiltersEl.hidden = !areaFiltersOpen;
      areaFiltersEl.innerHTML = areaFiltersOpen ? `${chip("All")}${groups}` : "";

      const toggle = el<HTMLButtonElement>("areaFiltersToggle");
      toggle.classList.toggle("active", areaFiltersOpen);
      toggle.textContent =
        (activeArea !== "All" ? `Neighborhood: ${activeArea}` : "Neighborhood") +
        (areaFiltersOpen ? " ▴" : " ▾");
      toggle.onclick = () => {
        areaFiltersOpen = !areaFiltersOpen;
        renderFilters();
      };

      document.querySelectorAll<HTMLButtonElement>("#dayFilters .chip").forEach((btn) => {
        btn.onclick = () => {
          activeDay = btn.dataset.day!;
          renderAll();
        };
      });
      document.querySelectorAll<HTMLButtonElement>("#areaFilters .chip").forEach((btn) => {
        btn.onclick = () => {
          activeArea = btn.dataset.area!;
          areaFiltersOpen = true;
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

    // Sets a post to Published and drops a fresh "Not started" placeholder for the same
    // neighborhood, so it's obvious at a glance which ones need new content drafted next.
    // Mutates `post`/`boardData` only — caller is responsible for saveData()/renderAll().
    function applyPublish(post: Post) {
      post.status = "Published";
      post.statusChangedAt = new Date().toISOString();
      const nextId =
        "p" + (1 + Math.max(0, ...boardData.map((p) => parseInt(p.id.slice(1), 10) || 0)));
      const today = new Date();
      const neighborhood = post.area.split(",")[0].trim();
      boardData.push({
        id: nextId,
        date: pacificDateLabel(today),
        day: pacificWeekdayName(today),
        time: post.time,
        area: post.area,
        areaUrl: post.areaUrl,
        title: `New post needed for ${neighborhood}`,
        keyword: "",
        metaDescription: "",
        status: "Not Started",
        platforms: {
          gbp: "Not Started",
          w1: "Not Started",
          w2: "Not Started",
          li: "Not Started",
          fb: "Not Started",
        },
      });
    }

    async function moveStatus(post: Post, newStatus: Status) {
      if (post.status === newStatus) return;
      if (newStatus === "Published") {
        applyPublish(post);
      } else {
        post.status = newStatus;
        post.statusChangedAt = new Date().toISOString();
      }
      await saveData();
      renderAll();
      if (modalPostId === post.id) renderModal(post.id);
    }

    function formatForDateTimeInput(d: Date): string {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    // Sets a post's display date/day/time from a real chosen moment — once Scheduled, these
    // fields mean "when this is actually scheduled to go live," not just the day it was
    // originally seeded on, which is what makes the auto-publish check meaningful.
    function applyScheduleDateTime(post: Post, dateTimeLocalValue: string) {
      // The native picker returns a naive local wall-clock string (no timezone attached),
      // so `new Date(...)` correctly resolves it to a real instant using the browser's own
      // timezone — that part is accurate regardless of where the person scheduling is. What
      // we display/store afterward is then always reformatted in Pacific for consistency.
      const d = new Date(dateTimeLocalValue);
      if (isNaN(d.getTime())) return;
      post.date = pacificDateLabel(d);
      post.day = pacificWeekdayName(d);
      post.time = pacificTimeLabel(d);
    }

    // Wires a status <select> so picking "Scheduled" prompts for a real date/time via a
    // native datetime-local picker before the status actually changes — otherwise a
    // Scheduled post just keeps whatever date/time it happened to be seeded with, which is
    // often already in the past and makes the "auto-publish once due" rule meaningless.
    function wireStatusSelect(selectEl: HTMLSelectElement, postId: string) {
      const dateInput = document.createElement("input");
      dateInput.type = "datetime-local";
      dateInput.className = "schedule-datetime-input";
      dateInput.hidden = true;
      selectEl.insertAdjacentElement("afterend", dateInput);

      selectEl.addEventListener("change", (e) => {
        e.stopPropagation();
        const p = boardData.find((x) => x.id === postId);
        if (!p) return;
        const newStatus = selectEl.value as Status;
        if (newStatus === "Scheduled") {
          // Default to tomorrow 9:00 AM Pacific — computed from Pacific's own "today" so the
          // suggestion is correct even if the visitor's browser is in a different timezone.
          const todayPacific = pacificDateParts(new Date());
          const fallback = pacificComponentsToDate(
            todayPacific.year,
            todayPacific.month,
            todayPacific.day + 1,
            9,
            0
          );
          dateInput.value = formatForDateTimeInput(fallback);
          dateInput.hidden = false;
          const withPicker = dateInput as HTMLInputElement & { showPicker?: () => void };
          try {
            withPicker.showPicker?.();
          } catch {
            dateInput.focus();
          }
          return; // wait for the datetime-local input's own change before committing
        }
        dateInput.hidden = true;
        void moveStatus(p, newStatus);
      });

      dateInput.addEventListener("click", (e) => e.stopPropagation());
      dateInput.addEventListener("change", (e) => {
        e.stopPropagation();
        const p = boardData.find((x) => x.id === postId);
        if (!p) return;
        if (!dateInput.value) {
          selectEl.value = p.status; // no date chosen — revert the visual selection
          dateInput.hidden = true;
          return;
        }
        applyScheduleDateTime(p, dateInput.value);
        dateInput.hidden = true;
        void moveStatus(p, "Scheduled");
      });
    }

    // A Scheduled post's date/time is just a display string (no year, e.g. "Sep 21" +
    // "9:00 AM") — reconstruct it against the current year, which is fine since nothing on
    // this board spans a year boundary. Parsed as Pacific wall-clock explicitly (not via
    // `new Date(string)`, which would interpret it using the visitor's own browser
    // timezone) so "9:00 AM" always means 9:00 AM Pacific for everyone, everywhere.
    function parsePostDateTime(post: Post): Date | null {
      const dateMatch = post.date.match(/^([A-Za-z]{3})\s+(\d{1,2})$/);
      const timeMatch = post.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!dateMatch || !timeMatch) return null;
      const month = MONTH_NAMES.indexOf(dateMatch[1]);
      if (month === -1) return null;
      const day = Number(dateMatch[2]);
      let hour = Number(timeMatch[1]) % 12;
      if (/pm/i.test(timeMatch[3])) hour += 12;
      const minute = Number(timeMatch[2]);
      const year = pacificDateParts(new Date()).year;
      return pacificComponentsToDate(year, month, day, hour, minute);
    }

    // Scheduled posts whose date/time has passed auto-publish, exactly like a manual
    // publish (including the "Not started" placeholder rule) — the VA shouldn't have to
    // remember to flip the status by hand once the scheduled moment arrives.
    //
    // This runs on a recurring interval (see init() below) for as long as a tab stays open,
    // which used to be a real data-loss risk: a tab left open since before a deploy holds a
    // stale in-memory boardData, and once its interval found a locally-due post it would
    // save that ENTIRE stale snapshot back to the server — silently reverting anything added
    // server-side since the tab was last loaded (confirmed happening in production: a
    // long-open tab's auto-publish tick wiped a same-day content expansion). Re-fetching the
    // latest server state right before checking for due posts closes that window — the tab
    // can still be stale between ticks, but it never overwrites newer data, only ever adds
    // its own status change on top of whatever is actually current.
    async function autoPublishDuePosts() {
      try {
        const res = await fetch("/api/board", { cache: "no-store" });
        const data = await res.json();
        if (data && Array.isArray(data.posts) && data.posts.length) {
          boardData = data.posts;
        }
      } catch {
        // fall through and check whatever's currently in memory
      }

      const now = new Date();
      const due = boardData.filter((p) => {
        if (p.status !== "Scheduled") return false;
        const dt = parsePostDateTime(p);
        return dt !== null && dt <= now;
      });
      if (!due.length) {
        renderAll();
        return;
      }
      due.forEach(applyPublish);
      await saveData();
      renderAll();
      if (modalPostId && due.some((p) => p.id === modalPostId)) renderModal(modalPostId);
    }

    function formatMovedAt(iso: string): string {
      return new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: PACIFIC_TZ,
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
      wireStatusSelect(select, post.id);

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

    function renderChecklist() {
      const postedAreas = new Set(
        boardData.filter((p) => p.status === "Published").map((p) => p.area)
      );
      const doneCount = AREAS.filter(([name]) => postedAreas.has(name)).length;
      const allDone = doneCount === AREAS.length;

      const checklistItem = (name: string) => {
        const done = postedAreas.has(name);
        return `<span class="checklist-item ${done ? "done" : ""}"><span class="checklist-dot">${done ? "✓" : ""}</span>${name}</span>`;
      };

      const groups = checklistOpen
        ? STATE_ORDER.map((st) => {
            const names = AREAS.map((a) => a[0]).filter((name) => AREA_STATE[name] === st);
            if (!names.length) return "";
            const groupDone = names.filter((n) => postedAreas.has(n)).length;
            return `
              <div class="checklist-state-group">
                <span class="checklist-state-label">${STATE_LABEL[st]} · ${groupDone}/${names.length}</span>
                <div class="checklist-items">${names.map(checklistItem).join("")}</div>
              </div>
            `;
          }).join("")
        : "";

      el<HTMLDivElement>("checklist").innerHTML = `
        <button class="checklist-header" id="checklistToggle">
          <span class="checklist-title">Neighborhood rotation checklist ${checklistOpen ? "▴" : "▾"}</span>
          <span class="checklist-count ${allDone ? "checklist-count-done" : ""}">${doneCount}/${AREAS.length} posted this cycle</span>
        </button>
        ${allDone ? `<div class="checklist-banner">Every neighborhood has been posted — the next post starts a new cycle back at ${AREAS[0][0]}.</div>` : ""}
        ${groups}
      `;

      el<HTMLButtonElement>("checklistToggle").onclick = () => {
        checklistOpen = !checklistOpen;
        renderChecklist();
      };
    }

    function renderAll() {
      renderStats();
      renderFilters();
      renderLegend();
      renderChecklist();
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

      const checks = seoChecklist(post);
      const passCount = checks.filter((c) => c.pass).length;

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
          <div class="modal-meta-desc">${post.metaDescription}</div>
          <a class="card-link" href="${post.areaUrl}" target="_blank" rel="noopener">${post.areaUrl}</a>

          <div class="modal-section-label">SEO check · ${passCount}/${checks.length}</div>
          <ul class="seo-checklist">
            ${checks
              .map(
                (c) =>
                  `<li class="${c.pass ? "seo-pass" : "seo-warn"}"><span class="seo-icon">${c.pass ? "✓" : "!"}</span><span><strong>${c.label}</strong> — ${c.detail}</span></li>`
              )
              .join("")}
          </ul>

          <div class="modal-article">
            ${articleParagraphs(post)
              .map((p) => {
                if (p.startsWith("### ")) return `<h4 class="article-h3">${p.slice(4)}</h4>`;
                if (p.startsWith("## ")) return `<h3 class="article-h2">${p.slice(3)}</h3>`;
                return `<p>${p}</p>`;
              })
              .join("")}
          </div>
          <div class="modal-section-label">Pipeline stage</div>
          <div class="card-footer">
            <select class="card-status-select" id="modalStatusSelect" title="Move to a different stage">${statusOptions}</select>
            ${post.statusChangedAt ? `<span class="card-moved">Moved ${formatMovedAt(post.statusChangedAt)}</span>` : ""}
          </div>
          <div class="modal-section-label">Publishing status</div>
          <div class="platform-row">${platRow}</div>
          <button class="delete-post-btn" id="deletePostBtn">Delete this card</button>
        </div>
      `;

      const modalSelect = el<HTMLSelectElement>("modalStatusSelect");
      wireStatusSelect(modalSelect, post.id);

      el<HTMLButtonElement>("deletePostBtn").addEventListener("click", async () => {
        if (
          !window.confirm(
            `Delete "${post.title}" permanently? This can't be undone.`
          )
        ) {
          return;
        }
        boardData = boardData.filter((p) => p.id !== post.id);
        await saveData();
        closeModal();
        renderAll();
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
      await autoPublishDuePosts();
      renderAll();
    })();

    // Catch posts whose scheduled time passes while the board stays open, not just on load.
    const autoPublishInterval = setInterval(() => {
      autoPublishDuePosts();
    }, 60000);

    return () => {
      resetBtn.removeEventListener("click", onReset);
      modalOverlay.removeEventListener("click", onOverlayClick);
      modalClose.removeEventListener("click", closeModal);
      document.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = "";
      clearInterval(autoPublishInterval);
    };
  }, []);

  return null;
}
