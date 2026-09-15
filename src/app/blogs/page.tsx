import type { Metadata } from "next";
import Link from "next/link";
import BoardApp from "@/components/BoardApp";

export const metadata: Metadata = {
  title: "Blogs — Jamie's Content Board",
};

export default function BlogsPage() {
  return (
    <>
      <header className="masthead">
        <div className="masthead-inner">
          <div>
            <div className="mark">
              <Link href="/" className="back-link">
                ← Jamie&apos;s Content Board
              </Link>
            </div>
            <h1>Never miss a day, never repeat a neighborhood</h1>
            <p className="sub">
              This is what your content calendar looks like once it&apos;s
              running: three posts a day, rotating through every neighborhood
              you serve, always seven days ahead — and you can see exactly
              what&apos;s live on each platform at a glance.
            </p>
          </div>
          <div className="stats" id="stats"></div>
        </div>

        <div className="howto">
          <div className="howto-item">
            <span className="howto-dot"></span>Each card is one blog post
          </div>
          <div className="howto-item">
            <span className="howto-dot"></span>Columns show where it is in
            the pipeline
          </div>
          <div className="howto-item">
            <span className="howto-dot"></span>Drag a card, or click a tag,
            to update it live
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="filters" id="filters">
          <span className="filter-label">Day</span>
          <div className="filter-group" id="dayFilters"></div>
          <div className="filter-divider"></div>
          <span className="filter-label">Neighborhood</span>
          <span className="sample-tag">
            example areas — swapped for yours on day one
          </span>
          <div className="filter-group" id="areaFilters"></div>
        </div>

        <div id="boardRoot">
          <div className="loading-screen">Loading board…</div>
        </div>

        <footer>
          <div className="legend" id="legend"></div>
          <button id="resetBtn">Reset to sample week</button>
        </footer>
      </div>

      <BoardApp />
    </>
  );
}
