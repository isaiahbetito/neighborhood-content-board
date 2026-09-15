import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Canva — Jamie's Content Board" };

export default function CanvaPage() {
  return (
    <StubPage
      icon="🎨"
      title="Canva"
      desc="Jamie's Canva account and marketing assets, organized so templates are easy to find and reuse."
      bullets={[
        "Folder structure by use — listings, social, mailers",
        "Listing flyers built from existing templates and property photos",
        "One place to find the current brand assets",
      ]}
    />
  );
}
