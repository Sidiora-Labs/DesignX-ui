import * as React from "react";

import { AccountSummary } from "@/components/trading/account-summary";
import { AssetPanel } from "@/components/trading/asset-panel";
import { Candles, ChartPanel, type CandlesType } from "@/components/trading/chart-panel";
import { MarketSelector } from "@/components/trading/market-selector";
import { MarketsTicker } from "@/components/trading/markets-ticker";
import { OrderBookTrades } from "@/components/trading/orderbook-trades";
import { DEFAULT_ORDER_ENTRY_VALUES, OrderEntry, type OrderEntryValues } from "@/components/trading/order-entry";
import type { MarginMode } from "@/components/trading/margin-mode";
import { OrdersTable } from "@/components/trading/orders-table";
import { PositionsTable } from "@/components/trading/positions-table";
import { SymbolInfoBar } from "@/components/trading/symbol-info-bar";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { makeBook, makeCandles, makeTrades, MARKETS, ORDERS, POSITIONS } from "./data";

const AVAILABLE = 12_480.32;
const NEXT_FUNDING = Date.UTC(2026, 9, 22, 16, 0);

export default function Trading01() {
  const [symbol, setSymbol] = React.useState("PERP_BTC_USDC");
  const [favorites, setFavorites] = React.useState<string[]>(["PERP_BTC_USDC", "PERP_SOL_USDC"]);
  const [values, setValues] = React.useState<OrderEntryValues>(DEFAULT_ORDER_ENTRY_VALUES);
  const [leverage, setLeverage] = React.useState(10);
  const [marginMode, setMarginMode] = React.useState<MarginMode>("cross");
  const [chartType, setChartType] = React.useState<CandlesType>("candles");

  const market = MARKETS.find((m) => m.symbol === symbol) ?? MARKETS[0];
  const price = market.price ?? 0;
  const tick = market.tick ?? 0.01;
  const candles = React.useMemo(() => makeCandles(96, price), [price]);
  const book = React.useMemo(() => makeBook(price, tick), [price, tick]);
  const trades = React.useMemo(() => makeTrades(price), [price]);
  const isFavorite = favorites.includes(symbol);
  const toggleFavorite = (s: string, on: boolean) => setFavorites((f) => (on ? [...f, s] : f.filter((x) => x !== s)));

  // Stand-ins for your risk engine — the components only display what you pass.
  const orderPrice = Number(values.price) || price;
  const maxQuantity = orderPrice ? Math.floor(((AVAILABLE * leverage) / orderPrice) * 1e4) / 1e4 : null;

  return (
    <div className="flex min-h-svh flex-col gap-2 bg-background p-2 text-foreground">
      <header className="flex h-12 items-center gap-3 rounded-xl bg-container px-3">
        <span className="text-sm font-semibold tracking-tight">DX Perps</span>
        <MarketSelector
          symbol={symbol}
          markets={MARKETS}
          favorites={favorites}
          onFavoriteChange={toggleFavorite}
          onSymbolSelect={(m) => setSymbol(m.symbol)}
          className="max-md:hidden"
        />
        <div className="ml-auto">
          <AccountSummary
            totalValue={28_412.77}
            freeCollateral={AVAILABLE}
            unrealizedPnl={703.73}
            unrealizedRoi={0.139}
            currentLeverage={2.6}
            marginUsage={0.18}
            address="0x8f3c1a92e4b7d6c05a1f9e3b2c7d84a6e1f0b93d"
            chainName="Arbitrum"
            onDeposit={() => toast("Open your deposit flow")}
            onWithdraw={() => toast("Open your withdraw flow")}
          />
        </div>
      </header>

      <MarketsTicker markets={MARKETS} activeSymbol={symbol} onSymbolClick={setSymbol} autoScroll={false} />

      <SymbolInfoBar
        symbol={symbol}
        price={price}
        change={market.change}
        tick={tick}
        maxLeverage={market.maxLeverage}
        markPrice={price * 0.99994}
        indexPrice={price * 0.9998}
        volume24h={market.volume24h}
        openInterest={market.openInterest}
        fundingRate={market.fundingRate}
        nextFundingTime={NEXT_FUNDING}
        favorite={isFavorite}
        onFavoriteChange={(on) => toggleFavorite(symbol, on)}
      />

      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_300px_320px]">
        <ChartPanel
          chartType={chartType}
          onChartTypeChange={setChartType}
          className="min-h-[420px] rounded-xl"
          bodyClassName="p-2"
        >
          <Candles data={candles} type={chartType} tick={tick} showVolume showLastPrice showLegend className="h-full min-h-[360px]" />
        </ChartPanel>

        <OrderBookTrades
          bids={book.bids}
          asks={book.asks}
          trades={trades}
          lastPrice={price}
          tick={tick}
          base={market.symbol.split("_")[1]}
          quote="USDC"
          className="rounded-xl"
        />

        <div className="flex flex-col gap-2">
          <div className="rounded-xl bg-container p-3">
            <OrderEntry
              symbol={symbol}
              tick={tick}
              values={values}
              onValuesChange={setValues}
              referencePrice={price}
              midPrice={price}
              maxQuantity={maxQuantity}
              available={AVAILABLE}
              marginMode={marginMode}
              onMarginModeChange={setMarginMode}
              leverage={leverage}
              maxLeverage={market.maxLeverage}
              onLeverageChange={setLeverage}
              fees={{ taker: 0.0005, maker: 0.0002 }}
              onSubmit={(v) => toast.success(`${v.side === "buy" ? "Buy" : "Sell"} ${v.quantity || 0} ${market.symbol.split("_")[1]} submitted`)}
            />
          </div>
          <AssetPanel
            totalValue={28_412.77}
            unrealizedPnl={703.73}
            unrealizedRoi={0.139}
            freeCollateral={AVAILABLE}
            marginRatio={0.381}
            maintenanceMarginRatio={0.024}
            currentLeverage={2.6}
            onDeposit={() => toast("Open your deposit flow")}
            onWithdraw={() => toast("Open your withdraw flow")}
          />
        </div>
      </div>

      <Tabs defaultValue="positions" className="rounded-xl bg-container p-3">
        <TabsList variant="line">
          <TabsTrigger value="positions">Positions ({POSITIONS.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="positions">
          <PositionsTable
            positions={POSITIONS}
            onClose={(p, type) => toast(`Close ${p.symbol} at ${type}`)}
            onCloseAll={() => toast("Close all positions")}
            onSymbolClick={(p) => setSymbol(p.symbol)}
          />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTable
            orders={ORDERS}
            onCancel={(o) => toast(`Cancel order ${o.id}`)}
            onCancelAll={() => toast("Cancel all orders")}
            onSymbolClick={(o) => setSymbol(o.symbol)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
