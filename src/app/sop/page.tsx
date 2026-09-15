import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "SOP — Jamie's Content Board" };

export default function SopPage() {
  return (
    <StubPage
      icon="🗂️"
      title="SOP"
      desc="The AI workflows and prompts behind every recurring task, organized so they're easy to find and reuse."
      bullets={[
        "Claude & ChatGPT folders organized by task — blog writing, SEO, and more",
        "Prompts documented so anyone can pick them up",
        "Built from Jamie's own how-to videos where available",
      ]}
    />
  );
}
