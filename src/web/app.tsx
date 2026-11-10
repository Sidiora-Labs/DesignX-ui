import * as React from "react";
import { Route, Switch } from "wouter";
import Index from "./pages/index";
import NotFound from "./pages/not-found";
import { Provider } from "./components/provider";
import { DocsShell } from "./docs/docs-layout";
import { SearchProvider } from "./docs/search";
import { SiteFooter } from "./docs/site-footer";
import { SiteHeader } from "./docs/site-header";
import { APPLIED_THEME_KEY, mountAppliedTheme, readAppliedConfig } from "./themes/generate";
import { AgentFeedback } from "@runablehq/website-runtime";

const BlocksPage = React.lazy(() => import("./pages/blocks"));
const BlockView = React.lazy(() => import("./pages/block-view"));
const BlockDetail = React.lazy(() => import("./pages/block-detail"));
const ComponentsIndex = React.lazy(() => import("./pages/docs/components-index"));
const ThemesPage = React.lazy(() => import("./pages/themes"));
const GuidePage = React.lazy(() => import("./pages/docs/guide"));
const ComponentDocPage = React.lazy(() => import("./pages/docs/component"));

function DocsRoutes() {
  return (
    <DocsShell>
      <React.Suspense fallback={<div className="min-h-[60svh]" />}>
        <Switch>
          <Route path="/docs" component={GuidePage} />
          <Route path="/docs/components" component={ComponentsIndex} />
          <Route path="/docs/components/:slug" component={ComponentDocPage} />
          <Route path="/docs/:guide" component={GuidePage} />
        </Switch>
      </React.Suspense>
    </DocsShell>
  );
}

function Fallback() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4">
        <NotFound />
      </main>
      <SiteFooter />
    </div>
  );
}

/** Mounts the theme chosen in the generator, and follows changes made in other tabs or frames. */
function useAppliedTheme() {
  React.useEffect(() => {
    mountAppliedTheme(readAppliedConfig());
    const onStorage = (e: StorageEvent) => {
      if (e.key === APPLIED_THEME_KEY) mountAppliedTheme(readAppliedConfig());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}

function App() {
  useAppliedTheme();
  return (
    <Provider>
      <SearchProvider>
        <React.Suspense fallback={<div className="min-h-svh" />}>
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/blocks/view/:slug" component={BlockView} />
            <Route path="/blocks/:slug" component={BlockDetail} />
            <Route path="/blocks" component={BlocksPage} />
            <Route path="/themes" component={ThemesPage} />
            <Route path="/docs" component={DocsRoutes} />
            <Route path="/docs/*" component={DocsRoutes} />
            <Route component={Fallback} />
          </Switch>
        </React.Suspense>
      </SearchProvider>
      {/* Do not removeoff by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
    </Provider>
  );
}

export default App;
