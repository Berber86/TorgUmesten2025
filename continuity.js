/* Edition IV: durable saves, resumable conversations and a legible daily close. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    { escape: esc, money, svg } = window.TorgUI;
  const schema = window.TorgSaveSchema;
  const KEY = "udelka_save",
    BACKUP = "udelka_save_backup",
    DAMAGED = "udelka_save_damaged",
    META = "udelka_save_meta";
  let replacing = false,
    blocked = false,
    booting = true,
    saveStatus = "pending",
    lastSavedAt = null,
    recoveryMessage = "",
    lastError = "";
  let bootState = JSON.parse(JSON.stringify(gameState));
  const statusButton = document.createElement("button");
  statusButton.className = "save-indicator";
  statusButton.id = "save-indicator";
  statusButton.setAttribute("aria-label", "Сейф прогресса");
  statusButton.innerHTML =
    '<span class="save-led"></span><span id="save-label">Подготовка архива</span>';
  statusButton.onclick = () => openVault();
  document.querySelector(".topbar-right").append(statusButton);
  function notifyStatus(status, error = "") {
    saveStatus = status;
    lastError = error;
    statusButton.dataset.status = status;
    const time = lastSavedAt
      ? new Date(lastSavedAt).toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    const labels = {
      pending: "Подготовка архива",
      saved: "Сохранено " + time,
      error: "Не удалось сохранить",
      protected: "Нужно восстановление",
    };
    $("save-label").textContent = labels[status] || status;
    statusButton.title = (error || labels[status]) + ". Открыть сейф прогресса";
  }
  function get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  function parseSafe(raw) {
    try {
      return raw ? schema.parse(raw) : null;
    } catch {
      return null;
    }
  }
  function download(text, filename, type = "application/json;charset=utf-8") {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  function busy() {
    return (
      dayTransitionPending ||
      !!currentHaggle ||
      !!currentExpertise ||
      !!currentSell ||
      !!currentRestorationItem
    );
  }
  window.saveGame = function (options = {}) {
    if (replacing) return false;
    if (blocked) {
      notifyStatus("protected", "Повреждённая запись защищена от перезаписи.");
      return false;
    }
    if (dayTransitionPending && !options.force) return false;
    try {
      saveHaggleProgress();
      schema.validate(gameState);
      const value = JSON.stringify(gameState),
        previous = localStorage.getItem(KEY);
      if (value !== previous) {
        // Preserve only a valid, different checkpoint. If backup storage fails,
        // leave the primary untouched and offer a file download of in-memory play.
        if (
          !booting &&
          !options.preserveBackup &&
          previous &&
          parseSafe(previous)
        )
          localStorage.setItem(BACKUP, previous);
        localStorage.setItem(KEY, value);
        lastSavedAt = Date.now();
        try {
          localStorage.setItem(
            META,
            JSON.stringify({ savedAt: lastSavedAt, day: gameState.day }),
          );
        } catch {
          /* primary has been written */
        }
      }
      if (!lastSavedAt) {
        try {
          lastSavedAt =
            JSON.parse(localStorage.getItem(META) || "null")?.savedAt ||
            Date.now();
        } catch {
          lastSavedAt = Date.now();
        }
      }
      notifyStatus("saved");
      return true;
    } catch (error) {
      notifyStatus("error", error.message);
      return false;
    }
  };
  const originalLoad = loadGame;
  loadGame = function () {
    let raw;
    try {
      raw = localStorage.getItem(KEY);
    } catch (error) {
      notifyStatus(
        "error",
        "Хранилище браузера недоступно. Игра работает в памяти — скачайте файл перед выходом.",
      );
      return false;
    }
    if (!raw) return false;
    if (!parseSafe(raw)) {
      try {
        localStorage.setItem(DAMAGED, raw);
      } catch {
        blocked = true;
        notifyStatus(
          "protected",
          "Не удалось создать копию повреждённой записи. Исходник не изменён.",
        );
        return false;
      }
      const backup = get(BACKUP);
      if (parseSafe(backup)) {
        try {
          localStorage.setItem(KEY, backup);
          recoveryMessage =
            "Основная запись была повреждена. Загружена последняя исправная резервная копия.";
        } catch {
          blocked = true;
          notifyStatus(
            "protected",
            "Резервная копия найдена, но записать её не удалось.",
          );
          return false;
        }
      } else {
        blocked = true;
        notifyStatus(
          "protected",
          "Сохранение повреждено. Исходник сохранён, автоматическая перезапись отключена.",
        );
        return false;
      }
    }
    const loaded = originalLoad();
    if (!loaded) {
      blocked = true;
      gameState = JSON.parse(JSON.stringify(bootState));
      notifyStatus(
        "protected",
        "Не удалось открыть сохранение. Исходный файл не изменён.",
      );
    }
    return loaded;
  };
  // Do not lose research performed through either the toolbar or table zones.
  const originalTactic = useTactic;
  useTactic = function (id) {
    try {
      return originalTactic(id);
    } finally {
      saveHaggleProgress();
      saveGame();
      syncTradeControls();
    }
  };
  for (const fn of ["clickVisualZone", "clickLoupeZone"]) {
    const original = window[fn];
    if (typeof original === "function")
      window[fn] = function (...args) {
        try {
          return original(...args);
        } finally {
          saveGame();
        }
      };
  }
  function syncTradeControls() {
    const h = currentHaggle;
    if (!h) return;
    const buy = $("haggleModal").querySelector(
      '[onclick="acceptCurrentPrice()"]',
    );
    if (buy)
      buy.disabled =
        !!h.finished ||
        !!h.purchaseCompleted ||
        gameState.money < h.currentPrice;
    document.querySelectorAll("#tacticButtons button").forEach((b) => {
      if (h.finished || h.purchaseCompleted) b.disabled = true;
    });
    const leave = $("haggleModal").querySelector('[onclick="closeHaggle()"]');
    if (leave)
      leave.textContent =
        h.finished || h.purchaseCompleted ? "Закрыть" : "Пауза";
  }
  const originalHaggleRender = renderHaggleModal;
  renderHaggleModal = function () {
    originalHaggleRender();
    syncTradeControls();
  };
  // Form constraints complement the guards in the actual transaction functions.
  for (const id of ["valueGuess", "ageGuess"]) {
    const input = $(id);
    input.min = "1";
    input.step = "1";
    input.required = true;
  }
  new MutationObserver(() => {
    const price = $("avitoPrice");
    if (price) {
      price.min = "1";
      price.step = "1";
      price.required = true;
    }
  }).observe($("sellModal"), { childList: true, subtree: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && !booting) saveGame();
  });
  window.addEventListener("pagehide", () => {
    if (!booting) saveGame();
  });
  setInterval(() => {
    if (!booting && !blocked) saveGame();
  }, 15000);

  // Paper archive: portable save, previous checkpoint, explicit replacement.
  const vault = document.createElement("dialog");
  vault.id = "save-vault";
  vault.className = "ux-dialog vault-dialog";
  vault.setAttribute("aria-labelledby", "vault-title");
  document.body.append(vault);
  vault.addEventListener("click", (e) => {
    if (e.target === vault && !blocked) vault.close();
  });
  vault.addEventListener("cancel", (e) => {
    if (blocked) e.preventDefault();
  });
  const vaultCard = document.createElement("section");
  vaultCard.className = "studio-vault-card";
  vaultCard.innerHTML = `<span class="vault-emblem">▣</span><div><span class="eyebrow">КОПИЯ ЗАПИСЕЙ</span><h3>Хоть записи не должны пропасть.</h3><p>Автосохранение, резервная копия и файл на случай переезда.</p></div><button id="studio-open-vault">Открыть сейф ${svg("arrow")}</button>`;
  document.querySelector(".studio-notebook-banner").after(vaultCard);
  $("studio-open-vault").onclick = () => openVault();
  const summary = (state) =>
    `<div class="checkpoint-metrics"><span><small>День</small><strong>${state.day}</strong></span><span><small>Капитал</small><strong>${money(state.money)}</strong></span><span><small>В коллекции</small><strong>${state.inventory?.length || 0}</strong></span></div>`;
  function renderVault() {
    const backup = parseSafe(get(BACKUP));
    const working = busy();
    vault.innerHTML = `${blocked ? "" : `<button class="dialog-close" data-vault-close aria-label="Закрыть сейф">${svg("close")}</button>`}<aside class="vault-cover"><span class="vault-edition">ЛИЧНЫЙ АРХИВ / 04</span><div class="vault-cover-symbol">▣</div><h2>Деньги<br>не вернуть.<br><em>Записи —<br>можно.</em></h2><div class="vault-cover-line"></div><p>Локальное сохранение на этом устройстве.<br>Не облачная синхронизация.</p></aside><div class="vault-content"><div class="eyebrow">СЕЙФ ПРОГРЕССА</div><h2 id="vault-title">Сохрани то,<br>до чего дошёл.</h2><div id="vault-status" role="status" class="vault-status ${saveStatus === "saved" ? "good" : "warning"}">${esc(blocked ? lastError : recoveryMessage || lastError || (saveStatus === "saved" ? "Последние изменения сохранены на этом устройстве." : "Сохранение будет создано при первом изменении."))}</div><section class="checkpoint"><div class="checkpoint-title"><h3>Сейчас в игре</h3><span>ТЕКУЩАЯ СЕССИЯ</span></div>${summary(gameState)}<div class="checkpoint-buttons"><button id="save-now" ${blocked || working ? "disabled" : ""}>Сохранить сейчас</button><button id="export-save" ${dayTransitionPending ? "disabled" : ""}>Скачать файл ${svg("arrow")}</button></div></section><section class="checkpoint"><div class="checkpoint-title"><h3>Резервная копия</h3><span>ПРЕДЫДУЩАЯ ЗАПИСЬ</span></div>${backup ? summary(backup) : '<p class="checkpoint-empty">Появится после следующего изменения прогресса.</p>'}<button id="restore-backup" ${!backup || working ? "disabled" : ""}>Восстановить эту версию ${svg("arrow")}</button></section><div class="vault-import"><label for="save-file">Продолжить игру из файла</label><p>Поддерживается экспорт игры в JSON. Сначала проверим файл и покажем, что в нём.</p><input id="save-file" type="file" accept=".json,application/json" ${working ? "disabled" : ""}></div><div id="import-preview"></div>${working ? '<p class="vault-footnote">Закончите текущее действие, чтобы восстановить или заменить сохранение.</p>' : ""}${get(DAMAGED) ? '<button id="download-damaged" class="vault-text-button">Скачать исходную повреждённую запись</button>' : ""}${blocked ? '<button id="start-fresh" class="vault-text-button">Начать заново, оставив повреждённую запись в архиве</button>' : ""}<p class="vault-footnote">Файл содержит игровой прогресс. Личные записи дневника скачиваются отдельно из дневника.</p></div>`;
    vault
      .querySelector("[data-vault-close]")
      ?.addEventListener("click", () => vault.close());
    $("save-now").onclick = () => {
      saveGame();
      renderVault();
    };
    $("export-save").onclick = () => {
      try {
        saveHaggleProgress();
        download(
          schema.serialize(gameState),
          "torg-day-" + gameState.day + ".json",
        );
        $("vault-status").textContent =
          "Файл подготовлен. Сохраните его в надёжном месте.";
      } catch (e) {
        $("vault-status").textContent = e.message;
      }
    };
    if ($("download-damaged"))
      $("download-damaged").onclick = () =>
        download(
          get(DAMAGED) || "",
          "torg-damaged.txt",
          "text/plain;charset=utf-8",
        );
    $("restore-backup").onclick = () => {
      if (backup) previewReplacement(backup, "Резервная копия");
    };
    $("save-file").onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        if (file.size > schema.MAX_BYTES)
          throw new Error("Файл слишком большой: максимум 10 МБ.");
        const state = schema.parse(await file.text(), { external: true });
        previewReplacement(state, "Проверенный файл");
      } catch (error) {
        $("import-preview").textContent =
          "Файл не изменил вашу игру. " + error.message;
        $("import-preview").className = "import-error";
      }
    };
    if ($("start-fresh"))
      $("start-fresh").onclick = () => {
        if (
          !confirm(
            "Начать новую игру? Повреждённый исходник останется в архиве.",
          )
        )
          return;
        try {
          localStorage.removeItem(KEY);
          blocked = false;
          replacing = true;
          location.reload();
        } catch (error) {
          $("vault-status").textContent = error.message;
        }
      };
  }
  function openVault() {
    renderVault();
    if (!vault.open) vault.showModal();
  }
  function previewReplacement(state, label) {
    const el = $("import-preview");
    el.className = "import-preview";
    el.innerHTML = `<h3>${esc(label)} готов к восстановлению</h3>${summary(state)}<p>Текущая игра будет заменена после подтверждения. Её исправная запись останется резервной копией.</p><div><button id="confirm-import" class="ux-primary">Заменить прогресс и открыть ${svg("arrow")}</button><button id="cancel-import">Отмена</button></div>`;
    $("cancel-import").onclick = () => {
      el.innerHTML = "";
      el.className = "";
    };
    $("confirm-import").onclick = () => {
      if (busy()) {
        $("vault-status").textContent = "Сначала завершите текущее действие.";
        return;
      }
      try {
        schema.validate(state);
        const previous = localStorage.getItem(KEY);
        if (previous && parseSafe(previous))
          localStorage.setItem(BACKUP, previous);
        localStorage.setItem(KEY, JSON.stringify(state));
        try {
          localStorage.removeItem("torg-ui-last-day-report");
        } catch {}
        blocked = false;
        replacing = true;
        location.reload();
      } catch (error) {
        $("vault-status").textContent =
          "Не удалось заменить прогресс. " + error.message;
      }
    };
  }
  // A reset is explicit, and preserves the last working game as a recovery point.
  resetGame = function () {
    if (busy()) {
      showNotification("Сначала завершите текущее действие.", "warning");
      return;
    }
    if (
      !confirm(
        "Начать новую игру? Текущий прогресс станет резервной копией. Дневник и название точки останутся.",
      )
    )
      return;
    try {
      if (!blocked) localStorage.setItem(BACKUP, JSON.stringify(gameState));
      localStorage.removeItem(KEY);
      localStorage.removeItem("torg-ui-last-day-report");
      replacing = true;
      location.reload();
    } catch (error) {
      notifyStatus("error", error.message);
      openVault();
    }
  };
  window.TorgContinuity = Object.freeze({
    openVault,
    getStatus: () => ({ status: saveStatus, blocked, lastError }),
  });

  // The morning report accounts for actual completed changes, not estimates.
  const report = document.createElement("dialog");
  report.id = "day-report";
  report.className = "ux-dialog day-report";
  report.setAttribute("aria-labelledby", "day-report-title");
  document.body.append(report);
  report.addEventListener("click", (e) => {
    if (e.target === report) report.close();
  });
  const reportButton = document.createElement("button");
  reportButton.id = "last-day-report";
  reportButton.className = "last-day-report";
  reportButton.innerHTML = "Расчёт за день " + svg("arrow");
  reportButton.hidden = true;
  document.querySelector(".studio-masthead").append(reportButton);
  let lastReport;
  try {
    lastReport = JSON.parse(get("torg-ui-last-day-report"));
    if (lastReport && lastReport.day === gameState.day)
      reportButton.hidden = false;
  } catch {}
  function openReport(data) {
    if (!data) return;
    const positive = (n) => (n > 0 ? "+" : "") + money(n);
    report.innerHTML = `<button class="dialog-close" data-report-close aria-label="Закрыть утренний выпуск">${svg("close")}</button><header class="report-masthead"><span>ЗАПИСЬ В РАСХОДНОЙ ТЕТРАДИ</span><span>ЕЖЕДНЕВНЫЙ ВЫПУСК</span></header><div class="report-headline"><div class="report-day"><small>ДЕНЬ</small><strong>${data.day}</strong></div><div><span class="eyebrow">АРЕНДА СПИСАНА</span><h2 id="day-report-title">Ещё один день.<br><em>Снова нужны деньги.</em></h2></div></div><div class="report-balance"><span>Осталось на руках <strong>${money(data.moneyAfter)}</strong></span><span class="report-net ${data.net < 0 ? "negative" : ""}">${positive(data.net)}</span></div><div class="report-grid"><section><h3>В кассовой книге</h3><dl><div><dt>До перехода</dt><dd>${money(data.moneyBefore)}</dd></div><div><dt>Аренда</dt><dd>−500 ₽</dd></div><div><dt>Продажи и другие изменения</dt><dd>${positive(data.other)}</dd></div></dl><p>Другие изменения включают выплаты, комиссии, возвраты и возможную продажу обстановки.</p></section><section><h3>Что изменилось</h3><ul><li><strong>${data.sold}</strong><span>завершённых продаж</span></li><li><strong>${data.offers}</strong><span>предложений покупателей сейчас</span></li><li><strong>${data.attention}</strong><span>внимания на новый день</span></li></ul></section></div><div class="report-footer"><p>На рынке ${data.marketCount} новых предложений.<br>Старые переговоры остались во вчерашнем дне.</p><button class="ux-primary" data-report-market>Открыть рынок ${svg("arrow")}</button><button class="ux-secondary" data-report-sales>К покупателям</button></div>`;
    report.querySelector("[data-report-close]").onclick = () => report.close();
    report.querySelector("[data-report-market]").onclick = () => {
      report.close();
      switchTab("market");
    };
    report.querySelector("[data-report-sales]").onclick = () => {
      report.close();
      switchTab("selling");
    };
    if (!report.open) report.showModal();
  }
  reportButton.onclick = () => openReport(lastReport);
  document.addEventListener("torg:day-complete", (event) => {
    const before = event.detail;
    lastReport = {
      day: gameState.day,
      moneyBefore: before.money,
      moneyAfter: gameState.money,
      net: gameState.money - before.money,
      other: gameState.money - before.money + 500,
      sold: gameState.stats.sold - before.sold,
      offers: gameState.sellingItems.reduce(
        (n, s) => n + (s.offers?.length || 0),
        0,
      ),
      attention: gameState.attention,
      marketCount: gameState.marketItems.length,
    };
    try {
      localStorage.setItem(
        "torg-ui-last-day-report",
        JSON.stringify(lastReport),
      );
    } catch {}
    reportButton.hidden = false;
    openReport(lastReport);
  });

  // Pending conversations are visible at a glance in the catalogue.
  const oldMarket = renderMarket;
  renderMarket = function () {
    oldMarket();
    document.querySelectorAll(".find-card").forEach((card) => {
      const id = card.querySelector("[data-preview]")?.dataset.preview;
      const item = gameState.marketItems.find((i) => i.id === id);
      if (!item?.haggleState) return;
      const badge = document.createElement("span");
      badge.className = "paused-badge";
      badge.textContent = "Переговоры на паузе";
      card.querySelector(".find-art").append(badge);
      const price = card.querySelector(".find-price");
      if (price) {
        price.querySelector("small").textContent = "Последнее предложение";
        price.querySelector("strong").textContent = money(
          item.haggleState.currentPrice,
        );
        price.querySelector(":scope > span").textContent =
          item.haggleState.currentPrice > gameState.money
            ? "Выше бюджета"
            : "Торг уместен";
      }
      card.querySelector(".find-open").innerHTML =
        "Вернуться к предложению " + svg("arrow");
    });
  };
  document.addEventListener("torg:preview", (event) => {
    const item = gameState.marketItems.find((i) => i.id === event.detail.id);
    if (!item?.haggleState) return;
    const info = document.createElement("div");
    info.className = "paused-context";
    info.innerHTML = `<strong>Вы уже говорили с этим продавцом</strong><p>Остановились на ${money(item.haggleState.currentPrice)}. Терпение: ${item.haggleState.patience}/${item.haggleState.maxPatience}. Использовано приёмов: ${item.haggleState.usedTactics.length}.</p>`;
    $("item-inspector").querySelector(".preview-info").prepend(info);
    $("item-inspector").querySelector("[data-start]").innerHTML =
      "Продолжить торг " + svg("arrow");
  });
  const help = document.createElement("section");
  help.className = "continuity-help";
  help.innerHTML =
    '<span class="eyebrow">ЧТО СТАЛО ЧЕСТНЕЕ</span><h3>Пауза — не потеря. Сохранение — не обещание.</h3><p>Цена, терпение и приёмы остаются при выходе из торга. Повторный вход по-прежнему стоит 5 внимания. Если продавец ушёл или вещь забрал конкурент, вернуть её нельзя. Новый день обновляет рынок.</p><p>Покупка сохраняется сразу, до финальной реплики. Пустой рынок не пополняется при перезагрузке. Состояние сохранения видно в шапке; файл и резервная копия — в сейфе.</p>';
  $("content-help").prepend(help);
  window.addEventListener("load", () =>
    setTimeout(() => {
      booting = false;
      bootState = null;
      if (blocked) openVault();
      else {
        saveGame({ preserveBackup: true });
        if (recoveryMessage) showNotification(recoveryMessage, "warning");
      }
      try {
        const saved = JSON.parse(get("torg-ui-last-day-report"));
        if (saved && saved.day === gameState.day) {
          lastReport = saved;
          reportButton.hidden = false;
        }
      } catch {}
    }, 240),
  );
})();
