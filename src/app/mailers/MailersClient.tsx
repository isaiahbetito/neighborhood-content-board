"use client";

import Link from "next/link";
import MiniBoard, { type BoardItem } from "@/components/MiniBoard";

const NEIGHBORHOODS = [
  {
    name: "Holly Ridge, Camas",
    address: "1518 NW Holly Ridge Ln, Camas, WA",
    price: "$625,000 · 4 bd · 2.5 ba · 2,340 sqft",
    desc: "Backed to Prune Hill greenspace, walkable to Grass Valley Park.",
    photo: "1570129477492-45c003edd2be",
  },
  {
    name: "Lakeshore, Vancouver",
    address: "4471 NE Lakeshore Ave, Vancouver, WA",
    price: "$589,000 · 3 bd · 2 ba · 1,980 sqft",
    desc: "Minutes from Vancouver Lake Regional Park and the trail system.",
    photo: "1600596542815-ffad4c1539a9",
  },
  {
    name: "Deer Creek, Camas",
    address: "2244 NW Deer Creek Ct, Camas, WA",
    price: "$599,000 · 3 bd · 2.5 ba · 2,120 sqft",
    desc: "Wooded lot, quiet cul-de-sac, Camas School District.",
    photo: "1600607687939-ce8a6c25118c",
  },
  {
    name: "Columbia Way, Vancouver",
    address: "88 Columbia Way #4, Vancouver, WA",
    price: "$445,000 · 2 bd · 2 ba · 1,180 sqft",
    desc: "Walk to the waterfront trail and downtown Vancouver.",
    photo: "1600047509807-ba8f99d2cdde",
  },
];

const BLOG_TEASERS = [
  { title: "Why Buyers Keep Circling Back to Holly Ridge in Camas", photo: "1570129477492-45c003edd2be" },
  { title: "Lakeshore: Vancouver's Answer to Lake Living", photo: "1600596542815-ffad4c1539a9" },
  { title: "Deer Creek, Camas: The Wooded Side of Prune Hill Buyers Overlook", photo: "1600607687939-ce8a6c25118c" },
];

type MailerItem = BoardItem & {
  weekLabel: string;
  sendDate: string;
  subject: string;
  previewText: string;
  neighborhood: (typeof NEIGHBORHOODS)[number];
  stats: [string, string][];
};

function nextMondays(count: number): Date[] {
  const out: Date[] = [];
  const today = new Date();
  const first = new Date(today);
  first.setDate(today.getDate() + ((1 - today.getDay() + 7) % 7 || 7));
  for (let i = 0; i < count; i++) {
    const d = new Date(first);
    d.setDate(first.getDate() + i * 7);
    out.push(d);
  }
  return out;
}

function seed(): MailerItem[] {
  const mondays = nextMondays(4);
  const stats: [string, string][][] = [
    [
      ["$650K", "Median list price"],
      ["21", "Avg. days on market"],
      ["7", "New listings this week"],
    ],
    [
      ["$642K", "Median list price"],
      ["19", "Avg. days on market"],
      ["5", "New listings this week"],
    ],
    [
      ["$658K", "Median list price"],
      ["23", "Avg. days on market"],
      ["9", "New listings this week"],
    ],
    [
      ["$661K", "Median list price"],
      ["17", "Avg. days on market"],
      ["6", "New listings this week"],
    ],
  ];

  return mondays.map((d, i) => {
    const n = NEIGHBORHOODS[i % NEIGHBORHOODS.length];
    const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      id: "m" + (i + 1),
      status: "Drafted",
      weekLabel: dateLabel,
      sendDate: d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
      subject: `This week: ${n.name.split(",")[0]} spotlight, a market pulse & 3 fresh reads 🏡`,
      previewText: `Featuring ${n.name} — plus what's new around Camas and Vancouver this week...`,
      neighborhood: n,
      stats: stats[i],
    };
  });
}

