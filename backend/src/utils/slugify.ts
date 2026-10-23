export const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const uniqueSlug = (text: string) =>
  `${slugify(text)}-${Math.random().toString(36).slice(2, 7)}`;