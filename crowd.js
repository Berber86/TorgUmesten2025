/* ============================================================
   ТОЛПА У ПРИЛАВКА: визуализация конкурентов в сцене торга.
   Фигуры берутся из competitorGroups (поле art) и рисуются поверх
   портрета продавца — крупнее и со срезанным низом, то есть чуть
   ближе к зрителю, чем продавец. Механика торга не меняется.
   ============================================================ */
(function () {
  "use strict";

  const SLOTS = { 1: [58], 2: [40, 74], 3: [26, 56, 84] };

  const sizeFor = (coef) =>
    coef >= 2.5 ? 100 :
    coef >= 1.8 ? 94 :
    coef >= 1.2 ? 86 :
    coef >= 0.7 ? 78 :
    coef >= 0.3 ? 70 : 64;

  const tierFor = (coef) => (coef >= 1.8 ? "high" : coef >= 0.7 ? "mid" : "low");

  function positionLayer(layer) {
    const visual = document.querySelector("#haggleModal .seller-visual");
    if (!visual) return;
    layer.style.left = visual.offsetLeft + "px";
    layer.style.top = visual.offsetTop + "px";
    layer.style.width = visual.offsetWidth + "px";
    layer.style.height = visual.offsetHeight + "px";
  }

  function ensureLayer() {
    const scene = document.querySelector("#haggleModal .seller-conversation");
    if (!scene) return null;
    let layer = scene.querySelector(".crowd-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "crowd-layer";
      layer.setAttribute("aria-hidden", "true");
      scene.append(layer);
    }
    positionLayer(layer);
    return layer;
  }

  window.renderHaggleCrowd = function renderHaggleCrowd() {
    const layer = ensureLayer();
    if (!layer) return;
    const modal = document.getElementById("haggleModal");
    const h = typeof currentHaggle !== "undefined" ? currentHaggle : null;
    if (!modal || modal.classList.contains("hidden") || !h) {
      layer.innerHTML = "";
      layer.dataset.key = "";
      return;
    }

    const comps = (h.competitors || []).slice(0, 3);
    const key =
      comps.map((c) => c.name).join("|") +
      "#" + (h.interceptedBy || "") +
      "@" + (h.item ? h.item.sellerType : "");
    if (layer.dataset.key === key) return; // та же толпа — не перерисовываем
    layer.dataset.key = key;

    const slots = SLOTS[comps.length] || SLOTS[3];
    layer.innerHTML = comps
      .map((comp, i) => {
        const art = typeof crowdArtFor === "function" ? crowdArtFor(comp) : null;
        if (!art) return "";
        const tier = tierFor(comp.coefficient);
        const intercepting = h.interceptedBy === comp.name ? " intercepting" : "";
        const flipped = i % 2 === 1 ? " flipped" : "";
        return (
          `<div class="crowd-figure tier-${tier}${intercepting}${flipped}"` +
          ` style="left:${slots[i]}%;height:${sizeFor(comp.coefficient)}%;z-index:${i + 1}"` +
          ` title="${comp.name} · ${comp.group}">` +
          `<img src="${art}" alt="">` +
          `<span class="crowd-tag">${comp.name}</span>` +
          `</div>`
        );
      })
      .join("");
  };

  window.addEventListener("resize", () => {
    const layer = document.querySelector("#haggleModal .crowd-layer");
    if (layer) positionLayer(layer);
  });
})();
