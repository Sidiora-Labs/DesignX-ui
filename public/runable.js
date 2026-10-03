"use strict";
(() => {
  var v = "https://collector.onedollarstats.com/events";
  var R = (g, i) => {
    let l = document.createElement("style");
    ((l.textContent = `
  .dev-modal {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #f6f6f7;
    color: #21272F;
    padding: 14px;
    border-radius: 8px;
    max-width: 340px;
    max-height: 180px;
    overflow-y: none;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    font-family: sans-serif;
    z-index: 99999;
    animation: slideIn 0.3s ease-out;
  }

  .dev-modal .title {
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 500;
    margin: 0 0 6px 0;
    letter-spacing: 0.5px;
  }

  .dev-modal p {
    margin: 4px 0;
    font-size: 14px;
    display: flex;
    align-items: flex-start;
    gap: 4px;
  }

  .dev-modal .text {
    word-break: break-word;
  }

  .dev-modal p svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin-top: 1px;
  }

  .dev-modal .close-btn {
    position: absolute;
    top: 2px;
    right: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }`),
      document.head.appendChild(l));
    let r = document.createElement("div");
    if (
      ((r.className = "dev-modal"),
      (r.innerHTML = `
      <button class="close-btn">&times;</button>
      <p class="title">
        onedollarstats debug window
      </p>
      <p>
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
       <span class="text">${`Tracking localhost as ${g}`}</span>
      </p>
      <div id="event-log" style="max-height: 100px; overflow-y: auto;" />
    `),
      document.body.appendChild(r),
      r.querySelector(".close-btn")?.addEventListener("click", () => r.remove(), { once: !0 }),
      (window.__stonksModalLog = (u, m) => {
        let f = r.querySelector("#event-log");
        if (!f || r.querySelector("#ad-blocker-warning")) return;
        let x = document.createElement("p"),
          k = m
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>';
        ((x.innerHTML = `${k} <span class="text">${u}</span>`),
          f.appendChild(x),
          (f.scrollTop = f.scrollHeight));
      }),
      i === v)
    ) {
      let u = new Image(1, 1);
      ((u.onerror = () => {
        let m = r.querySelector(".title"),
          f = document.createElement("p");
        ((f.id = "ad-blocker-warning"),
          (f.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <span class="text">Health check failed - ad blocker might be interfering.</span>`),
          m ? m.insertAdjacentElement("afterend", f) : r.appendChild(f));
      }),
        (u.src = "https://collector.onedollarstats.com/pixel-health"));
    }
  };
  function U(g) {
    let i = {};
    return (
      ["utm_campaign", "utm_source", "utm_medium", "utm_term", "utm_content"].forEach((l) => {
        let r = g.get(l);
        r && (i[l] = r);
      }),
      i
    );
  }
  function y(g) {
    if (!g) return;
    let i = g.split(";"),
      l = {};
    for (let r of i) {
      let u = r.split("=").map((m) => m.trim());
      u.length !== 2 || u[0] === "" || u[1] === "" || (l[u[0]] = u[1]);
    }
    return Object.keys(l).length === 0 ? void 0 : l;
  }
  (() => {
    if (!document) return;
    let g = null;
    window.stonks = { event: f, view: x };
    let i = document.currentScript,
      l = i?.getAttribute("data-hash-routing") !== null,
      r = {
        isLocalhost:
          /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(location.hostname) ||
          location.protocol === "file:",
        isHeadlessBrowser: !!(
          window._phantom ||
          window.__nightmare ||
          window.navigator.webdriver ||
          window.Cypress
        ),
      };
    if (r.isLocalhost) {
      let t = i?.getAttribute("data-debug");
      (console.log(`[onedollarstats]
Script successfully connected! ${t ? `Tracking your localhost as ${t}` : "Debug domain not set"}`),
        t && R(t, i?.getAttribute("data-url") || v));
    }
    async function u(t, o, e) {
      if (navigator.sendBeacon?.(t, o)) {
        e(!0);
        return;
      }
      fetch(t, {
        method: "POST",
        body: o,
        headers: { "Content-Type": "application/json" },
        keepalive: !0,
      })
        .then(() => e(!0))
        .catch((n) => {
          (console.error("[onedollarstats] fetch() failed:", n.message), e(!1));
        });
    }
    async function m(t) {
      let o = i?.getAttribute("data-url") || v,
        e = new URL(location.href),
        n = i.getAttribute("data-debug"),
        a = i?.getAttribute("data-hostname"),
        c = !1;
      if (n)
        try {
          let s = new URL(`https://${n}${e.pathname}`);
          e.hostname !== s.hostname && ((c = !0), (e = s));
        } catch {
          return;
        }
      else if (a)
        try {
          e = new URL(`https://${a}${e.pathname}`);
        } catch {}
      ((e.search = ""), "path" in t && t.path && (e.pathname = t.path));
      let d = e.href.replace(/\/$/, ""),
        p = t.referrer ?? void 0;
      if (!p) {
        let s = document.referrer && document.referrer !== "null" ? document.referrer : void 0;
        if (s) {
          let L = new URL(s);
          L.hostname !== e.hostname && (p = L.href);
        }
      }
      let h = { u: d, e: [{ t: t.type, h: l, r: p, p: t.props }] };
      if ((t.utm && Object.keys(t.utm).length > 0 && (h.qs = t.utm), c)) {
        h.debug = c;
        let s = `[onedollarstats]
Event name: ${t.type}
Event collected from: ${d}`;
        (t.props &&
          Object.keys(t.props).length > 0 &&
          (s += `
Props: ${JSON.stringify(t.props, null, 2)}`),
          p &&
            (s += `
Referrer: ${p}`),
          l &&
            (s += `
HashRouting: ${l}`),
          t.utm &&
            Object.keys(t.utm).length > 0 &&
            (s += `
UTM: ${t.utm}`),
          console.log(s));
      }
      let b = (s) => window.__stonksModalLog?.(`${t.type} ${s ? "sent" : "failed to send"}`, s),
        w = JSON.stringify(h),
        P = new TextEncoder().encode(w),
        j = String.fromCharCode(...P),
        E = btoa(j);
      if (E.length <= 1500) {
        let s = new Image(1, 1);
        ((s.onload = () => b(!0)), (s.onerror = () => u(o, w, b)), (s.src = `${o}?data=${E}`));
      } else await u(o, w, b);
    }
    async function f(t, o, e) {
      if (S()) return;
      let n = {};
      typeof o == "string"
        ? ((n.path = o), e && (n.props = e))
        : typeof o == "object" && (n.props = o);
      let a = n?.path || void 0;
      if (!a) {
        let c =
          document.body?.getAttribute("data-s-path") ||
          document.body?.getAttribute("data-s:path") ||
          document.querySelector('meta[name="stonks-path"]')?.getAttribute("content");
        c && (a = c);
      }
      m({ type: t, props: n?.props, path: a });
    }
    function $(t) {
      if (t.type === "auxclick" && t.button !== 1) return;
      let o = t.target;
      if (!o) return;
      let e = !!o.closest("a, button"),
        n = o,
        a = 0;
      for (; n; ) {
        let c = n.getAttribute("data-s-event") || n.getAttribute("data-s:event");
        if (c) {
          let d = n.getAttribute("data-s-event-props") || n.getAttribute("data-s:event-props"),
            p = d ? y(d) : void 0,
            h =
              n.getAttribute("data-s-event-path") || n.getAttribute("data-s:event-path") || void 0;
          f(c, h ?? p, p);
          return;
        }
        if (((n = n.parentElement), a++, !e && a >= 3)) break;
      }
    }
    async function x(t, o) {
      let e = {};
      (typeof t == "string"
        ? ((e.path = t), o && (e.props = o))
        : typeof t == "object" && (e.props = t),
        k({ path: e?.path, props: e?.props }, !1));
    }
    async function k(t, o = !0) {
      if (o && S()) return;
      let e = new URLSearchParams(location.search),
        n = U(e),
        a = t?.path || void 0;
      if (!a) {
        let d =
          document.body?.getAttribute("data-s-path") ||
          document.body?.getAttribute("data-s:path") ||
          document.querySelector('meta[name="stonks-path"]')?.getAttribute("content");
        d && (a = d);
      }
      let c = t.props || void 0;
      if (!c) {
        let d = i?.getAttribute("data-props"),
          p = d ? y(d) || {} : {},
          h = document.querySelectorAll("[data-s\\:view-props], [data-s-view-props]");
        for (let b of Array.from(h)) {
          let w = b.getAttribute("data-s-view-props") || b.getAttribute("data-s:view-props");
          if (!w) continue;
          let P = y(w);
          Object.assign(p, P);
        }
        c = p;
      }
      m({ type: "PageView", props: Object.keys(c).length > 0 ? c : void 0, path: a, utm: n });
    }
    async function A() {
      let t = document.querySelector('meta[name="stonks-collect"]')?.getAttribute("content"),
        o =
          document.body?.getAttribute("data-s-collect") ||
          document.body?.getAttribute("data-s:collect");
      if (t === "false" || o === "false") {
        g = null;
        return;
      }
      if (!(i?.getAttribute("data-autocollect") !== "false") && t !== "true" && o !== "true") {
        g = null;
        return;
      }
      if (!l && g === location.pathname) {
        console.warn("Ignoring event PageView - pathname has not changed");
        return;
      }
      if (S()) return;
      g = location.pathname;
      let n = i?.getAttribute("data-props"),
        a = n ? y(n) || {} : {},
        c = document.querySelectorAll("[data-s\\:view-props], [data-s-view-props]");
      for (let d of Array.from(c)) {
        let p = d.getAttribute("data-s-view-props") || d.getAttribute("data-s:view-props");
        if (!p) continue;
        let h = y(p);
        Object.assign(a, h);
      }
      k({ props: Object.keys(a).length > 0 ? a : void 0 }, !1);
    }
    function S() {
      return !!((r.isLocalhost && !i?.getAttribute("data-debug")) || r.isHeadlessBrowser);
    }
    if (window.history.pushState) {
      let t = window.history.pushState;
      ((window.history.pushState = function (o, e, n) {
        (t.apply(this, [o, e, n]),
          window.requestAnimationFrame(() => {
            A();
          }));
      }),
        window.addEventListener("popstate", () => {
          window.requestAnimationFrame(() => {
            A();
          });
        }));
    }
    (document.visibilityState !== "visible"
      ? document.addEventListener("visibilitychange", () => {
          !g && document.visibilityState === "visible" && A();
        })
      : A(),
      document.addEventListener("click", $));
  })();
})();
