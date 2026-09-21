import type { Metadata } from "next";
import MailersClient from "./MailersClient";

export const metadata: Metadata = { title: "Mailers — Jamie Meushaw Real Estate" };

export default function MailersPage() {
  return <MailersClient />;
}
