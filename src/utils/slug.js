export function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

/** Ensure unique slug — appends -1, -2 etc on collision. */
export async function uniqueSlug(db, table, base, ignoreId = null) {
  let slug = base || 'item';
  let i = 1;
  while (true) {
    const sql = ignoreId
      ? `SELECT id FROM ${table} WHERE slug = ? AND id != ? LIMIT 1`
      : `SELECT id FROM ${table} WHERE slug = ? LIMIT 1`;
    const params = ignoreId ? [slug, ignoreId] : [slug];
    const row = await db.prepare(sql).bind(...params).first();
    if (!row) return slug;
    slug = `${base}-${i++}`;
  }
}
