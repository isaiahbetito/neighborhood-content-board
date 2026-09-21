import type { Metadata } from "next";
import FacebookAdsClient from "./FacebookAdsClient";

export const metadata: Metadata = { title: "Facebook Ads — Jamie Meushaw Real Estate" };

export default function FacebookAdsPage() {
  return <FacebookAdsClient />;
}
