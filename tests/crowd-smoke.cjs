// Smoke-тест толпы конкурентов в сцене торга.
// Запуск: node tests/crowd-smoke.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const ROOT = path.join(__dirname, "..");

(async () => {
  const dom = await JSDOM.fromFile(path.join(ROOT, "index.html"), {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse(window) {
      // Минимальные полифиллы окружения без браузера.
      window.IntersectionObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
      window.ResizeObserver = class {
        observe() {}
        disconnect() {}
      };
      window.Element.prototype.scrollIntoView = () => {};
      window.URL.createObjectURL = () => "blob:jsdom";
      // file:// даёт opaque origin: подменяем localStorage in-memory хранилищем.
      const store = new Map();
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: (k) => (store.has(k) ? store.get(k) : null),
          setItem: (k, v) => store.set(String(k), String(v)),
          removeItem: (k) => store.delete(k),
          clear: () => store.clear(),
          key: (i) => [...store.keys()][i] ?? null,
          get length() { return store.size; },
        },
      });
      if (!window.matchMedia) {
        window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
      }
    },
  });
  const window = dom.window;
  const doc = window.document;
  const errors = [];
  window.addEventListener("error", (e) => errors.push(e.message));
  await new Promise((resolve) => {
    if (doc.readyState === "complete") resolve();
    else window.addEventListener("load", resolve);
  });
  await new Promise((resolve) => setTimeout(resolve, 400));

  const fatal = errors.filter((m) => !/Could not load|css/i.test(m));
  assert.equal(fatal.length, 0, "ошибки страницы: " + fatal.join(" | "));

  // let/const верхнего уровня не лежат на window — читаем через eval.
  const groups = window.eval("competitorGroups");

  // Все арты конкурентов существуют на диске (по 4 фигуры на группу).
  for (const g of groups) {
    assert.ok(Array.isArray(g.arts) && g.arts.length >= 4, "у группы «" + g.name + "» нет набора arts");
    for (const a of g.arts) {
      assert.ok(
        fs.existsSync(path.join(ROOT, "competitor_portraits", a.file)),
        "файл арта не найден: " + a.file,
      );
    }
  }

  // Готовим рынок и входим в торг с конкурентами.
  // generateMarket() открывает «золотой час» (firstDealToday=true),
  // поэтому флаг сбрасываем ПОСЛЕ генерации рынка.
  window.generateMarket();
  window.eval("gameState.firstDealToday = false");
  const itemCount = window.eval("gameState.marketItems.length");
  assert.ok(itemCount > 0, "рынок пуст");
  const itemId = window.eval("gameState.marketItems[0].id");
  window.startHaggle(itemId);

  const h = window.eval("currentHaggle");
  assert.ok(h, "торг не открылся");
  assert.ok(!doc.getElementById("haggleModal").classList.contains("hidden"), "модалка скрыта");

  const layer = doc.querySelector("#haggleModal .crowd-layer");
  assert.ok(layer, "слой толпы не создан");
  assert.ok(layer.closest(".seller-conversation"), "толпа вне сцены продавца");

  const figures = [...layer.querySelectorAll(".crowd-figure")];
  assert.equal(
    figures.length,
    Math.min(3, h.competitors.length),
    "число фигур не совпадает с числом конкурентов",
  );

  // Каждая фигура ссылается на арт своей группы и несёт уровень угрозы.
  figures.forEach((fig, i) => {
    const comp = h.competitors[i];
    const group = groups.find((g) => g.name === comp.group);
    const img = fig.querySelector("img");
    assert.ok(img, "у фигуры нет изображения");
    const files = group.arts.map((a) => a.file);
    assert.ok(
      files.some((f) => img.getAttribute("src").endsWith(f)),
      "арт фигуры не из набора группы: " + comp.name,
    );
    const tier = comp.coefficient >= 1.8 ? "high" : comp.coefficient >= 0.7 ? "mid" : "low";
    assert.ok(fig.classList.contains("tier-" + tier), "неверный ярус угрозы у " + comp.name);
    assert.ok(fig.querySelector(".crowd-tag").textContent.includes(comp.name), "бирка без имени");
  });

  // Текстовый список получил точки угрозы.
  const dots = doc.querySelectorAll("#competitors .crowd-dot");
  assert.equal(dots.length, h.competitors.length, "точки угрозы не совпадают со списком");

  // Перехват: фигура делает шаг вперёд.
  if (h.competitors.length) {
    h.interceptedBy = h.competitors[0].name;
    window.renderHaggleCrowd();
    const figs2 = [...layer.querySelectorAll(".crowd-figure")];
    assert.ok(figs2[0].classList.contains("intercepting"), "перехватчик не подсвечен");
  }

  // Именное соответствие: знаковое имя получает свою фигуру.
  h.competitors = [{ name: "Пьяный моряк", group: "Безопасные покупатели", coefficient: 0.1 }];
  window.renderHaggleCrowd();
  const sailor = layer.querySelector(".crowd-figure img");
  assert.ok(
    sailor && sailor.getAttribute("src").endsWith("crowd-safe-sailor.png"),
    "именное соответствие не сработало для «Пьяный моряк»",
  );

  // Толпа без конкурентов (золотой час) — слой пуст.
  h.competitors = [];
  window.renderHaggleCrowd();
  assert.equal(layer.querySelectorAll(".crowd-figure").length, 0, "слой не очистился");

  console.log("crowd smoke: OK, фигур при открытии торга:", figures.length);
  window.close();
  process.exit(0);
})().catch((err) => {
  console.error("crowd smoke: FAIL");
  console.error(err);
  process.exit(1);
});
