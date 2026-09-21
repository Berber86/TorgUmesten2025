/* Edition III: a collector's home, notebook and comparison desk.
   All persisted data uses torg-ui-*; gameplay and its save are read-only here. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const { artwork, escape: esc, money, svg, openPreview } = window.TorgUI;
  const icon = (name) => {
    const paths = {
      home: '<path d="m3 10 9-7 9 7v11H3Zm6 11v-8h6v8"/>',
      notebook:
        '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M3 7h4M3 12h4M3 17h4M10 8h6M10 12h6M10 16h3"/>',
      compare:
        '<path d="M8 3v18M16 3v18M3 7h10M11 17h10M5 5 3 7l2 2M19 15l2 2-2 2"/>',
      pen: '<path d="m14 4 6 6M4 20l5-1L21 7l-4-4L5 15Zm0 0 1-5"/>',
      command:
        '<path d="M9 9H6a3 3 0 1 1 3-3v12a3 3 0 1 1-3-3h12a3 3 0 1 1-3 3V6a3 3 0 1 1 3 3Z"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2m-3-7 1-1M5 19l2-2M5 5l2 2m10 10 2 2"/>',
    };
    return paths[name]
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`
      : svg(name);
  };
  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem("torg-ui-" + key)) ?? fallback;
    } catch {
      return fallback;
    }
  }
  function store(key, value) {
    try {
      localStorage.setItem("torg-ui-" + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
  let name = read("shop-name", "Находка");
  if (typeof name !== "string" || !name.trim()) name = "Находка";
  name = name.slice(0, 32);
  const rawNotes = read("notebook", []);
  let notes = Array.isArray(rawNotes)
    ? rawNotes
        .filter(
          (n) => n && typeof n.id === "string" && typeof n.text === "string",
        )
        .map((n) => ({
          ...n,
          text: n.text.slice(0, 1500),
          day: Number.isFinite(Number(n.day))
            ? Math.max(1, Math.floor(Number(n.day)))
            : 1,
          title: String(n.title || "Заметка").slice(0, 300),
        }))
        .slice(0, 200)
    : [];
  const comparisons = new Set();
  let tab = "market";
  const live = document.createElement("div");
  live.className = "atelier-announcement";
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  document.body.append(live);
  let toastTimer;
  function announce(text) {
    live.textContent = text;
    live.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => live.classList.remove("show"), 3000);
  }
  const findItem = (id) =>
    [
      ...gameState.marketItems,
      ...gameState.inventory,
      ...gameState.sellingItems,
    ].find((i) => String(i.id) === String(id));
  const titleFor = (item) =>
    item.expertiseDone && gameState.inventory.includes(item)
      ? getTrueName(item)
      : getDisplayName(
          item,
          gameState.marketItems.includes(item)
            ? 0
            : gameState.skills[item.category] || 0,
        );
  function dialog(id, title) {
    const d = document.createElement("dialog");
    d.id = id;
    d.className = "ux-dialog atelier-dialog";
    d.setAttribute("aria-label", title);
    d.addEventListener("click", (e) => {
      if (e.target === d) d.close();
    });
    document.body.append(d);
    return d;
  }

  // A new room, backed by existing metrics and actions, not a new economy.
  const studio = document.createElement("section");
  studio.id = "content-atelier";
  studio.className = "hidden";
  studio.innerHTML = `<div class="studio-masthead"><div><div class="eyebrow">ЛИЧНОЕ ДЕЛО / КАБИНЕТ КОЛЛЕКЦИОНЕРА</div><h1>Лавка «<span id="shop-name"></span>»<span class="studio-dot">.</span></h1><p>Здесь случайные находки становятся вашей историей.</p></div><button id="rename-shop" class="studio-edit">${icon("pen")} Название лавки</button></div>
  <div class="studio-top"><div class="studio-scene"><img src="assets/atelier-room.jpg" alt="Атмосферная иллюстрация антикварной лавки: рабочий стол и полки в солнечном свете"><div class="scene-grain"></div><div class="scene-heading"><span class="scene-open"><i></i> ДЕЛО ОТКРЫТО</span><h2>У вещей есть прошлое.<br><em>У вас — планы.</em></h2></div><button class="scene-hotspot hotspot-market" data-studio-tab="market"><span>01</span><div><strong>На барахолку</strong><small>Новые истории ждут</small></div>${svg("arrow")}</button><button class="scene-hotspot hotspot-notes" data-journal><span>02</span><div><strong>Полевой дневник</strong><small>То, что стоит запомнить</small></div>${svg("arrow")}</button><div class="scene-caption"><span>КАБИНЕТ ВООБРАЖЕНИЯ</span><span>Атмосферная иллюстрация</span></div></div>
  <aside class="studio-agenda"><div class="agenda-head"><span class="eyebrow">НА ОЧЕРЕДИ</span><span id="studio-day"></span></div><h2>Хороший день<br>для хорошей сделки.</h2><div id="studio-actions"></div><div class="agenda-foot">${icon("sun")} Без спешки. Но находки не ждут.</div></aside></div>
  <div class="studio-bottom"><section class="studio-shelf"><header><div><span class="eyebrow">ЛИЧНОЕ СОБРАНИЕ</span><h2>С полки коллекционера</h2></div><button data-studio-tab="inventory">Вся коллекция ${svg("arrow")}</button></header><div id="studio-shelf-items"></div></section><section class="studio-goals"><span class="eyebrow">ДЕЛО РАСТЁТ</span><h2>От первой находки<br>к большому имени.</h2><div id="studio-goal-metrics"></div><button data-studio-tab="stats">Посмотреть результаты ${svg("arrow")}</button></section></div>
  <section class="studio-notebook-banner"><div class="notebook-seal">${icon("notebook")}</div><div><span class="eyebrow">ПАМЯТЬ КОЛЛЕКЦИОНЕРА</span><h3>Хорошее чутьё начинается с наблюдений.</h3><p>Записывайте мысли о вещах. Сравнивайте предложения. Доверяйте фактам.</p></div><button data-journal>Открыть дневник ${svg("arrow")}</button></section>`;
  $("game-shell").insertBefore(studio, document.querySelector(".game-footer"));
  const navButton = document.createElement("button");
  navButton.id = "tab-atelier";
  navButton.className = "px-6 py-3 font-semibold";
  navButton.innerHTML = `<span class="nav-icon">${icon("home")}</span><span>Моя лавка</span><span class="nav-arrow">↗</span>`;
  navButton.onclick = () => switchTab("atelier");
  document.querySelector(".main-navigation").prepend(navButton);
  const dock = document.querySelector(".mobile-dock");
  const dockHome = document.createElement("button");
  dockHome.dataset.nav = "atelier";
  dockHome.innerHTML = icon("home") + "<span>Лавка</span>";
  dock.prepend(dockHome);
  // Keep the mobile dock at six items; Help remains accessible in the header/palette.
  dock.querySelector('[data-nav="help"]').remove();
  const brand = document.querySelector(".brand");
  brand.removeAttribute("href");
  brand.setAttribute("role", "button");
  brand.tabIndex = 0;
  brand.onclick = () => switchTab("atelier");
  brand.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      switchTab("atelier");
    }
  };
  const previousSwitch = switchTab;
  switchTab = function (next) {
    studio.classList.add("hidden");
    navButton.classList.remove("tab-active");
    navButton.setAttribute("aria-current", "false");
    if (next === "atelier") {
      // Original navigation hides the six game rooms; the new room is UI only.
      previousSwitch("market");
      $("content-market").classList.add("hidden");
      studio.classList.remove("hidden");
      document.querySelectorAll(".main-navigation button").forEach((b) => {
        b.classList.remove("tab-active");
        b.setAttribute("aria-current", "false");
      });
      navButton.classList.add("tab-active");
      navButton.setAttribute("aria-current", "page");
      $("page-label").textContent = "Моя лавка";
      renderStudio();
    } else previousSwitch(next);
    tab = next;
    document.body.dataset.room = next;
    dock
      .querySelectorAll("[data-nav]")
      .forEach((b) =>
        b.setAttribute(
          "aria-current",
          String(b.dataset.nav === next ? "page" : "false"),
        ),
      );
    refreshTray();
  };
  window.switchTab = switchTab;
  studio.addEventListener("click", (e) => {
    const b = e.target.closest("[data-studio-tab]");
    if (b) switchTab(b.dataset.studioTab);
    if (e.target.closest("[data-journal]")) openNotebook();
    const stage = e.target.closest("[data-studio-stage]");
    if (stage) {
      switchTab("inventory");
      document
        .querySelector(`[data-stage="${stage.dataset.studioStage}"]`)
        ?.click();
    }
    const inspect = e.target.closest("[data-studio-item]");
    if (inspect) {
      switchTab("inventory");
      document.querySelector('[data-stage="all"]').click();
      $("collection-search").value = "";
      $("collection-search").dispatchEvent(new Event("input"));
      const card = [...document.querySelectorAll("#inventoryItems>.card")].find(
        (c) => c.dataset.itemId === inspect.dataset.studioItem,
      );
      if (card && !card.classList.contains("hidden")) {
        card.scrollIntoView({ block: "center", behavior: "smooth" });
        card.classList.add("studio-highlight");
        setTimeout(() => card.classList.remove("studio-highlight"), 1800);
      } else announce("Проверьте фильтр видимости образцов в коллекции.");
    }
  });
  function renderStudio() {
    $("shop-name").textContent = name;
    $("studio-day").textContent =
      "ДЕНЬ " + String(gameState.day).padStart(2, "0");
    const research = gameState.inventory.filter((i) => !i.expertiseDone).length;
    const offers = gameState.sellingItems.reduce(
      (n, i) => n + (i.offers?.length || 0),
      0,
    );
    $("studio-actions").innerHTML =
      `<button data-studio-tab="market"><span class="agenda-number">01</span><div><strong>Найти что-то стоящее</strong><small>${gameState.marketItems.length} предложений на рынке</small></div>${svg("arrow")}</button><button data-studio-stage="research"><span class="agenda-number">02</span><div><strong>${research ? "Присмотреться к покупкам" : "Собрать свою коллекцию"}</strong><small>${research ? research + " ждут экспертизы" : "Каждая история начинается с первой вещи"}</small></div>${svg("arrow")}</button><button data-studio-tab="selling"><span class="agenda-number">03</span><div><strong>${offers ? "Вам предлагают сделку" : "Дать вещам новую жизнь"}</strong><small>${offers ? offers + " предложений покупателей" : gameState.sellingItems.length + " активных продаж"}</small></div>${svg("arrow")}</button>`;
    const items = gameState.inventory.slice(0, 3);
    $("studio-shelf-items").innerHTML = items.length
      ? items
          .map(
            (item) =>
              `<button class="shelf-item" data-studio-item="${esc(item.id)}"><div>${artwork(item)}<span>${item.expertiseDone ? "Оценён" : "На исследовании"}</span></div><h3>${esc(titleFor(item))}</h3><small>Куплено за <strong>${money(item.purchasePrice)}</strong></small></button>`,
          )
          .join("")
      : `<div class="shelf-empty"><div class="shelf-ghost">${icon("inventory")}</div><div><h3>Первое место — для первой находки.</h3><p>Купленные предметы появятся на этой полке.</p><button data-studio-tab="market">Присмотреть что-нибудь ${svg("arrow")}</button></div></div>`;
    const cash = Math.min(100, Math.max(0, gameState.money / 1000)),
      rep = Math.min(100, Math.max(0, gameState.reputation * 2));
    $("studio-goal-metrics").innerHTML =
      `<div><div><span>Капитал</span><strong>${money(gameState.money)} <small>/ 100 000 ₽</small></strong></div><progress value="${cash}" max="100" aria-label="Капитал: ${money(gameState.money)} из 100000 рублей"></progress></div><div><div><span>Репутация</span><strong>${gameState.reputation} <small>/ 50</small></strong></div><progress value="${rep}" max="100" aria-label="Репутация: ${gameState.reputation} из 50"></progress></div><p>Две цели вашего антикварного дела.</p>`;
  }
  const rename = dialog("shop-settings", "Название лавки");
  rename.classList.add("shop-settings");
  $("rename-shop").onclick = () => {
    rename.innerHTML = `<button class="dialog-close" data-close aria-label="Закрыть">${svg("close")}</button><div class="eyebrow">ТАБЛИЧКА НА ВАШЕЙ ДВЕРИ</div><h2>Как назовём лавку?</h2><form><label for="shop-name-input">Название</label><input id="shop-name-input" maxlength="32" required value="${esc(name)}" autocomplete="off"><p>Только название в интерфейсе. На игру не влияет.</p><button class="ux-primary">Повесить табличку ${svg("arrow")}</button></form>`;
    rename.querySelector("[data-close]").onclick = () => rename.close();
    rename.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const next = $("shop-name-input").value.trim();
      if (!next) {
        $("shop-name-input").setCustomValidity("Введите название");
        $("shop-name-input").reportValidity();
        return;
      }
      name = next;
      const saved = store("shop-name", name);
      renderStudio();
      rename.close();
      announce(
        saved
          ? "У вашей лавки новое имя."
          : "Название изменено на эту сессию: хранилище недоступно.",
      );
    };
    $("shop-name-input").oninput = (e) => e.target.setCustomValidity("");
    rename.showModal();
  };

  // Comparison uses asking price and other public catalogue data only.
  const tray = document.createElement("aside");
  tray.className = "comparison-tray";
  tray.setAttribute("aria-label", "Выбранные для сравнения предложения");
  tray.innerHTML = `<div class="tray-symbol">${icon("compare")}</div><div><strong>Стол сравнения</strong><span id="comparison-count"></span></div><div id="comparison-miniatures"></div><button id="open-comparison">Сравнить ${svg("arrow")}</button><button id="clear-comparison" aria-label="Очистить сравнение">${svg("close")}</button>`;
  document.body.append(tray);
  const compareDialog = dialog("comparison-dialog", "Сравнение предложений");
  function publicItems() {
    return [...comparisons]
      .map((id) => gameState.marketItems.find((i) => String(i.id) === id))
      .filter(Boolean);
  }
  function refreshTray() {
    const items = publicItems();
    for (const id of comparisons)
      if (!items.some((i) => String(i.id) === id)) comparisons.delete(id);
    $("comparison-count").textContent = items.length + " из 3 предложений";
    $("comparison-miniatures").innerHTML = items
      .map(
        (i) =>
          `<span title="${esc(getDisplayName(i, 0))}">${artwork(i)}</span>`,
      )
      .join("");
    tray.classList.toggle("is-visible", items.length > 0 && tab === "market");
    document.body.classList.toggle(
      "has-comparison",
      items.length > 0 && tab === "market",
    );
    $("open-comparison").disabled = items.length < 2;
    document.querySelectorAll("[data-compare]").forEach((b) => {
      const chosen = comparisons.has(b.dataset.compare);
      b.setAttribute("aria-pressed", String(chosen));
      b.innerHTML = icon("compare") + (chosen ? "В сравнении" : "Сравнить");
    });
  }
  function toggleCompare(id) {
    if (comparisons.has(id)) comparisons.delete(id);
    else if (comparisons.size < 3) comparisons.add(id);
    else {
      announce(
        "На столе уже три предложения. Уберите одно, чтобы добавить другое.",
      );
      return;
    }
    refreshTray();
  }
  function renderComparison() {
    const items = publicItems();
    compareDialog.innerHTML = `<button class="dialog-close" data-close aria-label="Закрыть сравнение">${svg("close")}</button><header class="desk-header"><div class="eyebrow">ПРЕЖДЕ ЧЕМ РЕШИТЬСЯ</div><h2>Разложим по полочкам.</h2><p>Сравнивайте предложения, а не обещания. Истинная ценность пока неизвестна.</p></header><div class="comparison-grid" style="--compare-columns:${Math.max(1, items.length)}">${items.map((item) => `<article class="comparison-item"><div class="compare-art">${artwork(item)}<small>Условная иллюстрация</small></div><div class="compare-copy"><span>${esc(marketCategoryNames[item.category])}</span><h3>${esc(getDisplayName(item, 0))}</h3><dl><div><dt>Цена продавца</dt><dd>${money(item.askingPrice)}</dd></div><div><dt>Остаток бюджета при покупке за эту цену</dt><dd class="${item.askingPrice > gameState.money ? "over-budget" : ""}">${money(gameState.money - item.askingPrice)}</dd></div><div><dt>Продавец</dt><dd>${esc(item.sellerName)}</dd></div><div><dt>Вход в торг</dt><dd>${ATTENTION_COSTS.ENTER_HAGGLE} ед. внимания</dd></div></dl><button class="ux-primary" data-compare-preview="${esc(item.id)}">Посмотреть предложение ${svg("arrow")}</button><button class="compare-remove" data-remove="${esc(item.id)}">Убрать со стола</button></div></article>`).join("")}</div><p class="comparison-footnote">Сравнение бесплатно и не резервирует вещи. Суммы рассчитаны отдельно для каждого предложения.</p>`;
    compareDialog.querySelector("[data-close]").onclick = () =>
      compareDialog.close();
    compareDialog.querySelectorAll("[data-remove]").forEach(
      (b) =>
        (b.onclick = () => {
          comparisons.delete(b.dataset.remove);
          refreshTray();
          if (publicItems().length) renderComparison();
          else compareDialog.close();
        }),
    );
    compareDialog.querySelectorAll("[data-compare-preview]").forEach(
      (b) =>
        (b.onclick = () => {
          compareDialog.close();
          openPreview(b.dataset.comparePreview);
        }),
    );
  }
  $("open-comparison").onclick = () => {
    renderComparison();
    compareDialog.showModal();
  };
  $("clear-comparison").onclick = () => {
    comparisons.clear();
    refreshTray();
  };
  const originalMarket = renderMarket;
  renderMarket = function () {
    originalMarket();
    document.querySelectorAll(".find-card").forEach((card) => {
      if (card.querySelector(".collector-tools")) return;
      const id = card.querySelector("[data-preview]")?.dataset.preview;
      if (!id) return;
      const controls = document.createElement("div");
      controls.className = "collector-tools";
      controls.innerHTML = `<button data-compare="${esc(id)}" aria-pressed="false">${icon("compare")} Сравнить</button><button data-note="${esc(id)}" aria-label="Записать наблюдение">${icon("pen")} Заметка</button>`;
      card.querySelector(".find-content").append(controls);
    });
    refreshTray();
  };
  $("marketItems").addEventListener("click", (e) => {
    const compare = e.target.closest("[data-compare]"),
      note = e.target.closest("[data-note]");
    if (compare) toggleCompare(compare.dataset.compare);
    if (note) openNotebook(note.dataset.note);
  });

  // Notebook: plain text, explicit save, no research bonuses or hidden evidence.
  const notebook = dialog("collector-notebook", "Полевой дневник");
  let editingId = null,
    dirty = false;
  notebook.addEventListener("cancel", (e) => {
    if (dirty) {
      e.preventDefault();
      showUnsaved();
    }
  });
  notebook.addEventListener("click", (e) => {
    if (e.target === notebook && dirty) {
      /* backdrop close is handled below by the close guard */
    }
  });
  // Override the generic backdrop handler for this dialog: protect unsaved writing.
  notebook.addEventListener(
    "click",
    (e) => {
      if (e.target === notebook) {
        e.stopImmediatePropagation();
        requestNotebookClose();
      }
    },
    true,
  );
  const noteData = (id) => notes.find((n) => n.id === String(id));
  function showUnsaved() {
    const status = $("note-status");
    if (status)
      status.innerHTML =
        'Есть несохранённый текст. <button type="button" id="discard-note">Закрыть без сохранения</button>';
    if ($("discard-note"))
      $("discard-note").onclick = () => {
        dirty = false;
        notebook.close();
      };
  }
  function requestNotebookClose() {
    if (dirty) showUnsaved();
    else notebook.close();
  }
  function openNotebook(id = null) {
    if (notebook.open && dirty) {
      showUnsaved();
      return;
    }
    editingId = id ? String(id) : null;
    dirty = false;
    renderNotebook();
    if (!notebook.open) notebook.showModal();
  }
  function renderNotebook() {
    const item = editingId ? findItem(editingId) : null,
      stored = editingId ? noteData(editingId) : null;
    notebook.innerHTML = `<button class="dialog-close" data-note-close aria-label="Закрыть дневник">${svg("close")}</button><aside class="notebook-spine"><div class="notebook-mark">${icon("notebook")}</div><span>ПОЛЕВОЙ<br>ДНЕВНИК</span><small>НАБЛЮДАТЬ.<br>ЗАПОМИНАТЬ.<br>НАХОДИТЬ.</small><div class="notebook-index"><button id="new-note">+ Новая запись</button><div id="note-index-list">${
      notes.length
        ? notes
            .slice()
            .reverse()
            .map(
              (n) =>
                `<button data-edit-note="${esc(n.id)}" class="${n.id === editingId ? "selected" : ""}"><small>День ${Number(n.day) || 1}</small><span>${esc(n.title)}</span></button>`,
            )
            .join("")
        : "<p>Здесь будут ваши записи.</p>"
    }</div></div></aside><section class="notebook-paper"><div class="eyebrow">ТОЛЬКО ВАШИ НАБЛЮДЕНИЯ</div><h2>${esc(item ? titleFor(item) : stored?.title || "То, что стоит запомнить.")}</h2><p class="notebook-intro">${item ? "Заметка о предмете. Она останется, даже если предложение исчезнет." : "Дневник не влияет на навыки и не подсказывает скрытые свойства вещей."}</p><form id="note-form"><label for="note-text">Личная запись</label><textarea id="note-text" maxlength="1500" placeholder="Что привлекло внимание? О чём спросить продавца? К какой вещи вернуться?">${esc(stored?.text || "")}</textarea><div class="note-meta"><span>День ${stored?.day || gameState.day}</span><span id="note-length">${stored?.text.length || 0} / 1500</span></div><div class="note-actions"><button class="ux-primary" type="submit">Сохранить запись ${svg("arrow")}</button>${stored ? '<button id="delete-note" type="button">Удалить запись</button>' : ""}</div><p id="note-status" role="status">Записи хранятся только в этом браузере, отдельно от игрового прогресса.</p></form><button id="export-notes" ${notes.length ? "" : "disabled"}>Скачать дневник .txt ${svg("arrow")}</button></section>`;
    notebook.querySelector("[data-note-close]").onclick = requestNotebookClose;
    $("new-note").onclick = () => openNotebook();
    notebook
      .querySelectorAll("[data-edit-note]")
      .forEach((b) => (b.onclick = () => openNotebook(b.dataset.editNote)));
    $("note-text").oninput = (e) => {
      dirty = true;
      if ($("delete-note")) {
        delete $("delete-note").dataset.confirm;
        $("delete-note").textContent = "Удалить запись";
      }
      $("note-length").textContent = e.target.value.length + " / 1500";
      $("note-status").textContent = "Не сохранено";
    };
    $("note-form").onsubmit = (e) => {
      e.preventDefault();
      const text = $("note-text").value.trim();
      if (!text) {
        $("note-status").textContent = "Сначала напишите пару слов.";
        return;
      }
      const note = {
        id: editingId || "note_" + Date.now(),
        title: item
          ? titleFor(item)
          : stored?.title || text.split("\n")[0].slice(0, 64),
        text,
        day: stored?.day || gameState.day,
      };
      if (notes.length >= 200 && !notes.some((n) => n.id === note.id)) {
        $("note-status").textContent =
          "В дневнике уже 200 записей. Скачайте архив и удалите ненужное, чтобы освободить место.";
        return;
      }
      const next = notes.filter((n) => n.id !== note.id).concat(note);
      if (!store("notebook", next)) {
        $("note-status").textContent =
          "Не удалось сохранить. Скопируйте текст: хранилище браузера недоступно.";
        return;
      }
      notes = next;
      editingId = note.id;
      dirty = false;
      renderNotebook();
      $("note-status").textContent = "Запись сохранена.";
    };
    if ($("delete-note"))
      $("delete-note").onclick = () => {
        if ($("delete-note").dataset.confirm !== "yes") {
          $("delete-note").dataset.confirm = "yes";
          $("delete-note").textContent = "Точно удалить?";
          $("note-status").textContent =
            "Нажмите ещё раз, чтобы удалить запись безвозвратно.";
          return;
        }
        const next = notes.filter((n) => n.id !== editingId);
        if (!store("notebook", next)) {
          $("note-status").textContent =
            "Удалить запись не удалось: хранилище недоступно.";
          return;
        }
        notes = next;
        editingId = null;
        dirty = false;
        renderNotebook();
      };
    $("export-notes").onclick = () => {
      const text =
        "ПОЛЕВОЙ ДНЕВНИК · " +
        name +
        "\n\n" +
        notes
          .map((n) => "День " + n.day + " · " + n.title + "\n" + n.text)
          .join("\n\n— — —\n\n");
      const url = URL.createObjectURL(
        new Blob([text], { type: "text/plain;charset=utf-8" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "torg-diary.txt";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
  }
  const noteLauncher = document.createElement("button");
  noteLauncher.className = "sidebar-notebook";
  noteLauncher.innerHTML = icon("notebook") + "<span>Полевой дневник</span>";
  noteLauncher.onclick = () => openNotebook();
  document.querySelector(".sidebar-bottom").before(noteLauncher);
  document.addEventListener("torg:preview", (e) => {
    const p = $("item-inspector").querySelector(".preview-info");
    if (!p) return;
    const b = document.createElement("button");
    b.className = "preview-note-button";
    b.innerHTML = icon("pen") + " Сделать заметку";
    b.onclick = () => openNotebook(String(e.detail.id));
    p.append(b);
  });
  const originalInventory = renderInventory;
  renderInventory = function () {
    originalInventory();
    document
      .querySelectorAll("#inventoryItems>.card[data-item-id]")
      .forEach((card) => {
        const b = document.createElement("button");
        b.className = "collection-note-button";
        b.innerHTML = icon("notebook") + " Запись о предмете";
        b.onclick = () => openNotebook(card.dataset.itemId);
        card.append(b);
      });
  };

  // Command palette: navigation and public market names, never secret item data.
  const palette = dialog("command-palette", "Быстрый переход");
  palette.classList.add("command-palette");
  const launch = document.createElement("button");
  launch.className = "command-launch";
  launch.setAttribute("aria-label", "Быстрый переход и поиск");
  launch.innerHTML =
    icon("search") + "<span>Куда отправимся?</span><kbd>Ctrl K</kbd>";
  launch.onclick = openPalette;
  document.querySelector(".topbar-right").prepend(launch);
  let paletteIndex = 0,
    paletteActions = [];
  function openPalette() {
    if (document.querySelector("dialog[open],.modal-backdrop:not(.hidden)"))
      return;
    palette.innerHTML = `<div class="palette-search">${icon("search")}<input id="palette-query" placeholder="Раздел, предмет или продавец…" aria-label="Поиск по игре" autocomplete="off"><button data-close aria-label="Закрыть">Esc</button></div><div id="palette-results" role="group" aria-label="Результаты поиска"></div><footer><span>↑ ↓ выбрать · Enter открыть</span><span>Без игровых действий</span></footer>`;
    palette.querySelector("[data-close]").onclick = () => palette.close();
    $("palette-query").oninput = () => {
      paletteIndex = 0;
      renderPalette();
    };
    palette.onkeydown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        paletteIndex =
          (paletteIndex +
            (e.key === "ArrowDown" ? 1 : -1) +
            paletteActions.length) %
          Math.max(1, paletteActions.length);
        markPalette();
      }
      if (e.key === "Enter" && paletteActions.length) {
        e.preventDefault();
        paletteActions[paletteIndex].run();
      }
    };
    renderPalette();
    palette.showModal();
    $("palette-query").focus();
  }
  function renderPalette() {
    const query = $("palette-query").value.toLocaleLowerCase("ru").trim();
    const sections = [
      ["atelier", "Моя лавка", "Кабинет коллекционера"],
      ["market", "Барахолка", "Поиск новых находок"],
      ["inventory", "Коллекция", "Исследование и оценка"],
      ["selling", "Продажа", "Предложения покупателей"],
      ["knowledge", "База знаний", "Навыки и опыт"],
      ["stats", "Статистика", "Результаты сделок"],
      ["help", "Помощь", "Правила игры"],
    ].map(([key, title, subtitle]) => ({
      title,
      subtitle,
      icon: key === "atelier" ? "home" : key,
      run: () => {
        palette.close();
        switchTab(key);
      },
    }));
    sections.push({
      title: "Полевой дневник",
      subtitle: "Ваши личные записи",
      icon: "notebook",
      run: () => {
        palette.close();
        openNotebook();
      },
    });
    const lots = query
      ? gameState.marketItems.map((item) => ({
          title: getDisplayName(item, 0),
          subtitle: item.sellerName + " · " + money(item.askingPrice),
          icon: "inventory",
          run: () => {
            palette.close();
            switchTab("market");
            openPreview(item.id);
          },
        }))
      : [];
    paletteActions = [...sections, ...lots]
      .filter((a) =>
        (a.title + " " + a.subtitle).toLocaleLowerCase("ru").includes(query),
      )
      .slice(0, 12);
    $("palette-results").innerHTML = paletteActions.length
      ? paletteActions
          .map(
            (a, i) =>
              `<button data-palette-index="${i}">${icon(a.icon)}<span><strong>${esc(a.title)}</strong><small>${esc(a.subtitle)}</small></span>${svg("arrow")}</button>`,
          )
          .join("")
      : '<p class="palette-empty">Ничего не нашлось. Попробуйте другое слово.</p>';
    palette
      .querySelectorAll("[data-palette-index]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            paletteActions[Number(b.dataset.paletteIndex)].run()),
      );
    markPalette();
  }
  function markPalette() {
    palette.querySelectorAll("[data-palette-index]").forEach((b) => {
      const active = Number(b.dataset.paletteIndex) === paletteIndex;
      b.classList.toggle("selected", active);
      if (active) b.scrollIntoView({ block: "nearest" });
    });
  }
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (palette.open) palette.close();
      else openPalette();
    }
  });

  // Negotiation now feels like a conversation: portrait and live, public deltas.
  const sellerBlock = $("sellerIcon").parentElement.parentElement;
  sellerBlock.classList.add("seller-conversation");
  const sellerVisual = document.createElement("div");
  sellerVisual.className = "seller-visual";
  sellerBlock.prepend(sellerVisual);
  const pulse = document.createElement("div");
  pulse.id = "negotiation-pulse";
  $("haggleModal").querySelector(".negotiation-heading").after(pulse);
  function syncNegotiation() {
    if (!currentHaggle) return;
    const h = currentHaggle,
      cfg = getSellerConfig(h.item.sellerType);
    const path = cfg.image ? "seller_portraits/" + cfg.image : null;
    if (sellerVisual.dataset.seller !== h.item.sellerType) {
      sellerVisual.dataset.seller = h.item.sellerType;
      sellerVisual.innerHTML = path
        ? `<img src="${esc(path)}" alt="Иллюстрация продавца" onerror="this.hidden=true">`
        : `<span>${esc(h.item.sellerIcon)}</span>`;
    }
    const difference = h.item.askingPrice - h.currentPrice;
    pulse.innerHTML = `<div><small>Снижение цены</small><strong>${difference > 0 ? "−" + money(difference) : "Пока без скидки"}</strong></div><div><small>Ваш бюджет</small><strong>${money(gameState.money)}</strong></div><div><small>Терпение продавца</small><div class="patience-meter" role="meter" aria-valuemin="0" aria-valuemax="${h.maxPatience}" aria-valuenow="${h.patience}" aria-label="Терпение продавца"><i style="width:${Math.max(0, Math.min(100, (h.patience / h.maxPatience) * 100))}%"></i></div></div>`;
    $("competitorsCount").textContent = h.competitors.length;
  }
  new MutationObserver(syncNegotiation).observe($("sellerQuote"), {
    childList: true,
    subtree: true,
    characterData: true,
  });
  // A purchase receipt acknowledges the existing transaction, after its dialog closes.
  const receipt = document.createElement("aside");
  receipt.id = "purchase-receipt";
  receipt.setAttribute("aria-label", "Последняя покупка");
  document.body.append(receipt);
  let boughtBefore = gameState.stats.bought,
    receiptTimer;
  function dismissReceipt() {
    receipt.classList.remove("visible");
    document.body.classList.remove("receipt-open");
    clearTimeout(receiptTimer);
  }
  new MutationObserver(() => {
    if (!$("haggleModal").classList.contains("hidden")) {
      boughtBefore = gameState.stats.bought;
      return;
    }
    if (gameState.stats.bought <= boughtBefore || !gameState.inventory.length)
      return;
    boughtBefore = gameState.stats.bought;
    const item = gameState.inventory[0];
    receipt.innerHTML = `<button class="receipt-close" aria-label="Закрыть квитанцию">${svg("close")}</button><div class="receipt-art">${artwork(item)}</div><div class="receipt-content"><span class="receipt-stamp">ТЕПЕРЬ В ВАШЕЙ КОЛЛЕКЦИИ</span><h3>${esc(titleFor(item))}</h3><p>Договорились на <strong>${money(item.purchasePrice)}</strong></p><button class="receipt-action">Открыть коллекцию ${svg("arrow")}</button></div>`;
    receipt.querySelector(".receipt-close").onclick = dismissReceipt;
    receipt.querySelector(".receipt-action").onclick = () => {
      dismissReceipt();
      switchTab("inventory");
    };
    receipt.classList.add("visible");
    document.body.classList.add("receipt-open");
    clearTimeout(receiptTimer);
    receiptTimer = setTimeout(dismissReceipt, 10000);
  }).observe($("haggleModal"), {
    attributes: true,
    attributeFilter: ["class"],
  });
  // Refresh the room when an original async transaction updates resource indicators.
  let studioFrame;
  new MutationObserver(() => {
    if (tab !== "atelier" || studioFrame) return;
    studioFrame = requestAnimationFrame(() => {
      studioFrame = null;
      renderStudio();
    });
  }).observe(document.querySelector(".wallet-strip"), {
    subtree: true,
    childList: true,
    characterData: true,
  });
  // A collapsible cover makes repeat trips to the market quicker.
  const fold = document.createElement("button");
  fold.id = "market-focus";
  fold.innerHTML = icon("grid") + " Компактный рынок";
  fold.setAttribute(
    "aria-pressed",
    String(read("compact-market", false) === true),
  );
  document.querySelector(".catalog-views").before(fold);
  const setCompact = (value) => {
    document.body.classList.toggle("market-focused", value);
    fold.setAttribute("aria-pressed", String(value));
  };
  setCompact(read("compact-market", false) === true);
  fold.onclick = () => {
    const next = fold.getAttribute("aria-pressed") !== "true";
    setCompact(next);
    store("compact-market", next);
  };
  const compactWalk = document.createElement("button");
  compactWalk.id = "compact-walk";
  compactWalk.innerHTML = icon("market") + " Прогулка";
  compactWalk.onclick = () => toggleMarketView();
  fold.after(compactWalk);
  // Load handlers in the original game choose inventory after a short delay.
  // Opening the workspace afterwards changes only the landing view.
  window.addEventListener("load", () =>
    setTimeout(() => {
      switchTab("atelier");
      document.documentElement.dataset.atelierReady = "true";
    }, 180),
  );
})();
