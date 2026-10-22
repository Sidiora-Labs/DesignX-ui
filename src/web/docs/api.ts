import { uiApi } from "./api-ui";
import { uiApi2 } from "./api-ui-2";
import { dxApi } from "./api-dx";
import { dxApi2 } from "./api-dx-2";
import { dxApi3 } from "./api-dx-3";
import { tradingApi } from "./api-trading";
import { tradingApiMarkets } from "./api-trading-markets";
import { tradingApiOrder } from "./api-trading-order";
import { tradingApiPositions } from "./api-trading-positions";
import { tradingApiAccount } from "./api-trading-account";
import { tradingApiCommunity } from "./api-trading-community";
import { tradingApiVaults } from "./api-trading-vaults";

/** [prop, type, default?, description?] */
export type PropRow = [name: string, type: string, def?: string, desc?: string];

export type ApiDoc = {
  usage?: string;
  notes?: string;
  align?: "center" | "start";
  previewHeight?: number;
  exampleTitles?: Record<string, string>;
  props?: { component: string; description?: string; rows: PropRow[] }[];
};

export const apiDocs: Record<string, ApiDoc> = { ...uiApi, ...uiApi2, ...dxApi, ...dxApi2, ...dxApi3, ...tradingApi, ...tradingApiMarkets, ...tradingApiOrder, ...tradingApiPositions, ...tradingApiAccount, ...tradingApiCommunity, ...tradingApiVaults };
