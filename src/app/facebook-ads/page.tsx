import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Facebook Ads — Jamie's Content Board" };

export default function FacebookAdsPage() {
  return (
    <StubPage
      icon="📣"
      title="Facebook Ads"
      desc="Built and launched when Jamie asks for one — not a fixed weekly task, but ready to move fast when it comes up."
      bullets={[
        "Turn a listing or promo into ad creative",
        "Set targeting, budget, and run dates",
        "Report back on results once it's live",
      ]}
    />
  );
}
