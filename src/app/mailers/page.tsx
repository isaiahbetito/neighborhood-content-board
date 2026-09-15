import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Mailers — Jamie's Content Board" };

export default function MailersPage() {
  return (
    <StubPage
      icon="✉️"
      title="Mailers"
      desc="Jamie's weekly email newsletter, prepared and sent through Mailchimp on a consistent schedule."
      bullets={[
        "Pull the week's top posts and listings into the template",
        "Send consistently on the same day each week",
        "Track opens and clicks so Jamie can see what's working",
      ]}
    />
  );
}
