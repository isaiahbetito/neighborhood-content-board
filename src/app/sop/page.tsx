import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "SOP — Jamie's Content Board" };

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
          ← Jamie&apos;s Content Board
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
            <li>Pull the next neighborhood + topic from this week&apos;s rotation.</li>
            <li>Feed Claude the neighborhood, target keyword, and last 2 posts for that area (avoid repeating angles).</li>
            <li>Generate a draft: 500–700 words, keyword in the title and first paragraph, one internal link to the neighborhood page.</li>
            <li>Light edit pass for voice, then move the card to &quot;Ready for review.&quot;</li>
            <li>Once approved, schedule across GBP, both websites, and LinkedIn.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
