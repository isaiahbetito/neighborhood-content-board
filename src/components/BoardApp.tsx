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

// Real, verified property-search URLs from the client's own "WASHINGTON CITY LINKS" doc.
const CITY_URLS: Record<string, string> = {
  Camas: "https://jamiemeushawrealestate.com/properties/city-Camas,%20WA/",
  Vancouver: "https://jamiemeushawrealestate.com/properties/city-Vancouver,%20WA/",
};

// Per the official SOP, a real neighborhood search URL must be generated + tested via the
// live property search on jamiemeushawrealestate.com (requires an account the VA doesn't
// have yet as of 2026-09-23). Only Holly Ridge is confirmed real, from the client's own
// "Final Blog Example" doc. The rest stay null — render a clearly-marked pending placeholder
// rather than guessing a bounding box, which the master prompt explicitly forbids.
const NEIGHBORHOOD_URLS: Record<string, string | null> = {
  "Holly Ridge, Camas":
    "https://jamiemeushawrealestate.com/properties/neighborhood-Holly%20Ridge,%20Camas,%20WA/?box=-122.44137717237012%2C45.603188674527445%2C-122.43877191994316%2C45.60472275603769",
  "Lakeshore, Vancouver": null,
  "Pleasant Valley, Vancouver": null,
  "Hunter Ridge Estates, Camas": null,
  "Columbia Way, Vancouver": null,
  "Deer Creek, Camas": null,
  "Harney Heights, Vancouver": null,
};

const SCHOOL_DISTRICTS: Record<string, string> = {
  "Holly Ridge, Camas": "Camas School District",
  "Lakeshore, Vancouver": "Vancouver Public Schools",
  "Pleasant Valley, Vancouver": "Vancouver Public Schools",
  "Hunter Ridge Estates, Camas": "Camas School District",
  "Columbia Way, Vancouver": "Vancouver Public Schools",
  "Deer Creek, Camas": "Camas School District",
  "Harney Heights, Vancouver": "Vancouver Public Schools",
};

const YOUTUBE_URL = "https://www.youtube.com/@JamieMeushaw";
const CALENDLY_URL = "https://calendly.com/jamiemeushawrealestate";
const CONTACT_PHONE = "(360) 798-7127";
const CONTACT_EMAIL = "jamie@jamiemeushawrealestate.com";
const WEBSITE_URL = "https://www.jamiemeushawrealestate.com";
const SCHOOL_DISCLAIMER =
  "School boundaries and assignments can change. Buyers should verify current school assignments directly with the school district.";

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
  nUrl: string | null,
  cUrl: string
): string[] {
  return [
    h2("Explore Homes for Sale"),
    neighborhoodLinkLine(`View homes for sale in ${neighborhood}`, nUrl),
    cityLinkLine(`View all homes for sale in ${city}, WA`, cUrl),
    "Inventory and pricing change quickly — these links show what's currently on the market rather than numbers from when this was written.",
  ];
}

function seeHomesBlock(
  neighborhood: string,
  city: string,
  nUrl: string | null,
  cUrl: string
): string[] {
  return [
    h2(`See Homes in ${neighborhood}`),
    neighborhoodLinkLine(`View homes currently for sale in ${neighborhood}`, nUrl),
    cityLinkLine(`View all homes for sale in ${city}, WA`, cUrl),
    "Don't see the right home? Inventory in individual neighborhoods can be limited — nearby neighborhoods with similar homes, locations and amenities are often worth a look too.",
  ];
}

