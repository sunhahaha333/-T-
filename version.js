(function () {
  var version = { version: "1.3.2", url: "./index.html", notes: "V1.3.2 · 逐单最近盈利自动匹配", releasedAt: "2026-09-24" };
  if (typeof window !== "undefined") window.__ZUOTBENBEN_REMOTE_VERSION__ = version;
  if (typeof self !== "undefined" && typeof caches !== "undefined" && typeof self.skipWaiting === "function") {
    var CACHE = "zuotbenben-v1.3.2";
    var ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon.png"];
    self.addEventListener("install", function (event) {
      event.waitUntil(caches.open(CACHE).then(function (cache) {
        return Promise.all(ASSETS.map(function (asset) {
          return fetch(new Request(asset, { cache: "reload" })).then(function (resp) {
            if (resp && resp.ok) return cache.put(asset, resp);
          });
        }));
      }).then(function () { return self.skipWaiting(); }));
    });
    self.addEventListener("activate", function (event) {
      event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (key) { return key === CACHE ? null : caches.delete(key); }));
      }).then(function () { return self.clients.claim(); }));
    });
    self.addEventListener("fetch", function (event) {
      var req = event.request;
      if (req.method !== "GET") return;
      var url = new URL(req.url);
      if (url.origin !== self.location.origin) return;
      if (url.pathname.slice(-10) === "version.js") return;
      var isPage = req.mode === "navigate" || url.pathname.slice(-10) === "index.html" || url.pathname.slice(-1) === "/";
      if (isPage) {
        event.respondWith(caches.match(req, { ignoreSearch: true }).then(function (cached) {
          var network = fetch(req).then(function (resp) {
            if (resp && resp.ok) caches.open(CACHE).then(function (cache) { cache.put(req, resp.clone()); });
            return resp;
          });
          return cached || network.catch(function () { return cached; });
        }));
        return;
      }
      event.respondWith(caches.match(req, { ignoreSearch: true }).then(function (cached) {
        if (cached) return cached;
        return fetch(req).then(function (resp) {
          if (resp && resp.ok) caches.open(CACHE).then(function (cache) { cache.put(req, resp.clone()); });
          return resp;
        });
      }));
    });
  }
})();