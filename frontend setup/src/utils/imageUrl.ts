const API_ORIGIN = (import.meta.env.VITE_API_URL as string).replace(/\/api\/?$/, "");

export const getImageUrl = (url?: string): string | null => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
};