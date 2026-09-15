import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Listing Sellers — Jamie's Content Board" };

export default function ListingSellersPage() {
  return (
    <StubPage
      icon="🏡"
      title="Listing Sellers"
      desc="Weekly check-ins with every seller currently on the market."
      bullets={[
        "One follow-up touchpoint per seller, per week",
        "Consistent cadence — nothing falls through",
        "Notes logged so Jamie can see the history",
      ]}
    />
  );
}
