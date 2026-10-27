const API_ORIGIN = ((import.meta.env.VITE_API_URL as string) || "").replace(/\/api\/?$/, "");

export const getImageUrl = (url?: string): string | null => {
  if (!url) return null;
  if (/^(https?:|data:)/.test(url)) return url;
  return `${API_ORIGIN}${url}`;
};