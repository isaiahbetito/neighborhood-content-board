import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Canva — Jamie Meushaw Real Estate" };

const FOLDERS = [
  { icon: "🏷️", name: "Listing Flyers", count: "12 designs" },
  { icon: "📱", name: "Social Posts", count: "34 designs" },
  { icon: "✉️", name: "Mailer Templates", count: "6 designs" },
  { icon: "🪧", name: "Open House Signs", count: "8 designs" },
  { icon: "🎉", name: "Just Sold Graphics", count: "9 designs" },
  { icon: "🎨", name: "Brand Kit", count: "logos, fonts, colors" },
];

export default function CanvaPage() {
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
        <span className="sample-tag">sample folder structure + one flyer</span>
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
        <span className="sample-tag">
          one listing flyer, built from the template + a real photo
        </span>
      </div>

      <div className="flyer-wrap" style={{ marginBottom: 64 }}>
        <div className="flyer">
          <img
            className="flyer-photo"
            src="https://images.unsplash.com/photo-1592595896616-c37162298647?w=700&q=70&auto=format&fit=crop"
            alt="Listing photo"
          />
          <div className="flyer-band">Just Listed</div>
          <div className="flyer-body">
            <div className="flyer-price">$625,000</div>
            <div className="flyer-address">1518 NW Holly Ridge Ln, Camas, WA</div>
            <div className="flyer-specs">
              <div className="flyer-spec">
                <div className="flyer-spec-num">4</div>
                <div className="flyer-spec-lbl">Beds</div>
              </div>
              <div className="flyer-spec">
                <div className="flyer-spec-num">2.5</div>
                <div className="flyer-spec-lbl">Baths</div>
              </div>
              <div className="flyer-spec">
                <div className="flyer-spec-num">2,340</div>
                <div className="flyer-spec-lbl">Sqft</div>
              </div>
            </div>
            <ul className="flyer-features">
              <li>Updated kitchen with quartz counters</li>
              <li>Fenced backyard, mature trees</li>
              <li>Walk to Lacamas Lake</li>
            </ul>
            <div className="flyer-contact">
              <div className="flyer-contact-avatar">J</div>
              <div>
                <div className="flyer-contact-name">Jamie Meushaw · Jamie Meushaw Real Estate</div>
                <div className="flyer-contact-phone">(360) 798-7127 · jamiemeushawrealestate.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
