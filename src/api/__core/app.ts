import { Hono } from "hono";
import { cors } from "hono/cors";
import { os, type Router } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

/**
 * TEMPLATE-MANAGED (__ prefix) — do not edit. Feature procedures belong in
 * src/api/routes/, composed in src/api/index.ts.
 *
 * oRPC is the API layer: define procedures on the `router` in src/api/index.ts;
 * they are served at /api/rpc/* and called through the typed clients
 * (web: src/web/lib/api.ts, mobile: lib/api.ts).
 *
 * Hono is only the HTTP mount. Rare plain routes (webhooks, streaming
 * responses, the Better Auth handler) register directly on the app returned
 * by createApp, with full /api/... paths.
 */

/** Per-request context available in every procedure via `context`. */
export interface RpcContext {
  /** Raw request headers — read cookies/authorization for auth. */
  headers: Headers;
}

/** Base procedure builder — chain .input()/.use()/.handler() off this. */
export const base = os.$context<RpcContext>();

/** Assembles the HTTP mount: CORS → /api/health → oRPC procedures at /api/rpc/*. */
export function createApp(router: Router<Record<never, never>, RpcContext>) {
  const app = new Hono().use(
    cors({
      origin: (origin) => origin ?? "*",
      credentials: true,
      // Required so the browser can read the bearer token header set by Better Auth.
      exposeHeaders: ["set-auth-token"],
    }),
  );

  app.get("/api/health", (c) => c.json({ status: "ok" }, 200));

  const handler = new RPCHandler(router);
  app.use("/api/rpc/*", async (c, next) => {
    const { matched, response } = await handler.handle(c.req.raw, {
      prefix: "/api/rpc",
      context: { headers: c.req.raw.headers },
    });
    if (matched) return c.newResponse(response.body, response);
    await next();
  });

  return app;
}
