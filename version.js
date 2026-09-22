(function () {
  var version = {
    version: "1.1.3",
    url: "./index.html",
    notes: "V1.1.3 · 计算页固定与卡片阴影修复",
    releasedAt: "2026-09-22"
  };
  if (typeof window !== "undefined") window.__ZUOTBENBEN_REMOTE_VERSION__ = version;

  if (typeof self !== "undefined" && typeof caches !== "undefined" && typeof self.skipWaiting === "function") {
    var CACHE = "zuotbenben-v1.1.3";
    var ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon.png"];
    self.addEventListener("install", function (event) {
      event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
    });
    self.addEventListener("activate", function (event) {
      event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
      }).then(function () { return self.clients.claim(); }));
    });
    self.addEventListener("fetch", function (event) {
      var req = event.request;
      if (req.method !== "GET") return;
      var url = new URL(req.url);
      if (url.origin !== self.location.origin) return;
      if (url.pathname.slice(-10) === "version.js") return;
      var isPage = req.mode === "navigate" || url.pathname.slice(-10) === "index.html" || url.pathname.slice(-1) === "/";
      event.respondWith(caches.match(req, { ignoreSearch: true }).then(function (cached) {
        var net = fetch(req).then(function (resp) {
          if (resp && resp.ok) caches.open(CACHE).then(function (cache) { cache.put(req, resp.clone()); });
          return resp;
        }).catch(function () { return cached; });
        return isPage && cached ? cached : (cached || net);
      }));
    });
  }
})();
