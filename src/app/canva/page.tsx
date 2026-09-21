import type { Metadata } from "next";
import CanvaClient from "./CanvaClient";

export const metadata: Metadata = { title: "Canva — Jamie Meushaw Real Estate" };

export default function CanvaPage() {
  return <CanvaClient />;
}
