import { FundingComparison, type FundingComparisonRow, type FundingVenue } from "@/components/trading/funding-comparison";

// Illustrative rates only. Rates are per each venue's own settlement interval.
const VENUES: FundingVenue[] = [
  { id: "dx", label: "DX", intervalHours: 8 },
  { id: "binance", label: "Binance", intervalHours: 8 },
  { id: "okx", label: "OKX", intervalHours: 8 },
  { id: "bybit", label: "Bybit", intervalHours: 8 },
  { id: "hyperliquid", label: "Hyperliquid", intervalHours: 1 },
];

const ROWS: FundingComparisonRow[] = [
  {
    symbol: "PERP_BTC_USDC",
    maxLeverage: 50,
    openInterest: 412_600_000,
    rates: { dx: 0.000125, binance: 0.0001, okx: 0.000092, bybit: 0.000108, hyperliquid: 0.0000125 },
    lastRate: 0.0001,
    averages: { "1d": 0.00011, "3d": 0.000102, "7d": 0.000095, "14d": 0.000088, "30d": 0.000081, "90d": 0.000074 },
    positiveShare: { "1d": 1, "3d": 0.89, "7d": 0.86, "14d": 0.81, "30d": 0.77, "90d": 0.72 },
  },
  {
    symbol: "PERP_ETH_USDC",
    maxLeverage: 50,
    openInterest: 228_900_000,
    rates: { dx: 0.0001, binance: 0.000084, okx: 0.0001, bybit: 0.000076, hyperliquid: 0.0000108 },
    lastRate: 0.000096,
    averages: { "1d": 0.000094, "3d": 0.000088, "7d": 0.00008, "14d": 0.000071, "30d": 0.000069, "90d": 0.000062 },
    positiveShare: { "1d": 1, "3d": 0.78, "7d": 0.81, "14d": 0.74, "30d": 0.71, "90d": 0.68 },
  },
  {
    symbol: "PERP_SOL_USDC",
    maxLeverage: 20,
    openInterest: 96_200_000,
    rates: { dx: 0.00021, binance: 0.00015, okx: 0.00018, bybit: 0.00012, hyperliquid: 0.000022 },
    lastRate: 0.00019,
    averages: { "1d": 0.0002, "3d": 0.00017, "7d": 0.00014, "14d": 0.00012, "30d": 0.0001, "90d": 0.000093 },
    positiveShare: { "1d": 1, "3d": 0.89, "7d": 0.9, "14d": 0.86, "30d": 0.8, "90d": 0.76 },
  },
  {
    symbol: "PERP_HYPE_USDC",
    maxLeverage: 10,
    openInterest: 61_400_000,
    rates: { dx: 0.00034, binance: 0.00041, okx: null, bybit: 0.00029, hyperliquid: 0.000038 },
    lastRate: 0.00031,
    averages: { "1d": 0.00033, "3d": 0.00029, "7d": 0.00026, "14d": 0.00022, "30d": null, "90d": null },
    positiveShare: { "1d": 1, "3d": 1, "7d": 0.95, "14d": 0.9, "30d": null, "90d": null },
  },
  {
    symbol: "PERP_SUI_USDC",
    maxLeverage: 10,
    openInterest: 18_800_000,
    rates: { dx: -0.00004, binance: -0.00002, okx: -0.000061, bybit: 0.00001, hyperliquid: -0.0000041 },
    lastRate: -0.000052,
    averages: { "1d": -0.00003, "3d": -0.000011, "7d": 0.000008, "14d": 0.000021, "30d": 0.000034, "90d": 0.000047 },
    positiveShare: { "1d": 0, "3d": 0.33, "7d": 0.52, "14d": 0.6, "30d": 0.64, "90d": 0.67 },
  },
  {
    symbol: "PERP_TIA_USDC",
    maxLeverage: 10,
    openInterest: 6_100_000,
    rates: { dx: -0.00019, binance: -0.00025, okx: -0.00014, bybit: -0.00022, hyperliquid: -0.000027 },
    lastRate: -0.00021,
    averages: { "1d": -0.0002, "3d": -0.00016, "7d": -0.00011, "14d": -0.00006, "30d": -0.00002, "90d": 0.000015 },
    positiveShare: { "1d": 0, "3d": 0, "7d": 0.14, "14d": 0.29, "30d": 0.41, "90d": 0.55 },
  },
];

export default function FundingComparisonDemo() {
  return (
    <div className="w-full max-w-5xl rounded-2xl bg-container p-4 sm:p-6">
      <FundingComparison rows={ROWS} venues={VENUES} homeVenue="dx" defaultView="comparison" onSymbolSelect={() => {}} />
    </div>
  );
}
