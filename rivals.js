/* Rival buyers at the counter.
   Illustration layer over the competitor data the game already generates:
   name, group and coefficient. It changes no prices, attention costs,
   interception chances, saves or trade handlers, and it never invents a
   competitor for a lot whose trade has not started. */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
          c
        ],
    );

  const ART = "assets/rivals/";

  /* Groups come from constants.js `competitorGroups`; art, tone and copy below
     are presentation only. `coefficient` remains the single source of truth for
     how dangerous a buyer is. */
  const GROUPS = {
    "Безопасные покупатели": { art: ["safe-tramp", "safe-tipsy"], tone: "calm" },
    "Экономные покупатели": {
      art: ["thrifty-woman", "thrifty-student"],
      tone: "calm",
    },
    "Обычные покупатели": {
      art: ["ordinary-man", "thrifty-student"],
      tone: "even",
    },
    "Заинтересованные покупатели": {
      art: ["interested-woman", "interested-man"],
      tone: "keen",
    },
    "Состоятельные покупатели": {
      art: ["wealthy-man", "ordinary-man"],
      tone: "keen",
    },
    "Опасные конкуренты": {
      art: ["dangerous-antiquarian", "wealthy-man"],
      tone: "danger",
    },
  };
  const DEFAULT_GROUP = { art: ["ordinary-man"], tone: "even" };
  const groupFor = (comp) => GROUPS[comp.group] || DEFAULT_GROUP;

  /* Wording follows checkCompetitorInterception: the chance is
     coefficient × discount percent, so a bigger discount makes any of them
     bolder. No new numbers are introduced. */
  const THREAT = [
    { max: 0.15, name: "вялый", note: "Почти не мешает: перебьёт только при огромной скидке." },
    { max: 0.45, name: "осторожный", note: "Считает деньги: скидка делает его смелее." },
    { max: 0.9, name: "обычный", note: "Смотрит на ту же вещь, что и вы." },
    { max: 1.5, name: "настойчивый", note: "Готов взять сейчас — торгуйтесь быстро." },
    { max: Infinity, name: "опасный", note: "Перехватит, если скидка окажется слишком большой." },
  ];
  const threatFor = (coefficient) =>
    THREAT.find((t) => Number(coefficient) <= t.max) || THREAT[THREAT.length - 1];

  const hash = (value) => {
    let h = 0;
    for (const ch of String(value)) h = (h * 31 + ch.codePointAt(0)) % 99991;
    return h;
  };
  const artFor = (comp) =>
    groupFor(comp).art[hash(comp.name) % groupFor(comp).art.length];

  function dots(coefficient) {
    const filled = Math.max(
      1,
      Math.min(5, Math.ceil((Number(coefficient) || 0) * 2) + 1),
    );
    return "●".repeat(filled) + "○".repeat(5 - filled);
  }

  /* Two buyers never stand on the same side: the first keeps the hash side, the
     second takes the other one. */
  function sides(competitors) {
    const first = hash(competitors[0] && competitors[0].name) % 2 === 0 ? -1 : 1;
    return competitors.map((_, i) => (i % 2 === 0 ? first : -first));
  }

  function figure(comp, layout, side, extra = "") {
    const group = groupFor(comp);
    const threat = threatFor(comp.coefficient);
    const seed = hash(comp.name);
    const scale = (0.97 + (seed % 7) / 100).toFixed(2);
    const sway = (-0.5 - (seed % 3) * 0.3).toFixed(2);
    const delay = (-(seed % 400) / 100).toFixed(2);
    const hint = `${comp.name} · ${comp.group || "покупатель"} · риск перехвата: ${threat.name}`;
    return `<figure class="rival" data-layout="${layout}" data-tone="${group.tone}"
      data-side="${side > 0 ? "right" : "left"}" data-threat="${threat.name}" aria-hidden="true"
      style="--scale:${scale}; --sway:${sway}deg; --delay:${delay}s;${extra}">
      <div class="rival-body">
        <span class="rival-shadow"></span>
        <img src="${ART}${artFor(comp)}.webp" alt="" draggable="false" title="${esc(hint)}">
      </div>
      <figcaption class="rival-tag" title="${esc(hint)}"><b>${esc(comp.name)}</b><i class="rival-dots">${dots(comp.coefficient)}</i></figcaption>
    </figure>`;
  }

  const noteFor = (competitors) => {
    const worst = competitors.reduce(
      (max, c) => (Number(c.coefficient) > Number(max.coefficient) ? c : max),
      competitors[0],
    );
    return threatFor(worst.coefficient).note;
  };

  // --------------------------------------------------------------- trade view
  /* The competitors cell keeps its heading and its counter. The plain name list
     stays in the document — only visually reduced — so screen readers and the
     original renderer are unaffected. */
  function renderHaggleRivals() {
    const h = typeof currentHaggle !== "undefined" ? currentHaggle : null;
    const list = $("competitors");
    if (!list || !list.parentElement) return;
    const cell = list.parentElement;
    cell.classList.add("competitors-cell");
    const competitors = (h && h.competitors) || [];
    const stage = document.createElement("div");
    stage.className = "rival-stage";
    stage.dataset.count = String(competitors.length);
    if (!competitors.length) {
      stage.innerHTML = `<p class="rival-empty">${
        typeof gameState !== "undefined" && gameState.firstDealToday
          ? "Первый торг дня: прилавок только ваш."
          : "Никто больше не смотрит на эту вещь."
      }</p>`;
    } else {
      const shown = competitors.slice(0, 2);
      const rest = competitors.length - shown.length;
      const sidesHere = sides(shown);
      stage.innerHTML =
        shown.map((c, i) => figure(c, "stack", sidesHere[i])).join("") +
        (rest > 0 ? `<span class="rival-more">+${rest}</span>` : "") +
        `<p class="rival-note">${esc(noteFor(competitors))}</p>`;
    }
    const previous = cell.querySelector(".rival-stage");
    if (previous) previous.replaceWith(stage);
    else list.after(stage);
  }

  const originalRender = window.renderHaggleModal;
  if (typeof originalRender === "function")
    window.renderHaggleModal = function (...args) {
      const result = originalRender.apply(this, args);
      try {
        renderHaggleRivals();
      } catch (error) {
        console.warn("rivals: trade view skipped", error);
      }
      return result;
    };

  // ------------------------------------------------------------ walking view
  /* Only a paused conversation knows who waits by the counter, so the panorama
     draws rivals for lots with saved haggle state — and only from that data.
     Geometry is read from the inline styles market.js already writes, so the
     layer is correct even while the walking view is still hidden. */
  function portraitMetrics(portrait, media) {
    const height = parseFloat(
      ((media.getAttribute("style") || "").match(/height:\s*([\d.]+)px/) || [])[1],
    );
    let size = height;
    if (!size) size = media.getBoundingClientRect().height;
    if (!size) size = portrait.getBoundingClientRect().height;
    const style = media.getAttribute("style") || "";
    const width = parseFloat((style.match(/width:\s*([\d.]+)px/) || [])[1]);
    const bottomOffset = parseFloat(
      ((portrait.getAttribute("style") || "").match(
        /bottom:\s*(-?[\d.]+)px/,
      ) || [])[1],
    );
    return {
      height: size,
      width: Number.isFinite(width) && width ? width : size * 0.6,
      // The seller keeps his portrait baseline; the buyers' feet stand a little
      // lower in the frame, so they read as nearer to the viewer.
      feet: Math.max(
        0,
        (Number.isFinite(bottomOffset) ? bottomOffset : 20) - size * 0.05,
      ),
    };
  }

  function injectWalkingRivals() {
    const view = $("new-market-view");
    if (!view || typeof gameState === "undefined") return;
    view.querySelectorAll(".market-item-container").forEach((container) => {
      container.querySelectorAll(".rival-line").forEach((line) => line.remove());
      const item = gameState.marketItems.find(
        (i) => i.id === container.dataset.itemId,
      );
      const saved = item && item.haggleState;
      const competitors = (saved && saved.competitors) || [];
      if (!competitors.length) return;
      const portrait = container.querySelector(".seller-portrait-wrapper");
      const media = portrait && portrait.querySelector("img, video");
      if (!portrait || !media) return;
      const {
        height: portraitHeight,
        width: portraitWidth,
        feet,
      } = portraitMetrics(portrait, media);
      if (!portraitHeight) return;

      // A narrow panorama has no room for a wide pair: buyers stand closer to
      // the seller, the way a queue actually forms at a small stall.
      const narrow = view.clientWidth < 700;
      const ordered = [...competitors].sort(
        (a, b) => Number(b.coefficient) - Number(a.coefficient),
      );
      const shown = ordered.slice(0, 2);
      const sidesHere = sides(shown);
      const line = document.createElement("div");
      line.className = "rival-line";
      line.dataset.count = String(competitors.length);
      line.style.setProperty("--feet", `${Math.round(feet)}px`);
      line.style.setProperty("--figure-h", `${Math.round(portraitHeight)}px`);
      line.innerHTML = shown
        .map((c, index) => {
          // The greediest buyer stands closest to the viewer and a step nearer
          // the counter than the second one.
          const spread = narrow
            ? index === 0
              ? 0.24
              : 0.32
            : index === 0
              ? 0.34
              : 0.46;
          const dx = Math.round(sidesHere[index] * portraitWidth * spread);
          return figure(
            c,
            "hang",
            sidesHere[index],
            `--dx:${dx}px; --depth:${index === 0 ? "1.14" : "0.95"};`,
          );
        })
        .join("");
      portrait.after(line);
    });
  }

  const originalInit = window.initWalkingMarket;
  if (typeof originalInit === "function")
    window.initWalkingMarket = function (...args) {
      const result = originalInit.apply(this, args);
      try {
        injectWalkingRivals();
      } catch (error) {
        console.warn("rivals: walking view skipped", error);
      }
      return result;
    };

  /* Quiet mode mirrors street.js: no idle motion off-screen, in a hidden tab or
     while the trade window is open. */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  function syncQuiet() {
    const walking = $("walking-market");
    const haggle = $("haggleModal");
    const quiet =
      document.hidden ||
      reduced.matches ||
      (haggle && !haggle.classList.contains("hidden")) ||
      (walking && walking.classList.contains("hidden"));
    document.documentElement.classList.toggle("rivals-quiet", !!quiet);
  }
  const observer = new MutationObserver(syncQuiet);
  ["walking-market", "haggleModal"].forEach((id) => {
    const el = $(id);
    if (el)
      observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  });
  document.addEventListener("visibilitychange", syncQuiet);
  reduced.addEventListener("change", syncQuiet);
  syncQuiet();

  window.TorgRivals = Object.freeze({ groups: GROUPS, threatFor });
})();
