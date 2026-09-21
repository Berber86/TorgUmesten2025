/* Edition V. Public transaction records only; filters never mutate game state. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const { escape: esc, money, svg } = TorgUI;
  const result = (d) => d.salePrice - d.purchasePrice - (d.expertiseCost || 0);
  const signed = (n) => (n > 0 ? "+" : "") + money(n);
  let page = 0;
  const size = 12;
  const section = document.createElement("section");
  section.id = "deal-ledger";
  section.innerHTML = `<header class="ledger-cover"><div><span class="eyebrow">ПРИХОД / РАСХОД</span><h2>Деньги любят счёт.<br><em>Особенно последние.</em></h2><p>Не только сколько вы продали.<br>Но и что осталось после покупки и экспертизы.</p></div><div class="ledger-seal" aria-hidden="true">ТУ<span>РАСХОДНАЯ ТЕТРАДЬ</span></div></header><div class="ledger-tools"><label>Найти предмет<input id="ledger-search" type="search" placeholder="Название из истории…" maxlength="200"></label><label>Способ продажи<select id="ledger-channel"><option value="">Все способы</option><option>Авито</option><option>Аукцион</option><option>Комиссионка</option><option>Постоянный клиент</option></select></label><label>Результат<select id="ledger-result"><option value="">Все результаты</option><option value="positive">Положительный</option><option value="negative">Отрицательный</option><option value="zero">Без разницы</option></select></label><label>Порядок<select id="ledger-sort"><option value="recent">Сначала последние</option><option value="best">Выше результат</option><option value="worst">Ниже результат</option></select></label></div><div id="ledger-summary" class="ledger-summary" aria-live="polite"></div><p class="ledger-accounting">Результат сделки = получено − покупка − записанная стоимость экспертизы. Это не чистая прибыль за всё время: аренда, реставрация и отдельные сборы здесь не учтены. Выплата аукциона уже за вычетом его комиссии.</p><div class="ledger-list-head"><span>ЗАВЕРШЁННЫЕ СДЕЛКИ</span><button id="ledger-export">Скачать выборку CSV ${svg("arrow")}</button></div><div id="ledger-list"></div><footer class="ledger-pagination"><button id="ledger-prev" aria-label="Предыдущая страница">← Назад</button><span id="ledger-page" role="status"></span><button id="ledger-next" aria-label="Следующая страница">Далее →</button></footer>`;
  $("stat-profit").previousElementSibling.textContent = "Результат сделок";
  const oldTable = $("dealsLog").closest(".overflow-x-auto");
  oldTable.hidden = true;
  oldTable.previousElementSibling.hidden = true;
  oldTable.previousElementSibling.previousElementSibling.hidden = true;
  oldTable.after(section);
  const modal = document.createElement("dialog");
  modal.id = "ledger-detail";
  modal.className = "ux-dialog ledger-detail";
  modal.setAttribute("aria-labelledby", "ledger-detail-title");
  document.body.append(modal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
  function rows() {
    const query = $("ledger-search").value.trim().toLocaleLowerCase("ru");
    const channel = $("ledger-channel").value,
      outcome = $("ledger-result").value;
    const filtered = gameState.dealsLog
      .map((deal, index) => ({ deal, index }))
      .filter(
        ({ deal: d }) =>
          (!query ||
            String(d.displayName || "")
              .toLocaleLowerCase("ru")
              .includes(query)) &&
          (!channel || d.channel === channel) &&
          (!outcome ||
            (outcome === "positive"
              ? result(d) > 0
              : outcome === "negative"
                ? result(d) < 0
                : result(d) === 0)),
      );
    const sort = $("ledger-sort").value;
    return filtered.sort(
      (a, b) =>
        (sort === "best"
          ? result(b.deal) - result(a.deal)
          : sort === "worst"
            ? result(a.deal) - result(b.deal)
            : 0) || b.index - a.index,
    );
  }
  function render() {
    const list = rows();
    page = Math.min(page, Math.max(0, Math.ceil(list.length / size) - 1));
    const received = list.reduce((s, { deal: d }) => s + d.salePrice, 0),
      spent = list.reduce(
        (s, { deal: d }) => s + d.purchasePrice + (d.expertiseCost || 0),
        0,
      );
    $("ledger-summary").innerHTML =
      `<span><small>Сделок в выборке</small><strong>${list.length}</strong></span><span><small>Получено</small><strong>${money(received)}</strong></span><span><small>Покупка и экспертиза</small><strong>${money(spent)}</strong></span><span class="${received - spent < 0 ? "is-loss" : ""}"><small>Результат сделок</small><strong>${signed(received - spent)}</strong></span>`;
    $("ledger-list").innerHTML = list.length
      ? list
          .slice(page * size, (page + 1) * size)
          .map(
            ({ deal: d, index }) =>
              `<button class="ledger-row" data-deal="${index}"><span class="ledger-number">${String(index + 1).padStart(3, "0")}</span><span class="ledger-name"><strong>${esc(d.displayName || "Предмет без названия")}</strong><small>${esc(d.channel)} · ${Number.isInteger(d.day) ? "День " + d.day : "День не записан"}</small></span><span class="ledger-received"><small>Получено</small>${money(d.salePrice)}</span><span class="ledger-result ${result(d) < 0 ? "is-loss" : ""}"><small>Результат</small>${signed(result(d))}</span><span class="ledger-arrow">↗</span></button>`,
          )
          .join("")
      : `<div class="ledger-empty"><span>—</span><h3>${gameState.dealsLog.length ? "Ничего не найдено." : "Продаж ещё не было."}</h3><p>${gameState.dealsLog.length ? "Попробуйте другое название или сбросьте фильтры." : "Завершённая продажа появится здесь. Ожидаемые выплаты не считаются доходом."}</p><button id="ledger-empty-action">${gameState.dealsLog.length ? "Сбросить фильтры" : "Открыть коллекцию"} →</button></div>`;
    $("ledger-empty-action")?.addEventListener("click", () => {
      if (!gameState.dealsLog.length) {
        switchTab("inventory");
        return;
      }
      $("ledger-search").value = "";
      $("ledger-channel").value = "";
      $("ledger-result").value = "";
      page = 0;
      render();
    });
    $("ledger-page").textContent = list.length
      ? `${page + 1} / ${Math.ceil(list.length / size)}`
      : "0 сделок";
    $("ledger-prev").disabled = page === 0;
    $("ledger-next").disabled = (page + 1) * size >= list.length;
    $("ledger-export").disabled = !list.length;
  }
  function detail(index) {
    const d = gameState.dealsLog[index];
    if (!d) return;
    modal.innerHTML = `<button class="dialog-close" data-close aria-label="Закрыть сделку">${svg("close")}</button><div class="eyebrow">ЗАПИСЬ № ${String(index + 1).padStart(3, "0")} / ${esc(d.channel)}</div><h2 id="ledger-detail-title">${esc(d.displayName || "Предмет без названия")}</h2><p class="ledger-date">${Number.isInteger(d.day) ? "Завершено в день " + d.day : "Для этой старой записи день продажи неизвестен."}</p><dl><div><dt>Получено от продажи</dt><dd>${money(d.salePrice)}</dd></div><div><dt>Заплачено за предмет</dt><dd>−${money(d.purchasePrice)}</dd></div><div><dt>Записанная экспертиза</dt><dd>−${money(d.expertiseCost || 0)}</dd></div><div class="ledger-total"><dt>Результат сделки</dt><dd class="${result(d) < 0 ? "is-loss" : ""}">${signed(result(d))}</dd></div></dl><p class="ledger-accounting">${d.channel === "Аукцион" ? "Выплата уже за вычетом комиссии аукциона. " : ""}Аренда, реставрация и отдельные сборы не входят в этот расчёт. Скрытая ценность предмета не используется.</p><button class="ux-primary" data-close>Вернуться к книге ${svg("arrow")}</button>`;
    modal
      .querySelectorAll("[data-close]")
      .forEach((b) => (b.onclick = () => modal.close()));
    modal.showModal();
  }
  $("ledger-list").addEventListener("click", (e) => {
    const button = e.target.closest("[data-deal]");
    if (button) detail(Number(button.dataset.deal));
  });
  $("ledger-search").oninput = () => {
    page = 0;
    render();
  };
  ["ledger-channel", "ledger-result", "ledger-sort"].forEach(
    (id) =>
      ($(id).onchange = () => {
        page = 0;
        render();
      }),
  );
  $("ledger-prev").onclick = () => {
    page--;
    render();
  };
  $("ledger-next").onclick = () => {
    page++;
    render();
  };
  const cell = (value) => {
    let s = String(value ?? "");
    if (/^[\s]*[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  $("ledger-export").onclick = () => {
    const data = [
      [
        "Номер",
        "Предмет",
        "День",
        "Канал",
        "Получено",
        "Покупка",
        "Экспертиза",
        "Результат без аренды, реставрации и отдельных сборов",
      ],
      ...rows().map(({ deal: d, index }) => [
        index + 1,
        d.displayName,
        d.day ?? "",
        d.channel,
        d.salePrice,
        d.purchasePrice,
        d.expertiseCost || 0,
        result(d),
      ]),
    ];
    const text =
      "\uFEFF" +
      data
        .map((row) =>
          row
            .map((v) => (typeof v === "number" ? String(v) : cell(v)))
            .join(";"),
        )
        .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "torg-deals-day-" + gameState.day + ".csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const originalStats = renderStats;
  renderStats = function () {
    originalStats();
    render();
  };

  const inbox = document.createElement("section");
  inbox.className = "sales-inbox";
  inbox.innerHTML = `<div><span class="eyebrow">ВХОДЯЩИЕ / ПОКУПАТЕЛИ</span><h2>Кому ответить сегодня?</h2><p id="inbox-message" role="status"></p></div><div class="inbox-actions"><label><input id="inbox-only" type="checkbox"> Только с предложениями</label><button id="inbox-first">К первому предложению ${svg("arrow")}</button></div>`;
  document.querySelector(".sales-summary").after(inbox);
  function inboxRender() {
    const sales = gameState.sellingItems,
      offered = sales.filter((s) => s.offers?.length);
    $("inbox-message").textContent = offered.length
      ? `${offered.length} лотов ждут вашего решения. Предложение — ещё не продажа.`
      : "Новых предложений пока нет. Проверьте после смены дня.";
    $("inbox-first").disabled = !offered.length;
    [...$("sellingItems").children].forEach((card, i) => {
      const sale = sales[i];
      if (!sale) return;
      card.dataset.saleId = sale.id;
      card.hidden = $("inbox-only").checked && !sale.offers?.length;
    });
    let empty = $("inbox-empty");
    if (!empty) {
      empty = document.createElement("p");
      empty.id = "inbox-empty";
      empty.textContent =
        "Нет лотов с предложениями. Отключите фильтр, чтобы увидеть остальные продажи.";
      $("sellingItems").after(empty);
    }
    empty.hidden =
      !$("inbox-only").checked || offered.length > 0 || !sales.length;
  }
  const originalSelling = renderSellingTab;
  renderSellingTab = function () {
    originalSelling();
    inboxRender();
  };
  $("inbox-only").onchange = inboxRender;
  $("inbox-first").onclick = () => {
    const first = [...$("sellingItems").children].find(
      (card) =>
        gameState.sellingItems.find((s) => s.id === card.dataset.saleId)?.offers
          ?.length,
    );
    if (!first) return;
    first.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
    first.tabIndex = -1;
    first.focus({ preventScroll: true });
  };
  window.addEventListener("load", () => {
    render();
    inboxRender();
  });
})();
