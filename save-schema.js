/* Pure save-file boundary, shared by the browser and node tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TorgSaveSchema = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const MAX_BYTES = 10 * 1024 * 1024;
  const categories = ["porcelain", "metal", "painting", "books", "militaria"];
  const object = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value);
  const fail = (message) => {
    throw new Error(message);
  };
  function finite(
    value,
    label,
    min = -Number.MAX_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
  ) {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < min ||
      value > max
    )
      fail("Некорректное поле: " + label);
  }
  function validate(state, { external = false } = {}) {
    if (!object(state)) fail("В файле нет игрового состояния.");
    finite(state.money, "деньги");
    finite(state.reputation, "репутация");
    finite(state.day, "день", 1, 1e7);
    if (!Number.isInteger(state.day)) fail("День должен быть целым числом.");
    if (state.attention !== undefined)
      finite(state.attention, "внимание", 0, 10000);
    if (
      state.officeLevel !== undefined &&
      ![-2, -1, 0, 1, 2].includes(state.officeLevel)
    )
      fail("Неизвестный уровень кабинета.");
    let nodes = 0;
    function walk(value, depth = 0) {
      if (++nodes > 250000 || depth > 35)
        fail("Слишком сложная структура сохранения.");
      if (typeof value === "number" && !Number.isFinite(value))
        fail("В сохранении есть некорректное число.");
      if (typeof value === "string") {
        if (value.length > 100000) fail("Слишком длинное текстовое поле.");
        // Legacy renderers use innerHTML. Save files are data, not executable markup.
        if (external && value.includes("<"))
          fail(
            "Импорт отклонён: HTML-разметка в игровом сохранении недопустима.",
          );
      }
      if (Array.isArray(value)) {
        if (value.length > 20000) fail("Слишком длинный список.");
        value.forEach((v) => walk(v, depth + 1));
      } else if (object(value))
        for (const [key, entry] of Object.entries(value)) {
          if (
            [
              "__proto__",
              "prototype",
              "constructor",
              "hasOwnProperty",
            ].includes(key)
          )
            fail("Недопустимый ключ в сохранении.");
          if (
            key === "id" &&
            (typeof entry !== "string" || !/^[a-zA-Z0-9_-]{1,160}$/.test(entry))
          )
            fail("Некорректный идентификатор.");
          walk(entry, depth + 1);
        }
    }
    walk(state);
    for (const key of ["stats", "skills", "expertiseExperience"])
      if (state[key] !== undefined) {
        if (!object(state[key])) fail("Некорректный раздел: " + key);
        for (const [name, value] of Object.entries(state[key]))
          finite(value, key + "." + name);
      }
    for (const key of [
      "inventory",
      "marketItems",
      "sellingItems",
      "dealsLog",
      "unlockedTactics",
    ])
      if (state[key] !== undefined && !Array.isArray(state[key]))
        fail("Ожидался список: " + key);
    const ids = new Set();
    for (const key of ["inventory", "marketItems", "sellingItems"])
      for (const item of state[key] || []) {
        if (
          !object(item) ||
          typeof item.id !== "string" ||
          ids.has(item.id) ||
          !categories.includes(item.category) ||
          typeof item.baseName !== "string"
        )
          fail("Некорректный или повторяющийся предмет.");
        ids.add(item.id);
        for (const list of [
          "defects",
          "marks",
          "modifiers",
          "modifiersDisplay",
          "expertiseShards",
          "goldenShards",
        ])
          if (item[list] !== undefined && !Array.isArray(item[list]))
            fail("Некорректные сведения о предмете: " + list);
        for (const list of ["modifiers", "modifiersDisplay"])
          for (const entry of item[list] || [])
            if (typeof entry !== "string" && !object(entry))
              fail("Некорректное название предмета.");
        if (!Array.isArray(item.defects) || !Array.isArray(item.marks))
          fail("Отсутствуют сведения о состоянии предмета.");
        for (const price of [
          "askingPrice",
          "realValue",
          "purchasePrice",
          "playerPrice",
          "currentBid",
          "estimatedValue",
          "estimatedAge",
          "age",
        ])
          if (item[price] !== undefined) finite(item[price], price);
        if (key === "marketItems") {
          finite(item.askingPrice, "цена продавца", 1);
          if (
            !object(item.sellerPortrait) ||
            !object(item.sellerQuotes) ||
            typeof item.sellerType !== "string"
          )
            fail("Отсутствуют сведения о продавце.");
          finite(item.sellerPortrait.patience, "терпение", 1, 100);
          if (!Number.isInteger(item.sellerPortrait.patience))
            fail("Некорректное терпение продавца.");
        }
        if (item.haggleState !== undefined) {
          const h = item.haggleState;
          if (
            !object(h) ||
            !Array.isArray(h.usedTactics) ||
            !Array.isArray(h.competitors) ||
            typeof h.currentQuote !== "string"
          )
            fail("Некорректная пауза переговоров.");
          finite(h.currentPrice, "согласованная цена", 1);
          finite(h.maxPatience, "максимальное терпение", 1, 100);
          finite(h.patience, "терпение на паузе", 0, h.maxPatience);
          if (!Number.isInteger(h.patience) || !Number.isInteger(h.maxPatience))
            fail("Некорректное терпение на паузе.");
        }
      }
    for (const deal of state.dealsLog || [])
      if (!object(deal) || !Array.isArray(deal.defects))
        fail("Некорректная история сделок.");
    return state;
  }
  function parse(text, options = {}) {
    if (typeof text !== "string" || text.length > MAX_BYTES)
      fail("Файл слишком большой (максимум 10 МБ).");
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      fail(
        "Не удалось прочитать JSON. Файл повреждён или имеет другой формат.",
      );
    }
    if (object(data) && data.format === "torg-umesten-save") {
      if (data.version !== 1) fail("Эта версия файла пока не поддерживается.");
      data = data.state;
    }
    return validate(data, options);
  }
  const serialize = (state) =>
    JSON.stringify(
      {
        format: "torg-umesten-save",
        version: 1,
        exportedAt: new Date().toISOString(),
        state: validate(state),
      },
      null,
      2,
    );
  return Object.freeze({ MAX_BYTES, validate, parse, serialize });
});
