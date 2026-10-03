import { useCallback, useState } from "react";

function faviconFor(url?: string) {
  if (!url) return null;
  try {
    const { hostname } = new URL(url.includes("://") ? url : `https://${url}`);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
}

/**
 * Favicon for a URL. Attach `ref` to the `<img>`: if the icon fails to load,
 * `src` becomes null so the caller can render a fallback.
 */
export function useFavicon(url?: string) {
  const [failed, setFailed] = useState<string | null>(null);
  const candidate = faviconFor(url);
  const src = candidate && failed !== candidate ? candidate : null;
  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img || !candidate) return;
      const onError = () => setFailed(candidate);
      if (img.complete && img.naturalWidth === 0 && img.src) onError();
      img.addEventListener("error", onError, { once: true });
    },
    [candidate],
  );
  return { src, ref };
}
