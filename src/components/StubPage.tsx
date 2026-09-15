import Link from "next/link";

export default function StubPage({
  icon,
  title,
  desc,
  bullets,
}: {
  icon: string;
  title: string;
  desc: string;
  bullets: string[];
}) {
  return (
    <div className="stub-body">
      <div className="stub-top">
        <Link href="/" className="back-link">
          ← Jamie&apos;s Content Board
        </Link>
      </div>
      <div className="stub-hero">
        <div className="stub-icon">{icon}</div>
        <h1 className="stub-title">{title}</h1>
        <p className="stub-desc">{desc}</p>
        <ul className="stub-list">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="stub-note">
          Full tracker for this section — built out the same way as Blogs.
        </p>
      </div>
    </div>
  );
}
