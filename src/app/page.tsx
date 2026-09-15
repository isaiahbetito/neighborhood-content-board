import Image from "next/image";
import Link from "next/link";

const SECTIONS = [
  {
    href: "/blogs",
    icon: "📝",
    title: "Blogs",
    desc: "3 SEO blog posts a day, rotating across every neighborhood.",
  },
  {
    href: "/mailers",
    icon: "✉️",
    title: "Mailers",
    desc: "Weekly Mailchimp newsletter, prepped and sent on schedule.",
  },
  {
    href: "/facebook-ads",
    icon: "📣",
    title: "Facebook Ads",
    desc: "Ads built and launched whenever the client needs a push.",
  },
  {
    href: "/youtube-content",
    icon: "🎬",
    title: "YouTube Content",
    desc: "Older videos repurposed into Shorts.",
  },
  {
    href: "/canva",
    icon: "🎨",
    title: "Canva",
    desc: "Templates and marketing assets, organized and ready to reuse.",
  },
  {
    href: "/sop",
    icon: "🗂️",
    title: "SOP",
    desc: "Claude & ChatGPT workflows, organized so nothing gets lost.",
  },
  {
    href: "/listing-sellers",
    icon: "🏡",
    title: "Listing Sellers",
    desc: "Weekly follow-ups for every active seller.",
  },
];

export default function Home() {
  return (
    <div className="hub-body">
      <div className="hub-hero">
        <Image
          src="/logo.png"
          alt="Jamie's Content Board"
          width={688}
          height={666}
          priority
          className="hub-logo"
        />
        <h1 className="hub-title">Jamie&apos;s Content Board</h1>
        <div className="hub-grid">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="hub-card">
              <span className="hub-card-icon">{s.icon}</span>
              <span className="hub-card-title">{s.title}</span>
              <span className="hub-card-desc">{s.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