function youtubeBlock(city: string): string[] {
  return [
    h2(`Moving to ${city}, WA or the Surrounding Area?`),
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
  return `Moving to ${city}, WA? Consider ${neighborhood}: ${seed.hook}`;
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
      hook: "Market Pulse: Tight Inventory, Fast-Moving Listings",
      keyword: "Holly Ridge Camas market update",
      metaDescription:
        "A market update on Holly Ridge in Camas, WA — how quickly listings have been moving and what's drawing buyer interest right now.",
      variant: "update",
      intro: [
        "Inventory in Holly Ridge has stayed tight, and well-priced listings haven't been sitting long. Here's a quick read on what's been happening in this part of Camas.",
      ],
      marketNotes: [
        "Townhome-style listings have generally moved fastest, often going under contract within a couple of weeks of hitting the market.",
        "Larger single-family homes backed to Prune Hill greenspace have drawn steady interest, especially from buyers relocating from out of state who ask early about lake access.",
        "Because Holly Ridge doesn't have a high volume of listings in a typical month, having financing in place before a home hits the market — rather than after — tends to matter more here than in larger subdivisions.",
      ],
      closing: [
        "If you're watching this neighborhood, it's worth setting up an alert now rather than waiting until something is already pending.",
      ],
    },
    {
      hook: "What to Weigh Before You Buy",
      keyword: "living in Holly Ridge Camas",
      metaDescription:
        "What to weigh before buying in Holly Ridge, Camas — home age, lot differences and the tradeoffs worth thinking through first.",
      variant: "considerations",
      intro: [
        "Holly Ridge is worth a serious look for a lot of relocation buyers, but like any established neighborhood, it comes with some tradeoffs worth thinking through before you tour.",
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
        "The best next step is usually seeing two or three homes in person. Listing photos don't always capture how the greenspace backing feels from the back deck, and that's often the detail that changes people's minds.",
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
      hook: "Market Update: Inventory & Demand Near the Lake",
      keyword: "Lakeshore Vancouver home prices",
      metaDescription:
        "A market update on Lakeshore in Vancouver, WA — current inventory near Vancouver Lake and what's driving buyer demand.",
      variant: "update",
      intro: [
        "Inventory near Vancouver Lake has stayed tight this season. Here's a quick read on what's been driving interest in Lakeshore.",
      ],
      marketNotes: [
        "Homes with park access and larger lots don't come up for sale often, and well-priced listings tend to go under contract quickly when they do.",
        "Buyers looking specifically for water-adjacent living in Clark County often land on Lakeshore, since property directly on the Columbia River typically costs significantly more — Lakeshore offers a related lifestyle at a different price point.",
        "Homes here tend to move fastest in spring and early summer, when park access matters most to people touring on weekends. Off-season listings still sell, usually with less competition.",
      ],
      closing: [
        "If Lakeshore is on your list, it's worth setting up an alert now rather than waiting until something is already pending.",
      ],
    },
    {
      hook: "What to Weigh Before You Buy",
      keyword: "living in Lakeshore Vancouver WA",
      metaDescription:
        "What to weigh before buying in Lakeshore, Vancouver — commute distance, home age and lot size, explained clearly.",
      variant: "considerations",
      intro: [
        "Lakeshore has real advantages, but like any neighborhood it comes with tradeoffs worth thinking through before you commit to touring homes there.",
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
        "The best next step is usually touring a few homes in person to see how these tradeoffs feel firsthand.",
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
      hook: "Acreage Listings: What's Available Now",
      keyword: "Pleasant Valley new listings",
      metaDescription:
        "What's currently available on acreage in Pleasant Valley, Vancouver, plus what to check before buying land here.",
      variant: "update",
      intro: [
        "Acreage listings in Pleasant Valley move differently than standard subdivision homes. Here's what's been happening lately.",
      ],
      marketNotes: [
        "Buyers often take longer to decide on acreage, but once they do, there usually isn't much room to negotiate since there aren't many comparable properties to weigh against each other.",
        "Newer construction on larger lots has drawn the most interest this season, especially from buyers coming from tighter urban lots who want more room without leaving Clark County.",
        "Well and septic systems, easement access and zoning for accessory structures are worth checking early on any acreage listing — easier to sort out before you're under contract than after.",
      ],
      closing: [
        "If acreage is on your list, it helps to widen the search radius slightly and set up an alert for new Pleasant Valley listings.",
      ],
    },
    {
      hook: "Pros and Cons to Weigh",
      keyword: "Pleasant Valley Vancouver living",
      metaDescription:
        "The honest tradeoffs to weigh before buying in Pleasant Valley, Vancouver — space, commute time and walkability.",
      variant: "considerations",
      intro: [
        "Pleasant Valley has real advantages for buyers who want space, but it comes with tradeoffs worth being upfront about.",
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
        "If space and land matter more to you than being close to shops and restaurants, Pleasant Valley deserves a serious look.",
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
      hook: "Where the Luxury Market Stands Right Now",
      keyword: "Hunter Ridge Estates luxury homes Camas",
      metaDescription:
        "A look at where Camas's luxury real estate market stands right now, including current inventory in Hunter Ridge Estates.",
      variant: "update",
      intro: [
        "Luxury inventory in Camas stays limited by nature, and Hunter Ridge Estates is usually the first place buyers look when they want gated and elevated. Here's a quick read on where things stand.",
      ],
      marketNotes: [
        "There simply aren't many comparable listings anywhere else in Camas, so this community tends to set its own pace rather than following broader city trends closely.",
        "View lots with a clear line toward Mount Hood tend to draw the most attention relative to interior lots in the same community.",
        "Buyers shopping this tier are often comparing Hunter Ridge Estates against similar gated communities across the broader Portland metro area.",
      ],
      closing: [
        "If you're shopping in this range, it's worth asking to see new listings before they're public — that's usually how the best opportunities here move.",
      ],
    },
    {
      hook: "Is the Space and Privacy Worth the Tradeoffs?",
      keyword: "Hunter Ridge Estates Camas review",
      metaDescription:
        "What buying in Hunter Ridge Estates actually involves, compared with the rest of the Camas real estate market.",
      variant: "considerations",
      intro: [
        "Hunter Ridge Estates is a distinct option within Camas, and whether it's worth the tradeoffs really depends on what matters most to you.",
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
        "If daily walkability to the lake or local shops is important to you, homes in Holly Ridge or Deer Creek offer more of that at a different price point. Hunter Ridge Estates is built around space and separation instead.",
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
      hook: "Condo & Townhome Market: What's Selling",
      keyword: "Columbia Way condos for sale",
      metaDescription:
        "What's currently selling in the Columbia Way condo and townhome market near downtown Vancouver's waterfront district right now.",
      variant: "update",
      intro: [
        "Newer condo and townhome product along Columbia Way continues to draw buyers who work in Portland but want Washington's tax advantage without giving up a walkable, river-adjacent location. Here's what's been moving.",
      ],
      marketNotes: [
        "Units closest to the waterfront trail and downtown Vancouver's restaurant row tend to sell fastest, often within two to three weeks.",
        "Older single-family homes set further from the river typically take longer to sell than the newer condo product.",
        "This stretch turns over quickly enough that waiting even a week on a new listing can mean missing the best units.",
      ],
      closing: [
        "If a downtown-adjacent, low-maintenance option is what you're after, it's worth setting up an alert for new Columbia Way listings now.",
      ],
    },
    {
      hook: "What Daily Life Here Actually Involves",
      keyword: "living in Columbia Way Vancouver",
      metaDescription:
        "What daily life in Columbia Way actually involves, from parking to walkability, before you make an offer here.",
      variant: "considerations",
      intro: [
        "Columbia Way's walkability is a real draw, but it's worth understanding what daily life here actually involves before you make an offer.",
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
        "The best way to know if it fits is to walk the area at different times of day — weekday mornings look very different from a Saturday afternoon along the waterfront trail.",
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
      hook: "Inventory Update: What's on the Market",
      keyword: "Deer Creek Camas listings",
      metaDescription:
        "Current inventory and buyer interest in the Deer Creek, Camas real estate market, and what tends to draw attention here.",
      variant: "update",
      intro: [
        "Deer Creek doesn't turn over as quickly as some of the more visible Camas neighborhoods. Here's a quick read on what's been happening.",
      ],
      marketNotes: [
        "When a well-kept home does list here, it tends to draw serious buyers rather than lookers, and listings have been going pending within the first weekend.",
        "Demand has held fairly steady relative to the broader Camas Meadows area, largely because it's a quieter address without direct lake frontage or greenspace backing on every lot.",
        "Listings here tend to get more attention than the neighborhood's overall visibility would suggest.",
      ],
      closing: [
        "If wooded and quiet is what you're after, it's worth setting up an alert specifically for this neighborhood.",
      ],
    },
    {
      hook: "What to Know Before You Buy",
      keyword: "Deer Creek Camas buyers guide",
      metaDescription:
        "What to know before buying in Deer Creek, Camas — home age, lot sizes and how it compares to nearby neighborhoods.",
      variant: "considerations",
      intro: [
        "Deer Creek is more of a step-up neighborhood than a typical starting point, and it's worth understanding a few things before you start touring.",
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
        "The best way to get a feel for Deer Creek is to drive the streets at different times of day. It's a different pace than the busier corridors nearby, and that's easier to sense in person than in photos.",
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
      hook: "Market Pulse: Quiet Area, Steady Demand",
      keyword: "Harney Heights Vancouver market update",
      metaDescription:
        "Current market conditions in Harney Heights, Vancouver — how quickly homes have been selling and why inventory stays low.",
      variant: "update",
      intro: [
        "Harney Heights doesn't generate the listing volume of the bigger east-Vancouver developments, but that scarcity tends to work in sellers' favor. Here's a quick read on what's been happening.",
      ],
      marketNotes: [
        "Homes here have been going under contract fairly quickly when priced in line with recent comparable sales.",
        "Buyers coming from outside the immediate area are often surprised by how much house their budget covers here compared to newer subdivisions closer to I-205 — that value gap has been the main driver of demand lately.",
        "Because so few homes list here in a given month, buyers who are serious about the area tend to move fast once something hits the market.",
      ],
      closing: [
        "If you want a heads-up the moment something lists in Harney Heights, that's easy to set up — just reach out.",
      ],
    },
    {
      hook: "What to Know Before You Buy",
      keyword: "Harney Heights Vancouver buyers guide",
      metaDescription:
        "What to know before buying in Harney Heights, Vancouver — home condition, HOA structure and price comparisons nearby.",
      variant: "considerations",
      intro: [
        "Harney Heights is an older, established neighborhood, which means real character but also a few things worth knowing before you buy.",
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
        "The best way to judge Harney Heights is to walk a few blocks and see a couple of homes in person — it rewards buyers who take the time to look closely.",
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
  return titles ? titles.findIndex((s) => seedTitle(post.area, s) === post.title) : -1;
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
  const cityUrl = CITY_URLS[city];
  const nUrl = NEIGHBORHOOD_URLS[post.area] ?? null;
  const district = SCHOOL_DISTRICTS[post.area];

  if (seed.variant === "guide") {
    return [
      ...seed.intro,
      ...exploreHomesBlock(neighborhood, city, nUrl, cityUrl),
      h2(`What Is It Like Living in ${neighborhood} in ${city}, WA?`),
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
      h2(`Should You Consider ${neighborhood} if You're Moving to ${city}, WA?`),
      ...seed.closing,
      ...seeHomesBlock(neighborhood, city, nUrl, cityUrl),
      ...youtubeBlock(city),
      ...workWithJamieBlock(),
    ];
  }

  if (seed.variant === "update") {
    return [
      ...seed.intro,
      ...exploreHomesBlock(neighborhood, city, nUrl, cityUrl),
      h2(`${neighborhood} Market Notes`),
      ...(seed.marketNotes ?? []),
      ...seed.closing,
      ...seeHomesBlock(neighborhood, city, nUrl, cityUrl),
      ...youtubeBlock(city),
      ...workWithJamieBlock(),
    ];
  }

  return [
    ...seed.intro,
    ...exploreHomesBlock(neighborhood, city, nUrl, cityUrl),
    h2(`Pros & Considerations of Living in ${neighborhood}`),
    h3("Reasons Buyers May Consider"),
    ...(seed.reasons ?? []),
    h3("Things to Consider"),
    ...(seed.considerations ?? []),
    ...schoolsBlock(neighborhood, district),
    ...seed.closing,
    ...seeHomesBlock(neighborhood, city, nUrl, cityUrl),
    ...youtubeBlock(city),
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
