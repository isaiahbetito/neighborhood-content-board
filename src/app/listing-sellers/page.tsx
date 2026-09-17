import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Listing Sellers — Jamie Meushaw Real Estate" };

type Row = {
  seller: string;
  address: string;
  listed: string;
  lastContact: string;
  nextFollowUp: string;
  overdue: boolean;
  note: string;
};

const ROWS: Row[] = [
  {
    seller: "Karen Whitfield",
    address: "1518 NW Holly Ridge Ln, Camas, WA",
    listed: "Aug 22",
    lastContact: "Sep 12",
    nextFollowUp: "Sep 19",
    overdue: false,
    note: "Comfortable with pricing, no changes needed.",
  },
  {
    seller: "Marcus Bell",
    address: "4471 NE Lakeshore Ave, Vancouver, WA",
    listed: "Jul 30",
    lastContact: "Sep 7",
    nextFollowUp: "Sep 14",
    overdue: true,
    note: "Wants to discuss a price reduction — call first thing.",
  },
  {
    seller: "The Alvarez Family",
    address: "2209 NE Columbia Way, Vancouver, WA",
    listed: "Sep 3",
    lastContact: "Sep 14",
    nextFollowUp: "Sep 21",
    overdue: false,
    note: "Two showings booked this week.",
  },
  {
    seller: "Priya Nair",
    address: "915 SE Pleasant Valley Rd, Vancouver, WA",
    listed: "Jun 15",
    lastContact: "Sep 5",
    nextFollowUp: "Sep 12",
    overdue: true,
    note: "On the market 90+ days — bring a refreshed strategy.",
  },
  {
    seller: "Tom & Diane Ruiz",
    address: "2210 NW Hunter Ridge Dr, Camas, WA",
    listed: "Sep 10",
    lastContact: "Sep 16",
    nextFollowUp: "Sep 23",
    overdue: false,
    note: "New listing — first check-in after week one.",
  },
  {
    seller: "Grace Lin",
    address: "3312 NE Harney Heights Ct, Vancouver, WA",
    listed: "Aug 5",
    lastContact: "Sep 11",
    nextFollowUp: "Sep 18",
    overdue: false,
    note: "Happy with current showing traffic.",
  },
];

export default function ListingSellersPage() {
  return (
    <div className="page-body">
      <div className="page-top">
        <Link href="/" className="back-link">
          ← Content Board
        </Link>
      </div>

      <div className="demo-hero">
        <div className="demo-icon">🏡</div>
        <h1 className="demo-title">Listing Sellers</h1>
        <p className="demo-desc">
          One follow-up touchpoint per active seller, every week — nothing
          falls through.
        </p>
        <span className="sample-tag">sample tracker for this week&apos;s active sellers</span>
      </div>

      <div className="tracker-wrap">
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Seller</th>
              <th>Listed</th>
              <th>Last contact</th>
              <th>Next follow-up</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.seller}>
                <td>
                  <div className="tracker-seller">{r.seller}</div>
                  <div className="tracker-address">{r.address}</div>
                </td>
                <td>{r.listed}</td>
                <td>{r.lastContact}</td>
                <td>
                  <span className={`tracker-due ${r.overdue ? "overdue" : ""}`}>
                    {r.nextFollowUp}
                    {r.overdue ? " · overdue" : ""}
                  </span>
                </td>
                <td className="tracker-note">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