export default function MailersClient() {
  return (
    <div className="page-body">
      <div className="page-top">
        <Link href="/" className="back-link">
          ← Content Board
        </Link>
      </div>

      <div className="demo-hero">
        <div className="demo-icon">✉️</div>
        <h1 className="demo-title">Mailers</h1>
        <p className="demo-desc">
          Prepared and sent through Mailchimp every Monday — drag a week
          through Drafted → Ready for Review → Scheduled → Sent as it comes
          together.
        </p>
      </div>

      <MiniBoard<MailerItem>
        storageKey="mailers"
        seed={seed}
        statusLabels={{ Published: "Sent" }}
        resetLabel="Reset to a fresh draft set"
        renderCard={(item) => `
          <div class="card-top">
            <span class="card-area">Week of ${item.weekLabel}</span>
            <span class="card-when">${item.sendDate}</span>
          </div>
          <p class="card-title">${item.subject}</p>
          <div class="card-kw">Featured: ${item.neighborhood.name}</div>
        `}
        renderModalBody={(item) => `
          <div class="chrome-frame" style="margin:0 0 20px;">
            <div class="chrome-bar">
              <span class="chrome-dot"></span>
              <span class="chrome-dot"></span>
              <span class="chrome-dot"></span>
              <span class="chrome-label">Campaign preview · Mailchimp</span>
            </div>
            <div class="mailer-meta">
              <div class="mailer-meta-row">
                <span class="mailer-meta-label">From</span>
                <span class="mailer-meta-value">Jamie Meushaw · Jamie Meushaw Real Estate &lt;jamie@jamiemeushawrealestate.com&gt;</span>
              </div>
              <div class="mailer-meta-row">
                <span class="mailer-meta-label">Subject</span>
                <span class="mailer-meta-value">${item.subject}</span>
              </div>
              <div class="mailer-meta-row">
                <span class="mailer-meta-label">Preview</span>
                <span class="mailer-meta-value mailer-meta-preview">${item.previewText}</span>
              </div>
            </div>
            <div class="mailer-canvas">
              <div class="email-header">
                <span class="email-header-mark">JAMIE MEUSHAW</span>
                <span class="email-header-sub">Real Estate · Camas &amp; Vancouver, WA</span>
              </div>
              <p class="email-greeting">Hi there,</p>
              <p class="email-intro">Here's what moved this week across Camas and Vancouver — a featured listing worth a second look, where prices are trending, and a few reads from the blog in case you missed them.</p>
              <div class="email-listing">
                <img class="email-listing-photo" src="https://images.unsplash.com/photo-${item.neighborhood.photo}?w=700&q=70&auto=format&fit=crop" alt="Featured listing" />
                <div class="email-listing-body">
                  <span class="email-listing-tag">Featured listing</span>
                  <h3 class="email-listing-title">${item.neighborhood.address}</h3>
                  <p class="email-listing-price">${item.neighborhood.price}</p>
                  <p class="email-listing-desc">${item.neighborhood.desc}</p>
                  <span class="email-btn">View the listing</span>
                </div>
              </div>
              <div class="email-stats">
                ${item.stats
                  .map(
                    ([num, lbl]) =>
                      `<div class="email-stat"><div class="email-stat-num">${num}</div><div class="email-stat-lbl">${lbl}</div></div>`
                  )
                  .join("")}
              </div>
              <div class="email-section-label">From the blog this week</div>
              <div class="email-blog-list">
                ${BLOG_TEASERS.map(
                  (t) => `
                  <div class="email-blog-item">
                    <img class="email-blog-thumb" src="https://images.unsplash.com/photo-${t.photo}?w=200&q=60&auto=format&fit=crop" alt="" />
                    <div>
                      <div class="email-blog-title">${t.title}</div>
                      <div class="email-blog-read">Read more →</div>
                    </div>
                  </div>`
                ).join("")}
              </div>
              <div class="email-cta">
                <div class="email-cta-title">Thinking about buying or selling?</div>
                <p class="email-cta-desc">Reply to this email or book a quick call — happy to walk through what your options look like right now.</p>
                <span class="email-btn email-btn-light">Let's talk</span>
              </div>
              <div class="email-footer">
                <div class="email-footer-name">Jamie Meushaw · Jamie Meushaw Real Estate</div>
                <div>13514 SE 26th Circle, Vancouver, WA 98683 · (360) 798-7127</div>
                <div class="email-footer-links">
                  <span>Unsubscribe</span><span>·</span><span>Update preferences</span><span>·</span><span>View in browser</span>
                </div>
              </div>
            </div>
          </div>
        `}
      />
    </div>
  );
}
