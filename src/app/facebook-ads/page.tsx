import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Facebook Ads — Jamie Meushaw Real Estate" };

export default function FacebookAdsPage() {
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
          Built and launched when Jamie asks for one — turning a listing or
          promo into ad creative within a day.
        </p>
        <span className="sample-tag">two sample ads, ready to launch</span>
      </div>

      <div className="fb-ads-wrap">
        <div className="chrome-frame" style={{ margin: "0 auto" }}>
          <div className="chrome-bar">
            <span className="chrome-dot"></span>
            <span className="chrome-dot"></span>
            <span className="chrome-dot"></span>
            <span className="chrome-label">Ad preview · Meta Ads Manager</span>
          </div>
          <div className="fb-ad" style={{ boxShadow: "none", border: "none" }}>
            <div className="fb-ad-head">
              <div className="fb-ad-avatar">J</div>
              <div>
                <div className="fb-ad-page">Jamie Meushaw Real Estate</div>
                <div className="fb-ad-meta">Sponsored · 🌐</div>
              </div>
              <div className="fb-ad-menu">···</div>
            </div>
            <div className="fb-ad-copy">
              🔑 Just listed in Deer Creek, Camas — priced for first-time
              buyers and won&apos;t last. Tap to see the full listing before
              it&apos;s gone.
            </div>
            <img
              className="fb-ad-photo"
              src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=70&auto=format&fit=crop"
              alt="Just listed home"
            />
            <div className="fb-ad-info">
              <div>
                <div className="fb-ad-domain">jamiemeushawrealestate.com</div>
                <div className="fb-ad-headline">New Listing: Deer Creek, Camas</div>
                <div className="fb-ad-desc">3 bd · 2 ba · Under $600K</div>
              </div>
              <span className="fb-ad-cta">Learn More</span>
            </div>
            <div className="fb-ad-engage">
              <span>👍 128 · 14 comments</span>
              <span>6 shares</span>
            </div>
          </div>
        </div>

        <div className="chrome-frame" style={{ margin: "0 auto" }}>
          <div className="chrome-bar">
            <span className="chrome-dot"></span>
            <span className="chrome-dot"></span>
            <span className="chrome-dot"></span>
            <span className="chrome-label">Ad preview · Meta Ads Manager</span>
          </div>
          <div className="fb-ad" style={{ boxShadow: "none", border: "none" }}>
            <div className="fb-ad-head">
              <div className="fb-ad-avatar">J</div>
              <div>
                <div className="fb-ad-page">Jamie Meushaw Real Estate</div>
                <div className="fb-ad-meta">Sponsored · 🌐</div>
              </div>
              <div className="fb-ad-menu">···</div>
            </div>
            <div className="fb-ad-copy">
              🏡 Open house this Saturday in Holly Ridge, Camas, 12–3pm. Family
              home, big backyard, walk to the lake. Stop by, no appointment
              needed.
            </div>
            <img
              className="fb-ad-photo"
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=70&auto=format&fit=crop"
              alt="Open house home"
            />
            <div className="fb-ad-info">
              <div>
                <div className="fb-ad-domain">jamiemeushawrealestate.com</div>
                <div className="fb-ad-headline">Open House · Holly Ridge, Camas</div>
                <div className="fb-ad-desc">Saturday, 12:00–3:00 PM</div>
              </div>
              <span className="fb-ad-cta">Send Message</span>
            </div>
            <div className="fb-ad-engage">
              <span>👍 96 · 9 comments</span>
              <span>3 shares</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
