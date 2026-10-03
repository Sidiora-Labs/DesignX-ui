/** Public registry base — the deployed docs site serves /r/<name>.json. */
export const registryOrigin = typeof window !== "undefined" ? window.location.origin : "https://dxuireact.com";
export const registryTemplate = `${registryOrigin}/r/{name}.json`;
