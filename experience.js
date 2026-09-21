/* Second-pass UX. Only presentation state lives here: never mutate gameState. */
(() => {
  const $ = (id) => document.getElementById(id);
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const money = (value) =>
    new Intl.NumberFormat("ru-RU").format(Math.round(value || 0)) + " ₽";
  const icons = {
    market: '<path d="M3 10h18M5 10v11h14V10M3 10l2-7h14l2 7M9 21v-7h6v7"/>',
    inventory: '<path d="m3 7 9-4 9 4v13H3ZM3 7l9 5 9-5M12 12v8"/>',
    selling: '<path d="M4 16 16 4M7 4h9v9M20 12v8H4"/>',
    knowledge:
      '<path d="M12 5v16M12 5C9 2 5 3 3 4v15c3-1 6-1 9 2 3-3 6-3 9-2V4c-3-1-6-2-9 1Z"/>',
    stats: '<path d="M4 20V10M12 20V4M20 20v-7"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 0-1 1-1 2M12 17h.01"/>',
    heart:
      '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 2 10 8 15 6-5 12-11 8-15Z"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list: '<path d="M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1"/>',
  };
  const svg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.market}</svg>`;
  const category = (item) => marketCategoryNames[item.category] || "Редкости";
  function picture(item) {
    const name = item.baseName || "";
    if (/подсвечник|канделябр/i.test(name))
      return "assets/object-candlestick.jpg";
    if (/балерин/i.test(name)) return "assets/object-ballerina.jpg";
    if (/ложк|вилк|столовый набор|столовых приборов/i.test(name))
      return "assets/object-cutlery.jpg";
    if (/самовар/i.test(name)) return "assets/object-samovar.jpg";
    if (/чай|чаш|подстаканник/i.test(name)) return "assets/object-teacup.jpg";
    if (/клинок|штык|кортик|сабл|шпаг|нож|палаш|шашк/i.test(name))
      return "assets/object-dagger.jpg";
    if (item.category === "painting") return "assets/category-painting.jpg";
    if (item.category === "books") return "assets/category-books.jpg";
    if (/ваз[аы]|кувшин/i.test(name)) return "assets/category-porcelain.jpg";
    if (/часы|часов/i.test(name)) return "assets/category-metal.jpg";
    if (/орден|медаль|кокард|эполет|награ|знак/i.test(name))
      return "assets/category-militaria.jpg";
    return null;
  }
  function artwork(item) {
    const image = picture(item);
    if (image)
      return `<img src="${image}" alt="Условная иллюстрация типа предмета" loading="lazy">`;
    const namedIcon = /балерин/i.test(item.baseName)
      ? "💃"
      : /статуэт|фигурк/i.test(item.baseName)
        ? "🗿"
        : /столовый набор/i.test(item.baseName)
          ? "🍴"
          : null;
    const icon =
      namedIcon ||
      DETAILED_ICONS[item.baseName] ||
      CATEGORY_ICONS[item.category];
    return `<span class="object-drawing drawing-${item.category}" role="img" aria-label="Условная иллюстрация: ${escape(item.baseName)}"><span class="drawing-orbit"></span><span class="drawing-glyph">${escape(icon)}</span><span class="drawing-mark">КАТАЛОГ РЕДКОСТЕЙ / ${category(item)}</span></span>`;
  }
  const readPreference = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem("torg-ui-" + key)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const savePreference = (key, value) => {
    try {
      localStorage.setItem("torg-ui-" + key, JSON.stringify(value));
    } catch {
      /* UI still works without storage */
    }
  };
  const savedFavorites = readPreference("favorites", []);
  const favorites = new Set(
    Array.isArray(savedFavorites) ? savedFavorites.map(String) : [],
  );
  let onlyFavorites = false,
    affordable = false,
    catalogView = readPreference("view", "grid") === "list" ? "list" : "grid";
  let previewId = null;

  // SVG icons stay crisp and do not depend on the user's emoji font.
  Object.keys(icons).forEach((key) => {
    const node = $("tab-" + key)?.querySelector(".nav-icon");
    if (node) node.innerHTML = svg(key);
  });
  const mobileNav = document.createElement("nav");
  mobileNav.className = "mobile-dock";
  mobileNav.setAttribute("aria-label", "Основная навигация");
  mobileNav.innerHTML = [
    "market",
    "inventory",
    "selling",
    "knowledge",
    "stats",
    "help",
  ]
    .map(
      (key) =>
        `<button data-nav="${key}">${svg(key)}<span>${{ market: "Рынок", inventory: "Вещи", selling: "Продажа", knowledge: "Знания", stats: "Итоги", help: "Помощь" }[key]}</span></button>`,
    )
    .join("");
  document.body.append(mobileNav);
  mobileNav.addEventListener("click", (e) => {
    const b = e.target.closest("[data-nav]");
    if (b) switchTab(b.dataset.nav);
  });
  const previousSwitch = switchTab;
  switchTab = function (tab) {
    previousSwitch(tab);
    mobileNav
      .querySelectorAll("button")
      .forEach((b) =>
        b.setAttribute(
          "aria-current",
          b.dataset.nav === tab ? "page" : "false",
        ),
      );
    document.querySelector(".topbar").scrollIntoView({ block: "start" });
  };
  window.switchTab = switchTab;
  mobileNav.firstElementChild.setAttribute("aria-current", "page");
  $("tab-market").setAttribute("aria-current", "page");
  $("notificationContainer").setAttribute("aria-live", "polite");
  $("notificationContainer").setAttribute("aria-relevant", "additions");

  // A small, actionable briefing replaces decorative blank space.
  const briefing = document.createElement("div");
  briefing.className = "day-briefing";
  briefing.innerHTML =
    '<span class="briefing-dot"></span><strong>Сегодня на рынке</strong><span id="briefing-text"></span><button id="briefing-inventory">К моей коллекции ' +
    svg("arrow") +
    "</button>";
  document.querySelector(".market-hero").after(briefing);
  $("briefing-inventory").onclick = () => switchTab("inventory");
  document.querySelector(".hero-label").textContent = "БЮРО РЕДКИХ НАХОДОК";
  document.querySelector(".hero-copy p").innerHTML =
    "Красота — в деталях.<br>Выгода — в умении их замечать.";
  document.querySelector(".market-search>span").innerHTML = svg("search");
  const shortcut = document.createElement("kbd");
  shortcut.textContent = "/";
  document.querySelector(".market-search").append(shortcut);
  const tools = document.createElement("div");
  tools.className = "catalog-tools";
  tools.innerHTML = `<div class="catalog-toggles"><button id="favorites-filter" aria-pressed="false">${svg("heart")} Избранное <span id="favorite-count">0</span></button><label><input type="checkbox" id="affordable-filter"> По моему бюджету</label></div><div class="catalog-views" role="group" aria-label="Вид каталога"><button data-view="grid" aria-label="Карточки">${svg("grid")}</button><button data-view="list" aria-label="Список">${svg("list")}</button></div>`;
  document.querySelector(".market-toolbar").after(tools);
  $("favorites-filter").onclick = () => {
    onlyFavorites = !onlyFavorites;
    $("favorites-filter").setAttribute("aria-pressed", String(onlyFavorites));
    renderMarket();
  };
  $("affordable-filter").onchange = (e) => {
    affordable = e.target.checked;
    renderMarket();
  };
  tools.querySelectorAll("[data-view]").forEach(
    (b) =>
      (b.onclick = () => {
        catalogView = b.dataset.view;
        savePreference("view", catalogView);
        renderMarket();
      }),
  );
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) &&
      !document.querySelector("dialog[open],.modal-backdrop:not(.hidden)")
    ) {
      e.preventDefault();
      switchTab("market");
      $("market-search").focus();
    }
  });

  // Free preview uses only information already visible in the original market.
  const inspector = document.createElement("dialog");
  inspector.className = "item-inspector ux-dialog";
  inspector.id = "item-inspector";
  inspector.setAttribute("aria-labelledby", "preview-name");
  document.body.append(inspector);
  const closePreview = () => inspector.close();
  inspector.addEventListener("close", () => {
    // Restore focus only when closing the free preview, not when entering a trade.
    queueMicrotask(() => {
      if (!$("haggleModal").classList.contains("hidden")) return;
      const origin = [
        ...document.querySelectorAll(".find-open[data-preview]"),
      ].find((b) => b.dataset.preview === String(previewId));
      (origin || $("market-search")).focus({ preventScroll: true });
    });
  });
  inspector.addEventListener("click", (e) => {
    if (e.target === inspector) closePreview();
  });
  function openPreview(id) {
    const item = gameState.marketItems.find((i) => String(i.id) === String(id));
    if (!item) return;
    previewId = item.id;
    inspector.dataset.itemId = String(item.id);
    const cost = ATTENTION_COSTS.ENTER_HAGGLE;
    inspector.innerHTML = `<button class="dialog-close" data-close aria-label="Закрыть предпросмотр">${svg("close")}</button><div class="preview-art">${artwork(item)}<span>Условная иллюстрация · не фото предмета</span></div><div class="preview-info"><div class="eyebrow">${category(item)} / ПРЕДЛОЖЕНИЕ ПРОДАВЦА</div><h2 id="preview-name">${escape(getDisplayName(item, 0))}</h2><div class="preview-seller"><span>${escape(item.sellerIcon)}</span><div><small>Продавец</small><strong>${escape(item.sellerName)}</strong></div></div><dl><div><dt>Запрашивает</dt><dd>${money(item.askingPrice)}</dd></div><div><dt>Ваш бюджет</dt><dd>${money(gameState.money)}</dd></div></dl>${item.askingPrice > gameState.money ? '<p class="ux-warning">Цена выше вашего бюджета. Во время торга её можно попробовать снизить.</p>' : ""}<div class="preview-note"><strong>Что скрывается за первым впечатлением?</strong><p>Подлинность, возраст и стоимость ещё предстоит установить. Иллюстрация не является доказательством состояния предмета.</p></div><button class="ux-primary" data-start ${gameState.attention < cost ? "disabled" : ""}>Начать торг ${svg("arrow")}</button><p class="action-footnote">Вход в торг: ${cost} ед. внимания. Сейчас у вас ${Math.round(gameState.attention)}.</p><button class="ux-secondary" data-favorite="${escape(item.id)}">${svg("heart")} ${favorites.has(String(item.id)) ? "Убрать из избранного" : "Отложить в избранное"}</button><p class="preview-free">Просмотр бесплатный. Избранное не резервирует товар.</p></div>`;
    inspector.querySelector("[data-close]").onclick = closePreview;
    inspector.querySelector("[data-start]").onclick = () => {
      closePreview();
      startHaggle(previewId);
    };
    inspector.querySelector("[data-favorite]").onclick = () => {
      toggleFavorite(item.id);
      openPreview(item.id);
    };
    if (!inspector.open) inspector.showModal();
    else
      inspector.querySelector("[data-favorite]").focus({ preventScroll: true });
    document.dispatchEvent(
      new CustomEvent("torg:preview", { detail: { id: item.id } }),
    );
  }
  function toggleFavorite(id) {
    id = String(id);
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    savePreference("favorites", [...favorites]);
    renderMarket();
  }
  function resetFilters() {
    marketFilters.category = "all";
    marketFilters.query = "";
    onlyFavorites = false;
    affordable = false;
    $("market-search").value = "";
    $("affordable-filter").checked = false;
    $("favorites-filter").setAttribute("aria-pressed", "false");
    document.querySelectorAll("[data-category]").forEach((b) => {
      b.classList.toggle("selected", b.dataset.category === "all");
      b.setAttribute("aria-pressed", String(b.dataset.category === "all"));
    });
    renderMarket();
  }
  // Replaces the renderer only, not market generation or trade functions.
  renderMarket = function () {
    $("marketDay").textContent = gameState.day;
    const availableFavorites = gameState.marketItems.filter((i) =>
      favorites.has(String(i.id)),
    ).length;
    $("favorite-count").textContent = availableFavorites;
    $("briefing-text").textContent =
      `${gameState.marketItems.length} предложений · ${money(gameState.money)} на новые находки`;
    if (currentMarketView === "walking") return;
    const items = gameState.marketItems.filter(
      (item) =>
        (marketFilters.category === "all" ||
          item.category === marketFilters.category) &&
        (!onlyFavorites || favorites.has(String(item.id))) &&
        (!affordable || item.askingPrice <= gameState.money) &&
        (getDisplayName(item, 0) + " " + item.sellerName)
          .toLocaleLowerCase("ru")
          .includes(marketFilters.query),
    );
    if (marketFilters.sort !== "default")
      items.sort((a, b) =>
        marketFilters.sort === "low"
          ? a.askingPrice - b.askingPrice
          : b.askingPrice - a.askingPrice,
      );
    $("market-count").textContent = items.length;
    $("marketItems").classList.toggle("catalog-list", catalogView === "list");
    tools
      .querySelectorAll("[data-view]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.view === catalogView)),
      );
    document.querySelectorAll("[data-category]").forEach((b) => {
      const n =
        b.querySelector(".category-count") || document.createElement("span");
      n.className = "category-count";
      n.textContent = gameState.marketItems.filter(
        (i) =>
          b.dataset.category === "all" || i.category === b.dataset.category,
      ).length;
      if (!n.parentNode) b.append(n);
    });
    $("marketItems").innerHTML = items.length
      ? items
          .map((item, index) => {
            const name = escape(getDisplayName(item, 0)),
              id = escape(item.id),
              favorite = favorites.has(String(item.id));
            const clues = [];
            if (gameState.skills[item.category] >= 1 && item.defects.length)
              clues.push("Видны дефекты");
            if (gameState.skills[item.category] >= 2 && item.marks.length)
              clues.push("Видны клейма");
            return `<article class="find-card"><div class="find-art"><button class="find-image-button" data-preview="${id}" aria-label="Посмотреть: ${name}">${artwork(item)}</button><span class="find-category">${category(item)}</span><button class="favorite-button ${favorite ? "is-saved" : ""}" data-favorite="${id}" aria-label="${favorite ? "Убрать из" : "Добавить в"} избранное: ${name}" aria-pressed="${favorite}">${svg("heart")}</button><span class="art-disclaimer">Условная иллюстрация</span></div><div class="find-content"><div class="find-meta"><span>ЛОТ ${String(gameState.marketItems.findIndex((i) => i.id === item.id) + 1).padStart(2, "0")}</span><span>${clues.join(" · ") || "Без экспертизы"}</span></div><h3><button data-preview="${id}">${name}</button></h3><div class="find-seller"><span>${escape(item.sellerIcon)}</span>${escape(item.sellerName)}</div><div class="find-price"><div><small>Цена продавца</small><strong>${money(item.askingPrice)}</strong></div><span>${item.askingPrice > gameState.money ? "Выше бюджета" : "Торг уместен"}</span></div><button class="find-open" data-preview="${id}">Посмотреть предложение ${svg("arrow")}</button></div></article>`;
          })
          .join("")
      : `<div class="market-empty">${svg(onlyFavorites ? "heart" : "search")}<h3>${!gameState.marketItems.length ? "Сегодня всё разобрали" : onlyFavorites ? "Здесь будут ваши избранные находки" : "Таких находок пока нет"}</h3><p>${!gameState.marketItems.length ? "Приходите на следующий день — появятся новые предложения." : onlyFavorites ? "Нажмите на сердечко у вещи, к которой хотите вернуться." : "Уберите часть фильтров или попробуйте другой запрос."}</p><button class="ux-secondary" data-reset>Показать все предложения</button></div>`;
  };
  $("marketItems").addEventListener("click", (e) => {
    const preview = e.target.closest("[data-preview]"),
      favorite = e.target.closest("[data-favorite]");
    if (preview) openPreview(preview.dataset.preview);
    if (favorite) toggleFavorite(favorite.dataset.favorite);
    if (e.target.closest("[data-reset]")) resetFilters();
  });

  // Day confirmation shows the existing rent charge before calling nextDay.
  const dayDialog = document.createElement("dialog");
  dayDialog.id = "day-confirmation";
  dayDialog.className = "ux-dialog day-dialog";
  dayDialog.setAttribute("aria-labelledby", "day-confirmation-title");
  document.body.append(dayDialog);
  $("nextDayBtn").onclick = () => {
    dayDialog.innerHTML = `<button class="dialog-close" data-cancel aria-label="Отмена">${svg("close")}</button><div class="eyebrow">ЗАВЕРШЕНИЕ ДНЯ ${gameState.day}</div><h2 id="day-confirmation-title">До завтра, барахолка.</h2><p>Предложения на рынке обновятся. Избранное не сохраняет товары на следующий день.</p><dl><div><dt>Сейчас в кошельке</dt><dd>${money(gameState.money)}</dd></div><div><dt>Ежедневная аренда</dt><dd>−500 ₽</dd></div><div><dt>После аренды</dt><dd>${money(gameState.money - 500)}</dd></div></dl>${gameState.money < 500 ? '<p class="ux-warning">Не хватает на аренду. Игра запустит обычную проверку выживания.</p>' : ""}<button class="ux-primary" data-confirm>Перейти к дню ${gameState.day + 1} ${svg("arrow")}</button><button class="ux-secondary" data-stay>Ещё немного поторгуюсь</button>`;
    dayDialog.querySelector("[data-confirm]").onclick = () => {
      dayDialog.close();
      nextDay();
    };
    dayDialog
      .querySelectorAll("[data-cancel],[data-stay]")
      .forEach((b) => (b.onclick = () => dayDialog.close()));
    dayDialog.showModal();
  };
  dayDialog.addEventListener("click", (e) => {
    if (e.target === dayDialog) dayDialog.close();
  });

  // Inventory: add discovery controls without changing which actions are allowed.
  const inventoryTools = document.createElement("div");
  inventoryTools.className = "collection-tools";
  inventoryTools.innerHTML = `<div class="collection-tabs" role="group" aria-label="Статус предметов"><button data-stage="all" aria-pressed="true">Все вещи</button><button data-stage="research" aria-pressed="false">Нужна экспертиза</button><button data-stage="ready" aria-pressed="false">Оценены</button><button data-stage="sample" aria-pressed="false">Образцы</button></div><label class="collection-search">${svg("search")}<input type="search" id="collection-search" placeholder="Найти в коллекции" aria-label="Поиск в коллекции"></label>`;
  $("content-inventory").querySelector(".page-heading").after(inventoryTools);
  const collectionSummary = document.createElement("div");
  collectionSummary.className = "collection-summary";
  inventoryTools.before(collectionSummary);
  const noCollectionResults = document.createElement("div");
  noCollectionResults.className = "collection-no-results hidden";
  noCollectionResults.textContent =
    "Ничего не найдено. Измените запрос или выберите другой статус.";
  $("inventoryItems").after(noCollectionResults);
  let collectionStage = "all";
  function filterCollection() {
    let visible = 0;
    document.querySelectorAll("#inventoryItems>.card").forEach((card) => {
      const item = gameState.inventory.find(
        (i) => String(i.id) === card.dataset.itemId,
      );
      if (!item) return;
      const shown =
        (collectionStage === "all" ||
          (collectionStage === "research" && !item.expertiseDone) ||
          (collectionStage === "ready" && item.expertiseDone) ||
          (collectionStage === "sample" && item.isSample)) &&
        card.textContent
          .toLocaleLowerCase("ru")
          .includes($("collection-search").value.toLocaleLowerCase("ru"));
      card.classList.toggle("hidden", !shown);
      if (shown) visible++;
    });
    noCollectionResults.classList.toggle(
      "hidden",
      !!visible || !gameState.inventory.length,
    );
  }
  inventoryTools.querySelectorAll("[data-stage]").forEach(
    (b) =>
      (b.onclick = () => {
        collectionStage = b.dataset.stage;
        inventoryTools
          .querySelectorAll("[data-stage]")
          .forEach((button) =>
            button.setAttribute("aria-pressed", String(button === b)),
          );
        filterCollection();
      }),
  );
  $("collection-search").oninput = filterCollection;
  const originalInventory = renderInventory;
  renderInventory = function () {
    originalInventory();
    const items = gameState.showSamplesInInventory
      ? gameState.inventory
      : gameState.inventory.filter((i) => !i.isSample);
    collectionSummary.innerHTML = `<div><small>В коллекции</small><strong>${gameState.inventory.length}<em>вещей</em></strong></div><div><small>Ждут исследования</small><strong>${gameState.inventory.filter((i) => !i.expertiseDone).length}<em>предметов</em></strong></div><div><small>Потрачено на покупки в коллекции</small><strong>${money(gameState.inventory.reduce((sum, i) => sum + (Number(i.purchasePrice) || 0), 0))}</strong></div>`;
    document
      .querySelectorAll("#inventoryItems>.card")
      .forEach((card, index) => {
        const item = items[index];
        if (!item) return;
        card.dataset.itemId = item.id;
        const art = card.querySelector(":scope>.text-4xl");
        if (art) {
          art.classList.add("collection-art");
          art.innerHTML = `${artwork(item)}<span>Условная иллюстрация</span>`;
        }
        card.querySelector("h3")?.classList.add("collection-name");
      });
    if (!gameState.inventory.length)
      $("emptyInventory").innerHTML =
        `<div class="empty-collection-art">${svg("inventory")}</div><h3>Большие коллекции начинаются<br>с одной маленькой находки.</h3><p>Загляните на рынок. Купленные вещи появятся здесь.</p><button class="ux-primary" id="go-to-market">Найти первую вещь ${svg("arrow")}</button>`;
    if ($("go-to-market"))
      $("go-to-market").onclick = () => switchTab("market");
    filterCollection();
  };

  // Give appraisal a real workstation layout; existing inputs and handlers stay intact.
  const appraisal = $("expertiseModal").firstElementChild;
  appraisal.classList.add("appraisal-shell");
  const sections = [...appraisal.children];
  if (sections.length >= 5) {
    sections[0].classList.add("appraisal-header");
    const workspace = document.createElement("div");
    workspace.className = "appraisal-workspace";
    const evidence = document.createElement("div");
    evidence.className = "appraisal-evidence";
    workspace.append(sections[1], sections[2]);
    evidence.append(sections[3], sections[4]);
    appraisal.append(workspace, evidence);
  }
  ["authenticityGuess", "valueGuess", "ageGuess"].forEach((id) => {
    const field = $(id);
    const label = field?.parentElement.querySelector("label");
    if (label) label.htmlFor = id;
  });
  const haggle = $("haggleModal").firstElementChild;
  haggle.classList.add("negotiation-shell");
  const haggleTop = haggle.firstElementChild;
  haggleTop.classList.add("negotiation-heading");
  const haggleArt = document.createElement("div");
  haggleArt.className = "negotiation-art";
  haggleTop.prepend(haggleArt);
  const leave = haggle.querySelector('[onclick="closeHaggle()"]');
  if (leave) {
    leave.textContent = "Уйти";
    leave.title = "Предмет исчезнет с рынка — это правило игры.";
  }
  const tradeWarning = document.createElement("p");
  tradeWarning.className = "trade-warning";
  tradeWarning.textContent = "Если уйти, это предложение исчезнет с рынка.";
  haggle.append(tradeWarning);
  new MutationObserver(() => {
    if (!$("haggleModal").classList.contains("hidden") && currentHaggle) {
      haggleArt.innerHTML = `${artwork(currentHaggle.item)}<small>Условная иллюстрация</small>`;
    }
  }).observe($("haggleModal"), {
    attributes: true,
    attributeFilter: ["class"],
  });
  $("haggleItemIcon").classList.add("hidden");
  const originalToggle = toggleMarketView;
  toggleMarketView = function () {
    originalToggle();
    tools.classList.toggle("hidden", currentMarketView === "walking");
  };

  // Keep the catalogue and other rooms in the same visual language.
  const originalSkills = renderSkills;
  renderSkills = function () {
    originalSkills();
    const keys = Object.keys(gameState.skills);
    [...$("skillsDisplay").children].forEach((card, index) => {
      const key = keys[index];
      if (!Object.hasOwn(marketCategoryNames, key)) return;
      card.classList.add("discipline-card");
      const cover = document.createElement("div");
      cover.className = "discipline-cover";
      cover.innerHTML = `<img src="assets/category-${key}.jpg" alt="${marketCategoryNames[key]} — иллюстрация категории" loading="lazy"><span>ДИСЦИПЛИНА ${String(index + 1).padStart(2, "0")}</span>`;
      card.prepend(cover);
      const action = document.createElement("button");
      action.className = "discipline-action";
      action.innerHTML = "Искать на рынке " + svg("arrow");
      action.onclick = () => {
        resetFilters();
        switchTab("market");
        document.querySelector(`[data-category="${key}"]`).click();
        document
          .querySelector(".market-section-title")
          .scrollIntoView({ block: "start" });
      };
      card.append(action);
    });
  };
  const saleSummary = document.createElement("div");
  saleSummary.className = "sales-summary";
  $("content-selling").querySelector(".page-heading").after(saleSummary);
  const originalSelling = renderSellingTab;
  renderSellingTab = function () {
    originalSelling();
    const sales = gameState.sellingItems;
    const offers = sales.reduce((n, s) => n + (s.offers?.length || 0), 0);
    saleSummary.innerHTML = `<span>Активных продаж <strong>${sales.length}</strong></span><span>Предложений от покупателей <strong>${offers}</strong></span><span class="sales-summary-note">Проверяйте после смены дня</span>`;
    [...$("sellingItems").children].forEach((card, index) => {
      const sale = sales[index];
      if (!sale) return;
      card.classList.add("sale-lot");
      const heading = document.createElement("h3");
      const text = card.firstChild;
      if (text?.nodeType === Node.TEXT_NODE) {
        heading.textContent = text.textContent;
        text.replaceWith(heading);
      }
      const art = document.createElement("div");
      art.className = "sale-art";
      art.innerHTML = artwork(sale);
      card.prepend(art);
      const status = card.querySelector(":scope>div:not(.sale-art)");
      if (status) {
        status.classList.add("sale-status");
        const remaining = document.createElement("p");
        remaining.className = "sale-remaining";
        remaining.textContent = `Осталось дней: ${sale.daysLeft}`;
        status.prepend(remaining);
      }
    });
    if (!sales.length) {
      $("emptySelling").innerHTML =
        `<div class="empty-collection-art">${svg("selling")}</div><h3>Хорошая находка ищет нового владельца.</h3><p>После экспертизы откройте вещь в коллекции и выберите способ продажи.</p><button class="ux-primary" id="selling-to-collection">Перейти в коллекцию ${svg("arrow")}</button>`;
      $("selling-to-collection").onclick = () => switchTab("inventory");
    }
  };
  const originalStats = renderStats;
  const dealHead = $("content-stats").querySelector("thead tr");
  if (dealHead?.children.length === 5) {
    const iconHead = document.createElement("th");
    iconHead.setAttribute("aria-label", "Тип предмета");
    dealHead.prepend(iconHead);
  }
  renderStats = function () {
    originalStats();
    $("stat-bought").textContent = gameState.stats.bought;
    $("stat-sold").textContent = gameState.stats.sold;
    $("stat-profit").textContent = money(gameState.stats.profit);
    $("stat-days").textContent = gameState.day;
    $("progress-money").style.width =
      Math.min(100, Math.max(0, (gameState.money / 100000) * 100)) + "%";
    $("progress-reputation").style.width =
      Math.min(100, Math.max(0, (gameState.reputation / 50) * 100)) + "%";
    document.querySelectorAll("#dealsLog .deal-row").forEach((row) => {
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.setAttribute("aria-label", "Показать подробности сделки");
      row.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          row.click();
        }
      };
    });
  };
  const helpTips = document.createElement("section");
  helpTips.className = "help-quickstart";
  helpTips.innerHTML = `<div class="eyebrow">КОРОТКО О ГЛАВНОМ</div><h2>Осмотритесь. Остальное придёт с опытом.</h2><div><p><strong>01 / Сравните предложения</strong>Предпросмотр бесплатный. Вход в торг расходует внимание.</p><p><strong>02 / Исследуйте покупку</strong>Подлинность и ценность выясняются на экспертизе, а не по иллюстрации.</p><p><strong>03 / Не теряйте находки</strong>Избранное — это заметки, не резерв. Если уйти из торга, вещь исчезнет.</p></div><small>Быстрый поиск на компьютере: клавиша / · На телефоне разделы всегда доступны в нижнем меню.</small>`;
  $("content-help").prepend(helpTips);
  // On phones, show a slim resource bar only after the main indicators scroll away.
  const compact = document.createElement("div");
  compact.className = "compact-resources";
  compact.setAttribute("aria-label", "Текущие ресурсы");
  compact.innerHTML =
    '<span id="compact-day"></span><strong id="compact-money"></strong><span id="compact-attention"></span>';
  document.body.append(compact);
  const originalHUD = syncGameHUD;
  function syncCompact() {
    $("compact-day").textContent = "День " + gameState.day;
    $("compact-money").textContent = money(gameState.money);
    $("compact-attention").textContent =
      "Внимание: " + Math.round(gameState.attention);
  }
  syncGameHUD = function () {
    originalHUD();
    syncCompact();
  };
  new MutationObserver(syncCompact).observe(
    document.querySelector(".wallet-strip"),
    { childList: true, subtree: true, characterData: true },
  );
  new IntersectionObserver(
    (entries) =>
      document.body.classList.toggle(
        "resources-scrolled",
        !entries[0].isIntersecting,
      ),
    { threshold: 0 },
  ).observe(document.querySelector(".wallet-strip"));
  // Stable presentation API for the collector workspace. No game-state setters.
  window.TorgUI = Object.freeze({ artwork, escape, money, svg, openPreview });
  // Existing updateDisplay wrapper resolves syncGameHUD at call time.
  window.addEventListener("load", () => {
    syncGameHUD();
    renderMarket();
  });
})();
