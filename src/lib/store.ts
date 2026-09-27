import { redis } from "@/lib/redis";

function keyFor(pathname: string) {
  return pathname.replace(/\.json$/, "");
}

export async function readItems<T>(pathname: string): Promise<T[] | null> {
  try {
    const data = await redis.get<T[]>(keyFor(pathname));
    return data ?? null;
  } catch {
    return null;
  }
}

export async function writeItems<T>(pathname: string, items: T[]): Promise<T[]> {
  await redis.set(keyFor(pathname), items);
  return items;
}
