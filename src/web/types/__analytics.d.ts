interface StonksAnalytics {
  event: (
    name: string,
    pathOrProps?: string | Record<string, unknown>,
    props?: Record<string, unknown>,
  ) => void;
  view: (pathOrProps?: string | Record<string, unknown>, props?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    stonks: StonksAnalytics;
  }
}
export {};
