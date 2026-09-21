import { head, put } from "@vercel/blob";

export async function readItems<T>(pathname: string): Promise<T[] | null> {
  try {
    const meta = await head(pathname);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) throw new Error("blob fetch failed");
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

export async function writeItems<T>(pathname: string, items: T[]): Promise<T[]> {
  await put(pathname, JSON.stringify(items, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
  return items;
}
