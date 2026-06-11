const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/;

export function parseFrontmatter(content: string): { meta: Record<string, string> | null; body: string } {
  const match = content.match(FRONTMATTER_RE);
  if (!match) return { meta: null, body: content };

  const raw = match[1];
  const body = match[2];
  const meta: Record<string, string> = {};

  for (const line of raw.split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (key && val) meta[key] = val;
    }
  }

  return { meta: Object.keys(meta).length > 0 ? meta : null, body };
}
