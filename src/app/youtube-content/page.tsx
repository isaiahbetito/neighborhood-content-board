import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "YouTube Content — Jamie's Content Board" };

export default function YoutubeContentPage() {
  return (
    <StubPage
      icon="🎬"
      title="YouTube Content"
      desc="Older long-form videos, reviewed and repurposed into short-form clips as needed."
      bullets={[
        "Review older videos for clip-worthy moments",
        "Cut into Shorts with captions",
        "Post to YouTube Shorts and social",
      ]}
    />
  );
}
