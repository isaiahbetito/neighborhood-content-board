import { redis } from "@/lib/redis";

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

const BOARD_KEY = "content-board";

export async function readPosts(): Promise<Post[] | null> {
  try {
    const data = await redis.get<Post[]>(BOARD_KEY);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function writePosts(posts: Post[]): Promise<Post[]> {
  await redis.set(BOARD_KEY, posts);
  return posts;
}
