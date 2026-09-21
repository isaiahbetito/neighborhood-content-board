"use client";

import Link from "next/link";
import MiniBoard, { type BoardItem } from "@/components/MiniBoard";

type AdItem = BoardItem & {
  adType: string;
  area: string;
  headline: string;
  copy: string;
  domain: string;
  desc: string;
  cta: string;
  photo: string;
};

const ADS: Omit<AdItem, "id" | "status" | "statusChangedAt">[] = [
  {
    adType: "Just Listed",
    area: "Deer Creek, Camas",
    headline: "New Listing: Deer Creek, Camas",
    copy: "🔑 Just listed in Deer Creek, Camas — priced for first-time buyers and won't last. Tap to see the full listing before it's gone.",
    domain: "jamiemeushawrealestate.com",
    desc: "3 bd · 2 ba · Under $600K",
    cta: "Learn More",
    photo: "1600047509807-ba8f99d2cdde",
  },
  {
    adType: "Open House",
    area: "Holly Ridge, Camas",
    headline: "Open House · Holly Ridge, Camas",
    copy: "🏡 Open house this Saturday in Holly Ridge, Camas, 12–3pm. Family home, big backyard, walk to the lake. Stop by, no appointment needed.",
    domain: "jamiemeushawrealestate.com",
    desc: "Saturday, 12:00–3:00 PM",
    cta: "Send Message",
    photo: "1570129477492-45c003edd2be",
  },
  {
    adType: "Market Update",
    area: "Lakeshore, Vancouver",
    headline: "Vancouver Lake Market Update",
    copy: "📊 Inventory near Vancouver Lake has been unusually tight this season. If Lakeshore is on your radar, now's the time to get set up on alerts.",
    domain: "jamiemeushawrealestate.com",
    desc: "See current Lakeshore listings",
    cta: "Learn More",
    photo: "1600596542815-ffad4c1539a9",
  },
  {
    adType: "Just Listed",
    area: "Hunter Ridge Estates, Camas",
    headline: "New Listing: Hunter Ridge Estates",
    copy: "🏔️ Gated, elevated, and private — a new Hunter Ridge Estates listing with Mount Hood views just hit the market. Serious inquiries only.",
    domain: "jamiemeushawrealestate.com",
    desc: "4 bd · 3.5 ba · $1.1M+",
    cta: "Learn More",
    photo: "1512917774080-9991f1c4c750",
  },
  {
    adType: "New Listing",
    area: "Columbia Way, Vancouver",
    headline: "New Listing: Columbia Way",
    copy: "🌊 Walk to the waterfront trail and downtown Vancouver restaurants. A new Columbia Way condo just listed — low-maintenance, high walkability.",
    domain: "jamiemeushawrealestate.com",
    desc: "2 bd · 2 ba · Under $450K",
    cta: "Learn More",
    photo: "1600607687939-ce8a6c25118c",
  },
  {
    adType: "Open House",
    area: "Harney Heights, Vancouver",
    headline: "Open House · Harney Heights",
    copy: "🏡 Open house this Sunday in Harney Heights, 1–4pm. Established neighborhood, mature trees, room to make it yours. Stop by and say hi.",
    domain: "jamiemeushawrealestate.com",
    desc: "Sunday, 1:00–4:00 PM",
    cta: "Send Message",
    photo: "1592595896616-c37162298647",
  },
];

function seed(): AdItem[] {
  return ADS.map((a, i) => ({
    ...a,
    id: "fb" + (i + 1),
    status: "Drafted",
  }));
}

export default function FacebookAdsClient() {
  return (
    <div className="page-body">
      <div className="page-top">
        <Link href="/" className="back-link">
          ← Content Board
        </Link>
      </div>

      <div className="demo-hero">
        <div className="demo-icon">📣</div>
        <h1 className="demo-title">Facebook Ads</h1>
        <p className="demo-desc">
          Built and launched when Jamie asks for one — each idea moves
          through Drafted → Ready for Review → Scheduled → Live.
        </p>
      </div>

      <MiniBoard<AdItem>
        storageKey="facebook-ads"
        seed={seed}
        statusLabels={{ Published: "Live" }}
        resetLabel="Reset to a fresh draft set"
        renderCard={(item) => `
          <div class="card-top">
            <span class="card-area">${item.area}</span>
            <span class="card-when">${item.adType}</span>
          </div>
          <p class="card-title">${item.headline}</p>
          <div class="card-kw">${item.desc}</div>
        `}
        renderModalBody={(item) => `
          <div class="chrome-frame" style="margin:0 0 20px;">
            <div class="chrome-bar">
              <span class="chrome-dot"></span>
              <span class="chrome-dot"></span>
              <span class="chrome-dot"></span>
              <span class="chrome-label">Ad preview · Meta Ads Manager</span>
            </div>
            <div class="fb-ad" style="box-shadow:none;border:none;">
              <div class="fb-ad-head">
                <div class="fb-ad-avatar">J</div>
                <div>
                  <div class="fb-ad-page">Jamie Meushaw Real Estate</div>
                  <div class="fb-ad-meta">Sponsored · 🌐</div>
                </div>
                <div class="fb-ad-menu">···</div>
              </div>
              <div class="fb-ad-copy">${item.copy}</div>
              <img class="fb-ad-photo" src="https://images.unsplash.com/photo-${item.photo}?w=800&q=70&auto=format&fit=crop" alt="${item.headline}" />
              <div class="fb-ad-info">
                <div>
                  <div class="fb-ad-domain">${item.domain}</div>
                  <div class="fb-ad-headline">${item.headline}</div>
                  <div class="fb-ad-desc">${item.desc}</div>
                </div>
                <span class="fb-ad-cta">${item.cta}</span>
              </div>
            </div>
          </div>
        `}
      />
    </div>
  );
}
