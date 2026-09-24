(function () {
  var version = { version: "1.3.6", url: "./index.html", notes: "V1.3.6 · 统一下拉刷新与逐单最近盈利", releasedAt: "2026-09-24" };
  if (typeof window !== "undefined") window.__ZUOTBENBEN_REMOTE_VERSION__ = version;


  if (typeof self !== "undefined" && typeof caches !== "undefined" && typeof self.skipWaiting === "function") {
    var CACHE = "zuotbenben-v1.3.6";
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
(function () {
  if (typeof window === "undefined" || window.__PTR_NATIVE__) return;
  function setup() {
    if (window.__PTR_NATIVE__ || !document.body) return;
    window.__PTR_NATIVE__ = true;
    var startY=0,pulling=false,active=false;
    var ind=document.createElement("div"); ind.id="ptr-native"; ind.dataset.state="hidden"; ind.innerHTML="<span>↓</span>";
    ind.style.cssText="position:fixed;left:50%;top:0;z-index:30000;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.96);color:#8e8e93;border:1px solid rgba(0,0,0,.06);box-shadow:0 2px 10px rgba(0,0,0,.12);transform:translate(-50%,-44px);transition:transform .18s ease;pointer-events:none;font-size:18px;line-height:1;";
    document.body.appendChild(ind);
    var st=document.createElement("style"); st.textContent="@keyframes ptrspin{to{transform:rotate(360deg)}}"; document.head.appendChild(st);
    function setY(y){ind.style.transform="translate(-50%,"+y+"px)"}
    function reset(){ind.dataset.state="hidden";ind.innerHTML="<span>↓</span>";setY(-44)}
    function spin(){ind.dataset.state="spinning";ind.innerHTML="<span style='width:16px;height:16px;border:2px solid #d1d1d6;border-top-color:#007aff;border-radius:50%;display:block;animation:ptrspin .7s linear infinite;'></span>";setY(8)}
    function refresh(){var pages=typeof getCurrentPages==="function"?getCurrentPages():[];var page=pages&&pages.length?pages[pages.length-1]:null;if(page&&typeof page.onPullDownRefresh==="function"){try{page.onPullDownRefresh();return}catch(e){}}if(window.__cloudSync&&typeof window.__cloudSync.pull==="function"){window.__cloudSync.pull().then(function(){location.reload()}).catch(function(){location.reload()})}else location.reload()}
    document.addEventListener("touchstart",function(e){if(e.touches.length!==1||window.scrollY>0)return;var n=((e.target&&e.target.tagName)||"").toLowerCase();if(n==="input"||n==="textarea"||n==="select")return;startY=e.touches[0].clientY;pulling=true;active=false},{passive:true});
    document.addEventListener("touchmove",function(e){if(!pulling||e.touches.length!==1)return;var dy=e.touches[0].clientY-startY;if(dy<=0||window.scrollY>0){pulling=false;active=false;reset();return}if(dy>5){active=true;e.preventDefault();ind.dataset.state=dy>70?"ready":"pulling";setY(Math.min(54,dy-8));ind.style.color=dy>70?"#007aff":"#8e8e93"}},{passive:false});
    document.addEventListener("touchend",function(e){if(!pulling&&!active)return;var dy=(e.changedTouches&&e.changedTouches[0]?e.changedTouches[0].clientY:startY)-startY;pulling=false;active=false;if(dy>70){spin();setTimeout(refresh,180)}else reset()},{passive:true});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup); else setup();
})();
