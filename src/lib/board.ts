import { head, put } from "@vercel/blob";

export type Status =
  | "Not Started"
  | "Drafted"
  | "Ready for Review"
  | "Scheduled"
  | "Published";

export type Post = {
  id: string;
  date: string;
  day: string;
  time: string;
  area: string;
  areaUrl: string;
  title: string;
  keyword: string;
  status: Status;
  platforms: { gbp: Status; w1: Status; w2: Status; li: Status };
};

const BOARD_PATHNAME = "content-board.json";

export async function readPosts(): Promise<Post[] | null> {
  try {
    const meta = await head(BOARD_PATHNAME);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) throw new Error("blob fetch failed");
    return (await res.json()) as Post[];
  } catch {
    return null;
  }
}

export async function writePosts(posts: Post[]): Promise<Post[]> {
  await put(BOARD_PATHNAME, JSON.stringify(posts, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
  return posts;
}
