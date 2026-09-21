import { NextResponse } from "next/server";
import { readItems, writeItems } from "@/lib/store";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["mailers", "facebook-ads", "canva"]);

function pathnameFor(board: string) {
  return `${board}-board.json`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ board: string }> }
) {
  const { board } = await params;
  if (!ALLOWED.has(board)) {
    return NextResponse.json({ error: "Unknown board" }, { status: 404 });
  }
  const items = await readItems<Record<string, unknown>>(pathnameFor(board));
  return NextResponse.json({ items });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ board: string }> }
) {
  const { board } = await params;
  if (!ALLOWED.has(board)) {
    return NextResponse.json({ error: "Unknown board" }, { status: 404 });
  }
  const body = (await request.json()) as { items: Record<string, unknown>[] };
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const saved = await writeItems(pathnameFor(board), body.items);
  return NextResponse.json({ items: saved });
}
