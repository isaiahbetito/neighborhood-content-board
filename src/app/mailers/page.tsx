import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Mailers — Jamie's Content Board" };

export default function MailersPage() {
  return (
    <div className="page-body">
      <div className="page-top">
        <Link href="/" className="back-link">
          ← Jamie&apos;s Content Board
        </Link>
      </div>

      <div className="demo-hero">
        <div className="demo-icon">✉️</div>
        <h1 className="demo-title">Mailers</h1>
        <p className="demo-desc">
          Prepared and sent through Mailchimp every Monday — pulling that
          week&apos;s top listing and blog posts straight from the pipeline.
        </p>
        <span className="sample-tag">
          sample based on this week&apos;s blog rotation — swapped for real
          listings on day one
        </span>
      </div>

      <div className="chrome-frame">
        <div className="chrome-bar">
          <span className="chrome-dot"></span>
          <span className="chrome-dot"></span>
          <span className="chrome-dot"></span>
          <span className="chrome-label">Campaign preview · Mailchimp</span>
        </div>

        <div className="mailer-meta">
          <div className="mailer-meta-row">
            <span className="mailer-meta-label">From</span>
            <span className="mailer-meta-value">
              Jamie · Your Local Real Estate Guide &lt;jamie@clientwebsite.com&gt;
            </span>
          </div>
          <div className="mailer-meta-row">
            <span className="mailer-meta-label">Subject</span>
            <span className="mailer-meta-value">
              This week: 9 new listings, a market pulse check &amp; 3 fresh
              reads 🏡
            </span>
          </div>
          <div className="mailer-meta-row">
            <span className="mailer-meta-label">Preview</span>
            <span className="mailer-meta-value mailer-meta-preview">
              Plus what&apos;s new in Maple Heights, Lakeview Terrace, and
              Downtown Corridor this week...
            </span>
          </div>
        </div>

        <div className="mailer-canvas">
          <div className="email-header">
            <span className="email-header-mark">JAMIE</span>
            <span className="email-header-sub">Weekly Real Estate Digest</span>
          </div>

          <p className="email-greeting">Hi there,</p>
          <p className="email-intro">
            Here&apos;s what moved this week — a featured listing worth a
            second look, where prices are trending, and a few reads from the
            blog in case you missed them.
          </p>

          <div className="email-listing">
            <img
              className="email-listing-photo"
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=70&auto=format&fit=crop"
              alt="Featured listing"
            />
            <div className="email-listing-body">
              <span className="email-listing-tag">Featured listing</span>
              <h3 className="email-listing-title">
                14 Ridgeview Court, Oakwood Estates
              </h3>
              <p className="email-listing-price">
                $1,245,000 · 4 bd · 3.5 ba · 3,180 sqft
              </p>
              <p className="email-listing-desc">
                A private pool, walls of glass, and a layout built for
                entertaining — this one won&apos;t stay listed long.
              </p>
              <span className="email-btn">View the listing</span>
            </div>
          </div>

          <div className="email-stats">
            <div className="email-stat">
              <div className="email-stat-num">$612K</div>
              <div className="email-stat-lbl">Median list price</div>
            </div>
            <div className="email-stat">
              <div className="email-stat-num">18</div>
              <div className="email-stat-lbl">Avg. days on market</div>
            </div>
            <div className="email-stat">
              <div className="email-stat-num">9</div>
              <div className="email-stat-lbl">New listings this week</div>
            </div>
          </div>

          <div className="email-section-label">From the blog this week</div>
          <div className="email-blog-list">
            <div className="email-blog-item">
              <img
                className="email-blog-thumb"
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=60&auto=format&fit=crop"
                alt=""
              />
              <div>
                <div className="email-blog-title">
                  Why Maple Heights is becoming the city&apos;s most
                  sought-after family neighborhood
                </div>
                <div className="email-blog-read">Read more →</div>
              </div>
            </div>
            <div className="email-blog-item">
              <img
                className="email-blog-thumb"
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=60&auto=format&fit=crop"
                alt=""
              />
              <div>
                <div className="email-blog-title">
                  Lakeview Terrace waterfront homes: 2026 buyer&apos;s guide
                </div>
                <div className="email-blog-read">Read more →</div>
              </div>
            </div>
            <div className="email-blog-item">
              <img
                className="email-blog-thumb"
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=60&auto=format&fit=crop"
                alt=""
              />
              <div>
                <div className="email-blog-title">
                  Downtown Corridor condo market: what&apos;s selling right
                  now
                </div>
                <div className="email-blog-read">Read more →</div>
              </div>
            </div>
          </div>

          <div className="email-cta">
            <div className="email-cta-title">Thinking about buying or selling?</div>
            <p className="email-cta-desc">
              Reply to this email or book a quick call — happy to walk
              through what your options look like right now.
            </p>
            <span className="email-btn email-btn-light">Let&apos;s talk</span>
          </div>

          <div className="email-footer">
            <div className="email-footer-name">Jamie · Your Local Real Estate Guide</div>
            <div>123 Main Street, Your City, ST 00000</div>
            <div className="email-footer-links">
              <span>Unsubscribe</span>
              <span>·</span>
              <span>Update preferences</span>
              <span>·</span>
              <span>View in browser</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
