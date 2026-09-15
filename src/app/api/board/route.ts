import { NextResponse } from "next/server";
import { readPosts, writePosts, type Post } from "@/lib/board";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await readPosts();
  return NextResponse.json({ posts });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { posts: Post[] };

  if (!body || !Array.isArray(body.posts)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const saved = await writePosts(body.posts);
  return NextResponse.json({ posts: saved });
}
