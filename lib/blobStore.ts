import { put, list, del } from "@vercel/blob";

export async function putRecord<T>(prefix: string, id: string, data: T): Promise<void> {
  const key = `iyg/${prefix}/${id}.json`;
  await put(key, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function listRecords<T>(prefix: string): Promise<T[]> {
  const { blobs } = await list({ prefix: `iyg/${prefix}/` });
  const results: T[] = [];
  for (const blob of blobs) {
    try {
      const res = await fetch(blob.url);
      if (res.ok) {
        results.push(await res.json() as T);
      }
    } catch {
      // skip corrupt records
    }
  }
  return results;
}

export async function deleteRecord(prefix: string, id: string): Promise<void> {
  const { blobs } = await list({ prefix: `iyg/${prefix}/${id}` });
  for (const blob of blobs) {
    await del(blob.url);
  }
}
