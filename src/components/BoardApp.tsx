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

type PostSeed = {
  title: string;
  keyword: string;
  metaDescription: string;
  paragraphs: string[];
};

const TITLES: Record<string, PostSeed[]> = {
  "Holly Ridge, Camas": [
    {
      title: "Why Buyers Keep Circling Back to Holly Ridge in Camas",
      keyword: "Holly Ridge Camas homes for sale",
      metaDescription:
        "A look at Holly Ridge, Camas — home prices, the Prune Hill greenspace, and what buyers should know about this Camas Meadows neighborhood.",
      paragraphs: [
        "Holly Ridge sits in the Camas Meadows area, between Prune Hill and Lacamas Lake. It's a name that comes up a lot when I talk with buyers about Camas. Most have either driven through it already or heard about it from someone who lives there.",
        "The homes here cover a wide range. Three-bedroom townhomes start in the upper $400s. Larger single-family homes with daylight basements and bonus rooms run up toward $700K. That range means different budgets end up on the same streets.",
        "Many homes back up to permanent Prune Hill greenspace, which gives the rear yards more privacy than you'll find in some newer subdivisions. The neighborhood is inside the Camas School District, with Skyridge Middle and Camas High in the normal feeder pattern — boundaries can change, so it's worth confirming directly with the district.",
        "SR-14 gets you into Portland in about 20 to 25 minutes outside of peak traffic, though it's worth checking your own commute during the hours you'd actually be driving. If you want to see what's currently listed here, I'm happy to send it over.",
      ],
    },
    {
      title: "Holly Ridge Market Pulse: What's Moving Right Now",
      keyword: "Holly Ridge Camas market update",
      metaDescription:
        "What's moving in the Holly Ridge, Camas real estate market right now, including current inventory and pricing trends.",
      paragraphs: [
        "Inventory in Holly Ridge has stayed tight through the second half of the year. Townhome-style listings in the upper $400s to low $500s tend to go first, often within two weeks of hitting the market.",
        "Larger single-family homes backed to Prune Hill greenspace have been getting the most attention lately. Buyers relocating from out of state often ask the same question first: how close is it to the lake? Depending on the street, it's usually walking distance.",
        "If you're watching this area, it helps to have financing in place before a listing hits rather than after. I'm glad to flag new Holly Ridge listings before they go public, or walk you through the latest numbers on a quick call. Just reach out and let me know what you're looking for.",
      ],
    },
    {
      title: "What to Know Before You Buy in Holly Ridge",
      keyword: "living in Holly Ridge Camas",
      metaDescription:
        "What to know before buying in Holly Ridge, Camas — home styles, lot sizes, and the tradeoffs worth thinking through first.",
      paragraphs: [
        "Holly Ridge is an established neighborhood, built mostly between the late 1990s and early 2000s. That means mature trees and settled landscaping, but it can also mean some homes need updating — kitchens and bathrooms in particular are worth a close look on a tour.",
        "Lot sizes vary by street, so if outdoor space matters to you, it's worth comparing a few addresses rather than assuming they're all similar. Homes backed to Prune Hill greenspace tend to have more privacy than interior lots.",
        "New construction isn't really part of the picture here — most of what's available is resale. If a fully updated, move-in-ready kitchen matters more than location, that's a tradeoff worth thinking through before you start touring.",
        "The best next step is usually seeing two or three homes in person. Listing photos don't always capture how the greenspace backing feels from the back deck, and that's often the detail that changes people's minds.",
      ],
    },
  ],
  "Lakeshore, Vancouver": [
    {
      title: "Lakeshore: Vancouver's Answer to Lake Living",
      keyword: "Lakeshore Vancouver WA homes",
      metaDescription:
        "A look at Lakeshore, Vancouver WA — homes near Vancouver Lake, typical lot sizes, and the commute in both directions, explained clearly.",
      paragraphs: [
        "Lakeshore sits in northwest Vancouver, close to Vancouver Lake. The appeal is straightforward: easy access to Vancouver Lake Regional Park and a paved trail system that turns an evening walk into an actual destination instead of a lap around the block.",
        "Homes here tend to be a bit older than the newer construction further east in Clark County. That keeps prices more approachable, and lots are generally larger, with more mature trees than you'll find in tighter subdivisions.",
        "The commute works in both directions on I-5 — north toward Salmon Creek, or south into downtown Vancouver and across into Portland. Actual drive times depend a lot on when you're on the road, so it's worth checking during your normal commute hours.",
        "If lake access and a bit more space are on your list, Lakeshore is worth a look. I can pull together what's currently available if you want a starting point.",
      ],
    },
    {
      title: "Lakeshore Market Update: Home Prices & Inventory",
      keyword: "Lakeshore Vancouver home prices",
      metaDescription:
        "Current home prices and inventory near Vancouver Lake, plus what's driving demand in the Lakeshore, Vancouver market.",
      paragraphs: [
        "Inventory near Vancouver Lake has been tight this season. Homes with park access and larger lots don't come up for sale often, and when they do, well-priced listings tend to go under contract quickly.",
        "Buyers looking specifically for water-adjacent living in Clark County often land on Lakeshore, since waterfront property directly on the Columbia typically costs significantly more. It's a way to get a similar lifestyle at a more reasonable price.",
        "Homes here tend to move fastest in spring and early summer, when park access matters most to people touring on weekends. Off-season listings still sell, usually with a bit less competition.",
        "If Lakeshore is on your list, it's worth setting up an alert now rather than waiting until something's already pending. I'm happy to get that started.",
      ],
    },
    {
      title: "Lakeshore: What to Weigh Before You Buy",
      keyword: "living in Lakeshore Vancouver WA",
      metaDescription:
        "What to weigh before buying in Lakeshore, Vancouver — commute distance, home age, lot size, and nearby school access, explained.",
      paragraphs: [
        "Lakeshore is a longer drive into downtown Vancouver than some of the more central neighborhoods, like Columbia Way or Harney Heights. If a short commute matters more than lake access, that's worth factoring in early.",
        "Because many homes here were built before the newer east-county developments, some may need updates to kitchens, roofs, or mechanical systems. A home inspection is worth taking seriously, especially on older properties.",
        "Lot sizes vary quite a bit street to street. If a larger yard or more separation from neighbors is important, it's worth comparing specific addresses rather than assuming the whole neighborhood is the same.",
        "Vancouver Public Schools serve this area, though boundaries can change, so it's worth confirming directly with the district if schools are part of your decision. From there, the best step is usually touring a few homes to see how the tradeoffs feel in person.",
      ],
    },
  ],
  "Pleasant Valley, Vancouver": [
    {
      title: "Pleasant Valley, Vancouver: Larger Lots East of the City",
      keyword: "Pleasant Valley Vancouver WA homes",
      metaDescription:
        "A look at Pleasant Valley, Vancouver WA — larger lots, semi-rural character, and the drive into downtown Vancouver.",
      paragraphs: [
        "Pleasant Valley sits about 20 minutes northeast of downtown Vancouver, off the I-5 and I-205 corridor. It's one of the few pockets left in Clark County where farmland, larger-lot homes, and newer construction still sit side by side.",
        "Lot sizes here run well above what you'll find in Vancouver's inner subdivisions. That means more room for a shop, a garden, or simply more distance from the next house. It also puts you within a reasonable drive of Washington State University Vancouver and the shopping around Fisher's Landing.",
        "This isn't a walkable neighborhood in the way some closer-in areas are. If a standard suburban lot has started to feel too small, but you still want to stay within commuting range of Vancouver and Portland, it's worth a look.",
        "I can pull together what's currently listed in Pleasant Valley if you want to see the range of lot sizes and prices firsthand.",
      ],
    },
    {
      title: "Pleasant Valley Acreage Listings: What's Available Now",
      keyword: "Pleasant Valley new listings",
      metaDescription:
        "What's currently available on acreage in Pleasant Valley, Vancouver, plus what to check before buying land here.",
      paragraphs: [
        "Acreage listings in Pleasant Valley tend to move differently than standard subdivision homes. Buyers often take longer to decide, but once they do, there usually isn't much room to negotiate — there simply aren't many similar properties to compare against.",
        "Newer construction on larger lots has drawn the most interest this season, especially from buyers coming from tighter urban lots who want more room without leaving Clark County.",
        "Well and septic systems, easement access, and zoning for accessory structures are all worth checking early on any acreage listing. The due diligence looks different than a typical subdivision purchase, and it's easier to sort out before you're under contract than after.",
        "If acreage is on your list, it helps to widen the search radius slightly. I can pull together everything currently available in Pleasant Valley and the surrounding area in one pass.",
      ],
    },
    {
      title: "Pleasant Valley: Pros and Cons to Weigh",
      keyword: "Pleasant Valley Vancouver living",
      metaDescription:
        "The honest tradeoffs to weigh before buying in Pleasant Valley, Vancouver — space, commute time, and walkability.",
      paragraphs: [
        "The biggest tradeoff in Pleasant Valley is walkability. This isn't a neighborhood where you stroll to dinner — most errands mean getting in the car. Worth knowing upfront if that matters to you.",
        "The commute is the other honest consideration. It's a longer drive into downtown Vancouver or across into Portland than anywhere else in this rotation, though I-5 and I-205 access keeps it manageable. Map your actual drive during the hours you'd normally be on the road before deciding.",
        "Financing can also look different on larger acreage parcels, especially anything zoned for agricultural use. It's worth talking through loan options early, before you fall in love with a specific property.",
        "If space and land matter more to you than being close to shops and restaurants, Pleasant Valley is worth serious consideration.",
      ],
    },
  ],
  "Hunter Ridge Estates, Camas": [
    {
      title: "Hunter Ridge Estates: Camas's Gated Hilltop Address",
      keyword: "Hunter Ridge Estates Camas homes",
      metaDescription:
        "A look at Hunter Ridge Estates in Camas — the gated community's homes, lot sizes, typical price range, and what buyers should expect.",
      paragraphs: [
        "Hunter Ridge Estates sits above much of Camas — a gated community of custom and semi-custom homes on elevated lots. Some back decks have a clear view of Mount Hood on a clear day.",
        "Homes here tend to run larger and newer than most of the Camas Meadows area, often four or more bedrooms on generous lots. Prices reflect that — this is the upper end of the Camas market, not the accessible end.",
        "The neighborhood is zoned for Camas School District, with the same SR-14 route into Portland as the rest of Camas. The gated entry and larger lots mean less through-traffic than in more walkable, established neighborhoods closer to downtown.",
        "If privacy and space are high on your list, it's worth a look. I can walk you through what's currently available or coming soon.",
      ],
    },
    {
      title: "Hunter Ridge Estates: Where Camas's Luxury Market Stands",
      keyword: "Hunter Ridge Estates luxury homes Camas",
      metaDescription:
        "Where Camas's luxury real estate market stands right now, with a look at current inventory in Hunter Ridge Estates.",
      paragraphs: [
        "Luxury inventory in Camas stays limited by nature, and Hunter Ridge Estates is usually the first place buyers look when they want gated and elevated. There simply aren't many comparable listings anywhere else in town.",
        "View lots with a clear line to Mount Hood tend to sell at a premium over interior lots in the same community. Buyers who take too long to decide often watch a specific lot go to someone else.",
        "Buyers shopping this tier are often comparing against similar gated communities across the broader Portland metro. Hunter Ridge Estates has generally held its own on price per square foot once the view premium is factored in.",
        "If you're shopping in this range, I'd rather show you what's coming before it's public than have you find it after the fact. That's usually how the best opportunities here move.",
      ],
    },
    {
      title: "Is the Hunter Ridge Estates Premium Worth It?",
      keyword: "Hunter Ridge Estates Camas review",
      metaDescription:
        "What the price premium in Hunter Ridge Estates actually buys, compared to the rest of the Camas real estate market this year.",
      paragraphs: [
        "The honest answer depends on what matters most to you. Hunter Ridge Estates trades walkability to downtown Camas or Lacamas Lake for elevation, privacy, and a gated entry.",
        "If daily walkability to the lake or local shops is important, homes in Holly Ridge or Deer Creek offer more of that at a lower price point. Hunter Ridge Estates is built around space and separation rather than proximity.",
        "It's worth touring at more than one time of day. Light and views can shift more than people expect, and a lot that looks fine at noon can look very different at sunset.",
        "HOA rules in gated communities can also be more involved than in older, established neighborhoods. It's worth reviewing the covenants before you get too far into the process.",
      ],
    },
  ],
  "Columbia Way, Vancouver": [
    {
      title: "Columbia Way: Living Near Vancouver's Waterfront",
      keyword: "Columbia Way Vancouver WA homes",
      metaDescription:
        "A look at Columbia Way in Vancouver WA — homes near the waterfront district, the commute into Portland, and typical pricing.",
      paragraphs: [
        "Columbia Way runs along the north bank of the Columbia River, close to downtown Vancouver's waterfront district. Many buyers here trade a car trip for a walk — to restaurants along the river, to Esther Short Park, or along the trail toward Wintler Park.",
        "Housing stock is more mixed than in the established Camas neighborhoods. Newer condos and townhomes sit closer to the waterfront redevelopment, while older single-family homes are set further back. That mix means the price range here is wider than almost anywhere else in this rotation.",
        "I-5 access is immediate, and the Portland side of the river is a short bridge crossing away. Vancouver Public Schools serve the area, though it's worth confirming current boundaries directly with the district.",
        "If walkability and river access matter more to you than square footage, Columbia Way is worth a close look.",
      ],
    },
    {
      title: "Columbia Way Condo & Townhome Market: What's Selling",
      keyword: "Columbia Way condos for sale",
      metaDescription:
        "What's currently selling in the Columbia Way condo and townhome market near downtown Vancouver's waterfront district.",
      paragraphs: [
        "Newer condo and townhome product along Columbia Way continues to draw buyers who work in Portland but want Washington's tax advantage without giving up a walkable, river-adjacent location.",
        "Units closest to the waterfront trail and downtown Vancouver's restaurant row tend to move fastest, often within two to three weeks. Older single-family homes further from the river typically take longer to sell.",
        "If a downtown-adjacent, low-maintenance option is what you're after, it helps to set up alerts for new Columbia Way listings. This stretch turns over quickly enough that waiting even a week can mean missing the best units.",
        "Reach out and I can get that set up, along with a sense of current pricing by unit size and how it compares to a few months ago.",
      ],
    },
    {
      title: "What Columbia Way Living Actually Involves",
      keyword: "living in Columbia Way Vancouver",
      metaDescription:
        "What daily life in Columbia Way actually involves, from parking to walkability, before you make an offer on a home here.",
      paragraphs: [
        "Columbia Way is a denser, more urban stretch of Vancouver than neighborhoods like Harney Heights or Lakeshore. That's part of the appeal for some buyers and a bigger adjustment for others, depending on what you're used to.",
        "Parking and storage are worth asking about upfront. Most of the newer condo product trades square footage for location, so if you're coming from a house with a garage, it helps to see exactly what's included before making an offer.",
        "A larger yard or a quiet cul-de-sac isn't really part of the picture here. If outdoor space is high on your list, it's worth comparing Columbia Way against neighborhoods further from the river.",
        "The best way to know if it fits is to walk the area at different times of day — weekday mornings look very different from a Saturday afternoon along the waterfront trail.",
      ],
    },
  ],
  "Deer Creek, Camas": [
    {
      title: "Deer Creek, Camas: The Wooded Side of Prune Hill",
      keyword: "Deer Creek Camas homes",
      metaDescription:
        "A look at Deer Creek, Camas — the wooded side of the Prune Hill area, home styles, lot sizes, and local school district access.",
      paragraphs: [
        "Deer Creek sits on the wooded side of the Prune Hill area, a few minutes from Holly Ridge, with noticeably more tree cover and quieter cul-de-sac streets. It doesn't come up in as many searches, which has kept it relatively accessible.",
        "Most homes here date to the same late-1990s-to-2000s building period as the rest of Camas Meadows. That means mature landscaping that new construction can't really replicate, along with lots that give some separation from the neighbors.",
        "It's an easy walk or short drive to the Lacamas Creek Trail. The same Camas School District access applies here, with Skyridge Middle and Camas High in the normal feeder pattern — boundaries can change, so it's worth confirming directly with the district.",
        "SR-14 gets you into Portland on the same timeline as the rest of the Camas Meadows area. If you want to see what's currently on the market, I'm happy to send it over.",
      ],
    },
    {
      title: "Deer Creek Inventory Update: What's on the Market",
      keyword: "Deer Creek Camas listings",
      metaDescription:
        "Current inventory and pricing trends in the Deer Creek, Camas real estate market, and what tends to draw buyer interest here.",
      paragraphs: [
        "Deer Creek doesn't turn over as quickly as some of the more visible Camas neighborhoods. When a well-kept home does list here, it tends to draw serious buyers rather than lookers, and listings have been going pending within the first weekend.",
        "Pricing has held fairly steady relative to the broader Camas Meadows area, generally a step below Holly Ridge for comparable square footage. That's largely because it's a quieter address without direct lake frontage or greenspace backing on every lot.",
        "If wooded and quiet is what you're after, it's worth setting up an alert specifically for this neighborhood. Listings here tend to get more attention than the neighborhood's overall visibility would suggest. I'm happy to set that up, or walk through current options on a call.",
      ],
    },
    {
      title: "What to Know Before You Buy in Deer Creek",
      keyword: "Deer Creek Camas buyers guide",
      metaDescription:
        "What to know before buying in Deer Creek, Camas — home age, lot sizes, and how pricing compares to nearby neighborhoods.",
      paragraphs: [
        "Deer Creek is more of a step-up neighborhood than a typical starting point. Homes here tend to be a bit larger and more established than in Holly Ridge, with mature landscaping and quieter streets.",
        "New construction isn't part of the picture — everything here is resale, mostly from the same late-1990s-to-2000s building period as the rest of Camas Meadows. Some homes may need updated kitchens or systems, so a thorough inspection is worth the cost.",
        "Because it's a quieter, less-searched address, it can take a little longer to find comparable sales when pricing a home here. That's worth knowing if you're trying to gauge value before making an offer.",
        "The best way to get a feel for Deer Creek is to drive the streets at different times of day. It's a different pace than the busier corridors nearby, and that's easier to sense in person than in photos.",
      ],
    },
  ],
  "Harney Heights, Vancouver": [
    {
      title: "Harney Heights: An Established Corner of Northeast Vancouver",
      keyword: "Harney Heights Vancouver WA homes",
      metaDescription:
        "A look at Harney Heights in Vancouver WA — an established neighborhood with older homes, mature trees, and varied architecture.",
      paragraphs: [
        "Harney Heights doesn't get the attention that some of Vancouver's newer subdivisions do. It's an established, quiet pocket of northeast Vancouver with mature trees and settled landscaping, and noticeably less through-traffic than the busier east-county corridors.",
        "It sits close enough to the Mill Plain and SR-14 corridor for a reasonable commute, while feeling several steps removed from the retail density around Vancouver Mall.",
        "Home styles here run older and more varied than the newer east Vancouver developments. That means more character per square foot, but it can also mean more updating — worth factoring into your budget if you're comparing against newer construction.",
        "If an established neighborhood with more negotiating room is what you're after, Harney Heights is worth a look.",
      ],
    },
    {
      title: "Harney Heights Market Pulse: Quiet Area, Steady Demand",
      keyword: "Harney Heights Vancouver market update",
      metaDescription:
        "Current market conditions in Harney Heights, Vancouver, including how quickly homes have been selling and why inventory stays low.",
      paragraphs: [
        "Harney Heights doesn't generate the listing volume of the bigger east-Vancouver developments, but that scarcity tends to work in sellers' favor. Homes here have been going under contract fairly quickly when priced in line with recent comparable sales.",
        "Buyers coming from outside the immediate area are often surprised by how much house their budget covers here compared to newer subdivisions closer to I-205. That value gap has been the main driver of demand lately.",
        "Because so few homes list here in a given month, buyers who are serious about the area tend to move fast once something hits the market. Offers within the first few days aren't unusual.",
        "If you want a heads-up the moment something lists in Harney Heights, that's easy to set up — just let me know.",
      ],
    },
    {
      title: "What to Know Before You Buy in Harney Heights",
      keyword: "Harney Heights Vancouver buyers guide",
      metaDescription:
        "What to know before buying in Harney Heights, Vancouver — home condition, HOA structure, and price comparisons to nearby areas.",
      paragraphs: [
        "Harney Heights is an older, established neighborhood, which means more character but also more variation in home condition. Some properties have been updated, others haven't — worth budgeting for updates if a move-in-ready kitchen matters to you.",
        "There's generally no formal HOA across much of the neighborhood, which gives more flexibility with a property but also less consistency street to street. It's worth confirming on a home-by-home basis rather than assuming.",
        "Compared to newer subdivisions closer to I-205, homes here tend to cost less per square foot, though lots and floor plans vary more than in a planned development. Comparing a few different addresses helps you see the range.",
        "The best way to judge Harney Heights is to walk a few blocks and see a couple of homes in person — it rewards buyers who take the time to look closely rather than judge from listing photos alone.",
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
  const titleLen = post.title.length;
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

  return [
    {
      label: "Title length",
      pass: titleLen >= 20 && titleLen <= 60,
      detail: `${titleLen} characters (aim for 20–60 so it doesn't truncate in search)`,
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
      label: "Internal link",
      pass: !!post.areaUrl,
      detail: post.areaUrl,
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
          <a class="card-link" href="#" onclick="return false;">${post.areaUrl}</a>

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
