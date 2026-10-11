import type React from "react";

/**
 * Sample wordmarks for the logo-cloud blocks. These are fictional brands —
 * swap them for your customers' logos.
 */

const wordmark = (name: string, mark: React.ReactNode) =>
  function Logo() {
    return (
      <svg
        aria-label={name}
        fill="currentColor"
        height="40"
        role="img"
        viewBox="0 0 136 40"
        width="136"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{name}</title>
        <g>{mark}</g>
        <text
          dominantBaseline="central"
          fontFamily="inherit"
          fontSize="17"
          fontWeight="600"
          letterSpacing="-0.4"
          x="33"
          y="20.5"
        >
          {name}
        </text>
      </svg>
    );
  };

export const Lumora = wordmark("Lumora", <><circle cx="14" cy="20" r="9" /><circle cx="14" cy="20" r="4" fill="var(--color-background, #fff)" /></>);
export const Kestrel = wordmark("Kestrel", <><path d="M5 29 L14 9 L23 29 Z" /></>);
export const Halden = wordmark("Halden", <><rect x="6" y="11" width="18" height="18" rx="4" /></>);
export const Orbitly = wordmark("Orbitly", <><circle cx="11" cy="20" r="6" /><circle cx="20" cy="20" r="6" opacity="0.55" /></>);
export const Quillo = wordmark("Quillo", <><path d="M14 9a11 11 0 1 0 0 22h9V20A11 11 0 0 0 14 9Z" /></>);
export const Fernway = wordmark("Fernway", <><path d="M6 30c0-12 8-20 18-20 0 12-8 20-18 20Z" /></>);
export const Vantis = wordmark("Vantis", <><path d="M5 11h7l3 12 3-12h7l-7 19h-6Z" /></>);
export const Brightloom = wordmark("Brightloom", <><path d="M14 7l3.2 9.8H27l-8 5.8 3 9.4-8-5.8-8 5.8 3-9.4-8-5.8h9.8Z" /></>);
export const Northpeak = wordmark("Northpeak", <><path d="M4 30 L12 14 L17 22 L21 16 L26 30 Z" /></>);
export const Cobalto = wordmark("Cobalto", <><rect x="5" y="11" width="8" height="8" rx="2" /><rect x="15" y="11" width="8" height="8" rx="2" opacity="0.55" /><rect x="5" y="21" width="8" height="8" rx="2" opacity="0.55" /><rect x="15" y="21" width="8" height="8" rx="2" /></>);
export const Mosaica = wordmark("Mosaica", <><path d="M14 8 25 14v12l-11 6-11-6V14Z" /></>);
export const Tidepool = wordmark("Tidepool", <><path d="M4 22c4-6 8-6 12 0s8 6 12 0v6c-4 6-8 6-12 0s-8-6-12 0Z" /></>);
