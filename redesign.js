/* Presentation layer. Existing game state and save format are preserved. */
const marketFilters = { category: "all", query: "", sort: "default" };
const marketCategoryNames = {
  porcelain: "Фарфор",
  metal: "Металл",
  painting: "Живопись",
  books: "Книги",
  militaria: "Милитария",
};
function syncGameHUD() {
  document.getElementById("hud-money").textContent =
    new Intl.NumberFormat("ru-RU").format(Math.round(gameState.money)) + " ₽";
  document.getElementById("hud-reputation").textContent = gameState.reputation;
  document.getElementById("hud-attention").textContent = Math.round(
    gameState.attention,
  );
  document.getElementById("hud-energy").style.width =
    Math.max(0, Math.min(100, gameState.attention)) + "%";
  document.getElementById("hud-inventory").textContent =
    gameState.inventory.length;
}
const oldUpdateDisplay = updateDisplay;
updateDisplay = function () {
  oldUpdateDisplay();
  syncGameHUD();
};
const nav = document.getElementById("tab-market").parentElement;
nav.classList.add("main-navigation");
document.getElementById("navigation-slot").appendChild(nav);
const navLabels = {
  market: ["▦", "Барахолка"],
  inventory: ["▢", "Инвентарь"],
  selling: ["↗", "Продажа"],
  knowledge: ["▤", "База знаний"],
  stats: ["▥", "Статистика"],
  help: ["◉", "Как играть"],
  zones: ["⚙", "Зоны"],
};
for (const [key, [icon, label]] of Object.entries(navLabels)) {
  const button = document.getElementById("tab-" + key);
  button.innerHTML = `<span class="nav-icon">${icon}</span><span>${label}</span><span class="nav-arrow">↗</span>`;
}
const oldSwitchTab = switchTab;
switchTab = function (tab) {
  oldSwitchTab(tab);
  document.getElementById("page-label").textContent =
    navLabels[tab]?.[1] || tab;
  syncGameHUD();
  document
    .querySelectorAll(".main-navigation button")
    .forEach((b) =>
      b.setAttribute("aria-current", b.id === "tab-" + tab ? "page" : "false"),
    );
};
window.switchTab = switchTab;
document.querySelectorAll("[data-category]").forEach((button) =>
  button.addEventListener("click", () => {
    marketFilters.category = button.dataset.category;
    document.querySelectorAll("[data-category]").forEach((b) => {
      b.classList.toggle("selected", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    renderMarket();
  }),
);
document.getElementById("market-search").addEventListener("input", (event) => {
  marketFilters.query = event.target.value.trim().toLowerCase();
  renderMarket();
});
document.getElementById("market-sort").addEventListener("change", (event) => {
  marketFilters.sort = event.target.value;
  renderMarket();
});
window.addEventListener("load", syncGameHUD);
// Update after delayed trades and expertise actions as well as direct UI updates.
const hudObserver = new MutationObserver(syncGameHUD);
["marketItems", "inventoryItems", "attentionValue", "currentPrice"].forEach(
  (id) => {
    const el = document.getElementById(id);
    if (el)
      hudObserver.observe(el, {
        childList: true,
        subtree: true,
        characterData: true,
      });
  },
);
const oldToggleMarketView = toggleMarketView;
toggleMarketView = function () {
  oldToggleMarketView();
  const walking = currentMarketView === "walking";
  document
    .getElementById("content-market")
    .classList.toggle("is-walking", walking);
  document.getElementById("marketViewToggle").innerHTML = walking
    ? "Вернуться к находкам <span>↗</span>"
    : "Прогуляться по рынку <span>↗</span>";
};
// Dialog semantics and keyboard focus follow visibility; closing still uses the
// game's own buttons so cancel/leave actions retain their gameplay consequences.
document.querySelectorAll(".modal-backdrop").forEach((modal) => {
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  const heading = modal.querySelector("h2");
  if (heading) {
    if (!heading.id) heading.id = modal.id + "-title";
    modal.setAttribute("aria-labelledby", heading.id);
  }
  let previousFocus;
  const focusable = () =>
    [
      ...modal.querySelectorAll(
        'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',
      ),
    ].filter((el) => el.getClientRects().length);
  new MutationObserver(() => {
    if (!modal.classList.contains("hidden")) {
      previousFocus = document.activeElement;
      focusable()[0]?.focus({ preventScroll: true });
    } else if (previousFocus?.isConnected)
      previousFocus.focus({ preventScroll: true });
  }).observe(modal, { attributes: true, attributeFilter: ["class"] });
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const elements = focusable(),
      first = elements[0],
      last = elements.at(-1);
    if (!first) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});
