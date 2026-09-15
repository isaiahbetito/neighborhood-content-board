import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "YouTube Content — Jamie's Content Board" };

export default function YoutubeContentPage() {
  return (
    <div className="page-body">
      <div className="page-top">
        <Link href="/" className="back-link">
          ← Jamie&apos;s Content Board
        </Link>
      </div>

      <div className="demo-hero">
        <div className="demo-icon">🎬</div>
        <h1 className="demo-title">YouTube Content</h1>
        <p className="demo-desc">
          Older long-form videos, reviewed for clip-worthy moments and cut
          into Shorts — as needed, not a fixed weekly task.
        </p>
        <span className="sample-tag">sample repurpose from one video</span>
      </div>

      <div className="yt-wrap">
        <div className="yt-repurpose">
          <div className="yt-card yt-source">
            <div className="yt-thumb-wrap">
              <img
                className="yt-thumb"
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=65&auto=format&fit=crop"
                alt="Original long-form video"
              />
              <span className="yt-duration">14:52</span>
            </div>
            <div className="yt-card-body">
              <div className="yt-card-title">
                Touring a $1.2M Oakwood Estates Home — Full Walkthrough
              </div>
              <div className="yt-card-meta">Jamie Real Estate · 6 months ago</div>
            </div>
          </div>

          <div className="yt-arrow">→</div>

          <div className="yt-shorts-row">
            <div className="yt-card yt-short">
              <div className="yt-thumb-wrap">
                <img
                  className="yt-thumb"
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=260&q=65&auto=format&fit=crop"
                  alt="Shorts clip 1"
                />
                <span className="yt-shorts-badge">SHORTS</span>
                <span className="yt-play">▶</span>
              </div>
              <div className="yt-card-body">
                <div className="yt-card-title">The pool you weren&apos;t expecting 🤯</div>
                <div className="yt-card-meta">0:38</div>
              </div>
            </div>
            <div className="yt-card yt-short">
              <div className="yt-thumb-wrap">
                <img
                  className="yt-thumb"
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=260&q=65&auto=format&fit=crop"
                  alt="Shorts clip 2"
                />
                <span className="yt-shorts-badge">SHORTS</span>
                <span className="yt-play">▶</span>
              </div>
              <div className="yt-card-body">
                <div className="yt-card-title">This kitchen island though 😍</div>
                <div className="yt-card-meta">0:24</div>
              </div>
            </div>
            <div className="yt-card yt-short">
              <div className="yt-thumb-wrap">
                <img
                  className="yt-thumb"
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=260&q=65&auto=format&fit=crop"
                  alt="Shorts clip 3"
                />
                <span className="yt-shorts-badge">SHORTS</span>
                <span className="yt-play">▶</span>
              </div>
              <div className="yt-card-body">
                <div className="yt-card-title">Would you buy this house? 🏡</div>
                <div className="yt-card-meta">0:47</div>
              </div>
            </div>
          </div>
        </div>

        <div className="yt-section-label">Why these clips</div>
        <ul className="prompt-steps" style={{ maxWidth: 480, margin: "0 auto" }}>
          <li>Each cut is under 45 seconds and leads with the most visual moment first.</li>
          <li>Captions burned in, since most Shorts are watched on mute.</li>
          <li>Title asks a question or reacts — it&apos;s what gets the tap.</li>
        </ul>
      </div>
    </div>
  );
}
