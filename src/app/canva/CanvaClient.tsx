"use client";

import Link from "next/link";
import MiniBoard, { type BoardItem } from "@/components/MiniBoard";

const FOLDERS = [
  { icon: "🏷️", name: "Listing Flyers", count: "12 designs" },
  { icon: "📱", name: "Social Posts", count: "34 designs" },
  { icon: "✉️", name: "Mailer Templates", count: "6 designs" },
  { icon: "🪧", name: "Open House Signs", count: "8 designs" },
  { icon: "🎉", name: "Just Sold Graphics", count: "9 designs" },
  { icon: "🎨", name: "Brand Kit", count: "logos, fonts, colors" },
];

type FlyerItem = BoardItem & {
  address: string;
  neighborhood: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  features: string[];
  photo: string;
};

const FLYERS: Omit<FlyerItem, "id" | "status" | "statusChangedAt">[] = [
  {
    address: "1518 NW Holly Ridge Ln, Camas, WA",
    neighborhood: "Holly Ridge, Camas",
    price: "$625,000",
    beds: "4",
    baths: "2.5",
    sqft: "2,340",
    features: [
      "Updated kitchen with quartz counters",
      "Fenced backyard, mature trees",
      "Walk to Lacamas Lake",
    ],
    photo: "1592595896616-c37162298647",
  },
  {
    address: "2244 NW Deer Creek Ct, Camas, WA",
    neighborhood: "Deer Creek, Camas",
    price: "$599,000",
    beds: "3",
    baths: "2.5",
    sqft: "2,120",
    features: [
      "Wooded lot, quiet cul-de-sac",
      "Daylight basement / bonus room",
      "Camas School District",
    ],
    photo: "1600047509807-ba8f99d2cdde",
  },
  {
    address: "4471 NE Lakeshore Ave, Vancouver, WA",
    neighborhood: "Lakeshore, Vancouver",
    price: "$589,000",
    beds: "3",
    baths: "2",
    sqft: "1,980",
    features: [
      "Minutes from Vancouver Lake Regional Park",
      "Mature trees, generous lot",
      "Easy I-5 access",
    ],
    photo: "1570129477492-45c003edd2be",
  },
  {
    address: "2210 NW Hunter Ridge Dr, Camas, WA",
    neighborhood: "Hunter Ridge Estates, Camas",
    price: "$1,150,000",
    beds: "4",
    baths: "3.5",
    sqft: "3,400",
    features: [
      "Gated community, elevated lot",
      "Mount Hood views from the back deck",
      "Custom finishes throughout",
    ],
    photo: "1512917774080-9991f1c4c750",
  },
  {
    address: "88 Columbia Way #4, Vancouver, WA",
    neighborhood: "Columbia Way, Vancouver",
    price: "$445,000",
    beds: "2",
    baths: "2",
    sqft: "1,180",
    features: [
      "Walk to the waterfront trail",
      "Low-maintenance condo living",
      "Minutes to downtown Vancouver",
    ],
    photo: "1600607687939-ce8a6c25118c",
  },
];

function seed(): FlyerItem[] {
  return FLYERS.map((f, i) => ({
    ...f,
    id: "flyer" + (i + 1),
    status: "Drafted",
  }));
}

export default function CanvaClient() {
  return (
    <div className="page-body">
      <div className="page-top">
        <Link href="/" className="back-link">
          ← Content Board
        </Link>
      </div>

      <div className="demo-hero">
        <div className="demo-icon">🎨</div>
        <h1 className="demo-title">Canva</h1>
        <p className="demo-desc">
          Jamie Meushaw&apos;s account organized by use, so templates are
          easy to find and every listing flyer starts from the same brand
          kit.
        </p>
      </div>

      <div className="chrome-frame">
        <div className="chrome-bar">
          <span className="chrome-dot"></span>
          <span className="chrome-dot"></span>
          <span className="chrome-dot"></span>
          <span className="chrome-label">Canva · Jamie Meushaw Real Estate</span>
        </div>
        <div className="folder-grid">
          {FOLDERS.map((f) => (
            <div className="folder-item" key={f.name}>
              <span className="folder-icon">{f.icon}</span>
              <span className="folder-name">{f.name}</span>
              <span className="folder-count">{f.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-hero" style={{ paddingTop: 0 }}>
        <p className="demo-desc" style={{ marginTop: 8 }}>
          Listing flyers, tracked from request to delivered — drag or use
          the stage menu as each one moves through review.
        </p>
      </div>

      <MiniBoard<FlyerItem>
        storageKey="canva"
        seed={seed}
        statusLabels={{ Published: "Delivered" }}
        resetLabel="Reset to a fresh draft set"
        renderCard={(item) => `
          <div class="card-top">
            <span class="card-area">${item.neighborhood}</span>
            <span class="card-when">${item.price}</span>
          </div>
          <p class="card-title">Listing Flyer — ${item.address}</p>
          <div class="card-kw">${item.beds} bd · ${item.baths} ba · ${item.sqft} sqft</div>
        `}
        renderModalBody={(item) => `
          <div class="flyer-wrap" style="margin:0 0 20px;padding:0;">
            <div class="flyer">
              <img class="flyer-photo" src="https://images.unsplash.com/photo-${item.photo}?w=700&q=70&auto=format&fit=crop" alt="${item.address}" />
              <div class="flyer-band">Just Listed</div>
              <div class="flyer-body">
                <div class="flyer-price">${item.price}</div>
                <div class="flyer-address">${item.address}</div>
                <div class="flyer-specs">
                  <div class="flyer-spec"><div class="flyer-spec-num">${item.beds}</div><div class="flyer-spec-lbl">Beds</div></div>
                  <div class="flyer-spec"><div class="flyer-spec-num">${item.baths}</div><div class="flyer-spec-lbl">Baths</div></div>
                  <div class="flyer-spec"><div class="flyer-spec-num">${item.sqft}</div><div class="flyer-spec-lbl">Sqft</div></div>
                </div>
                <ul class="flyer-features">
                  ${item.features.map((f) => `<li>${f}</li>`).join("")}
                </ul>
                <div class="flyer-contact">
                  <div class="flyer-contact-avatar">J</div>
                  <div>
                    <div class="flyer-contact-name">Jamie Meushaw · Jamie Meushaw Real Estate</div>
                    <div class="flyer-contact-phone">(360) 798-7127 · jamiemeushawrealestate.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `}
      />
    </div>
  );
}
