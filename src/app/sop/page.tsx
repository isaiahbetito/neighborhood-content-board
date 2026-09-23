import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "SOP — Jamie Meushaw Real Estate" };

const FOLDERS = [
  { icon: "📝", name: "Blog Writer (SEO)", count: "3 prompts" },
  { icon: "✉️", name: "Weekly Mailer Generator", count: "2 prompts" },
  { icon: "📣", name: "Facebook Ad Copy", count: "4 prompts" },
  { icon: "🏠", name: "Listing Description Generator", count: "2 prompts" },
  { icon: "🎬", name: "Shorts Script Ideas", count: "1 prompt" },
  { icon: "📋", name: "Seller Follow-Up Templates", count: "5 prompts" },
];

export default function SopPage() {
  return (
    <div className="page-body">
      <div className="page-top">
        <Link href="/" className="back-link">
          ← Content Board
        </Link>
      </div>

      <div className="demo-hero">
        <div className="demo-icon">🗂️</div>
        <h1 className="demo-title">SOP</h1>
        <p className="demo-desc">
          The AI workflows behind every recurring task, organized by purpose
          so the right prompt is always one click away.
        </p>
        <span className="sample-tag">sample project structure + one workflow</span>
      </div>

      <div className="chrome-frame">
        <div className="chrome-bar">
          <span className="chrome-dot"></span>
          <span className="chrome-dot"></span>
          <span className="chrome-dot"></span>
          <span className="chrome-label">Claude &amp; ChatGPT · Projects</span>
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

        <div className="prompt-card">
          <div className="prompt-card-label">Blog Writer (SEO) · Workflow</div>
          <h3 className="prompt-card-title">Hyperlocal Blog Post — Prompt &amp; Process</h3>
          <ol className="prompt-steps">
            <li>Pull the next neighborhood + angle from this week&apos;s rotation — never the same angle twice for one area (spotlight, market pulse, practical considerations).</li>
            <li>Check jamiemeushawrealestate.com/blog first: if Jamie already has a long-form guide for that neighborhood, write a shorter, complementary post instead of duplicating it.</li>
            <li>Keep Jamie&apos;s official &quot;Writing Voice &amp; Style Guide&quot; open while drafting — short sentences, plain language, no hype words (&quot;stunning,&quot; &quot;dream home,&quot; &quot;hidden gem&quot;), and never frame a neighborhood around who it&apos;s &quot;for&quot; (Fair Housing: describe the property and area, not the buyer).</li>
            <li>Feed Claude the neighborhood, target keyword, and 2–3 real local specifics (streets, parks, schools, commute) — Jamie&apos;s own posts cite these by name, so ours should too. Note that school-district boundaries should be double-checked, since they can change.</li>
            <li>Generate a draft: 250–350 words, keyword in the title and first paragraph, byline &quot;By Jamie Meushaw,&quot; closes with a soft CTA (reach out, YouTube channel, or newsletter) — not a hard sales button.</li>
            <li>Open the card&apos;s SEO check panel — all 7 checks (length, keyword placement, hype-free language, Fair Housing-neutral framing, etc.) should pass before it moves to &quot;Ready for review.&quot;</li>
            <li>Once approved, schedule across GBP, both websites, and LinkedIn.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
