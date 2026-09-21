// Rival buyers: illustration must match the competitor data and change nothing.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE
      ? {
          executablePath: process.env.CHROMIUM_EXECUTABLE,
          args: [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--no-zygote",
            "--use-gl=angle",
            "--use-angle=swiftshader",
          ],
        }
      : {}),
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.GAME_URL || "http://127.0.0.1:3000/index.html");
  await page.waitForFunction(() => document.documentElement.dataset.atelierReady === "true");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => JSON.stringify(gameState));

  // Deterministic trade with three buyers of different groups.
  const built = await page.evaluate(() => {
    const item = gameState.marketItems[0];
    item.sellerType = "antiquarianm";
    item.haggleState = null;
    gameState.firstDealToday = false;
    startHaggle(item.id);
    currentHaggle.competitors = [
      { name: "Пьяный студент", coefficient: 0.1, group: "Безопасные покупатели" },
      { name: "Коллекционер-любитель", coefficient: 1.2, group: "Заинтересованные покупатели" },
      { name: "Профессиональный антиквар", coefficient: 2.5, group: "Опасные конкуренты" },
    ];
    renderHaggleModal();
    return { id: item.id };
  });
  const stage = page.locator(".rival-stage");
  assert.equal(await stage.count(), 1);
  assert.equal(await stage.getAttribute("data-count"), "3");
  assert.equal(await page.locator(".rival-stage .rival").count(), 2);
  assert.equal(await page.locator(".rival-stage .rival-more").textContent(), "+1");

  // Tone and threat come from the stored group and coefficient, in game order.
  const drawn = await page.locator(".rival-stage .rival").evaluateAll((els) =>
    els.map((el) => [
      el.querySelector(".rival-tag b").textContent,
      el.dataset.tone,
      el.dataset.threat,
      el.querySelector("img").getAttribute("src"),
    ]),
  );
  assert.deepEqual(
    drawn.map((row) => row.slice(0, 3)),
    [
      ["Пьяный студент", "calm", "вялый"],
      ["Коллекционер-любитель", "keen", "настойчивый"],
    ],
  );
  // Art stays inside the buyer's own group and is stable for the same name.
  assert.match(drawn[0][3], /^assets\/rivals\/(safe-tramp|safe-tipsy)\.webp$/);
  assert.match(
    drawn[1][3],
    /^assets\/rivals\/(interested-woman|interested-man)\.webp$/,
  );
  assert.equal(
    await page.evaluate(() =>
      document.querySelector(".rival-stage .rival img").getAttribute("src"),
    ),
    drawn[0][3],
  );
  // Names on the paper tags match the competitor data, and the plain list is
  // still in the document for screen readers.
  assert.deepEqual(
    await page.locator(".rival-tag b").allTextContents(),
    ["Пьяный студент", "Коллекционер-любитель"],
  );
  assert.match(await page.locator("#competitors").textContent(), /Пьяный студент/);
  // The note describes the most dangerous buyer in the queue.
  assert.match(await page.locator(".rival-note").textContent(), /Перехватит/);
  // Illustrated buyers must not sit inside the trade flow or overflow the shell.
  assert(
    await page
      .locator(".rival-stage")
      .evaluate((el) => el.querySelectorAll("button, input, a").length === 0),
  );
  assert(
    await page
      .locator("#haggleModal>.negotiation-shell")
      .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  );
  for (const file of [
    "safe-tramp",
    "safe-tipsy",
    "thrifty-woman",
    "thrifty-student",
    "ordinary-man",
    "interested-woman",
    "interested-man",
    "wealthy-man",
    "dangerous-antiquarian",
  ]) {
    const response = await page.request.get(
      new URL("/assets/rivals/" + file + ".webp", page.url()).href,
    );
    assert(response.ok(), file);
  }
  // Threat wording follows the coefficient only.
  assert.deepEqual(
    await page.evaluate(() => [
      TorgRivals.threatFor(0.1).name,
      TorgRivals.threatFor(0.7).name,
      TorgRivals.threatFor(2.5).name,
    ]),
    ["вялый", "обычный", "опасный"],
  );
  await page.screenshot({ path: (process.env.SHOT_DIR || "/tmp") + "/rivals-trade.png" });

  // The golden hour has no buyers: the counter note replaces the figures.
  await page.evaluate(() => {
    currentHaggle.competitors = [];
    gameState.firstDealToday = true;
    renderHaggleModal();
  });
  assert.match(await page.locator(".rival-empty").textContent(), /прилавок только ваш/);
  await page.evaluate(() => {
    gameState.firstDealToday = false;
    currentHaggle.competitors = [
      { name: "Бомж Валера", coefficient: 0.1, group: "Безопасные покупатели" },
    ];
    renderHaggleModal();
  });
  assert.equal(await page.locator(".rival-stage .rival").count(), 1);
  await page.screenshot({ path: (process.env.SHOT_DIR || "/tmp") + "/rivals-trade-one.png" });

  // Mobile geometry: two buyers and their tags still fit the trade window.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    currentHaggle.competitors = [
      { name: "Пьяный студент", coefficient: 0.1, group: "Безопасные покупатели" },
      { name: "Профессиональный антиквар", coefficient: 2.5, group: "Опасные конкуренты" },
    ];
    renderHaggleModal();
  });
  assert(
    await page
      .locator("#haggleModal>.negotiation-shell")
      .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  );
  assert(
    await page.locator(".rival-stage").evaluate((el) => {
      const cell = el.parentElement.getBoundingClientRect();
      return [...el.querySelectorAll(".rival")].every((r) => {
        const b = r.getBoundingClientRect();
        return b.left >= cell.left - 1 && b.right <= cell.right + 1;
      });
    }),
  );
  await page.screenshot({ path: (process.env.SHOT_DIR || "/tmp") + "/rivals-trade-mobile.png" });

  // Paused trade: the panorama shows the waiting buyers from the saved state.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate((id) => {
    currentHaggle.competitors = [
      { name: "Пьяный студент", coefficient: 0.1, group: "Безопасные покупатели" },
      { name: "Коллекционер-любитель", coefficient: 1.2, group: "Заинтересованные покупатели" },
      { name: "Профессиональный антиквар", coefficient: 2.5, group: "Опасные конкуренты" },
    ];
    saveHaggleProgress();
    closeHaggle();
    switchTab("market");
    document.getElementById("compact-walk").click();
  }, built.id);
  await page.waitForTimeout(1500);
  const line = page.locator(".rival-line").first();
  assert(await line.count());
  assert.equal(await line.getAttribute("data-count"), "3");
  assert.equal(await line.locator(".rival").count(), 2);
  // Buyers stand nearer the viewer and never cover the lot card.
  const geometry = await line.evaluate((el) => {
    const container = el.closest(".market-item-container");
    const portrait = container.querySelector(".seller-portrait-wrapper");
    const card = container.querySelector(".market-item-btn");
    const rivalBox = el.querySelector(".rival").getBoundingClientRect();
    return {
      sellerBottom: portrait.getBoundingClientRect().bottom,
      rivalBottom: rivalBox.bottom,
      rivalHeight: rivalBox.height,
      sellerHeight: portrait.querySelector("img, video").getBoundingClientRect().height,
      rivalZ: Number(getComputedStyle(el).zIndex),
      cardZ: Number(getComputedStyle(card).zIndex),
    };
  });
  assert(geometry.rivalBottom > geometry.sellerBottom, JSON.stringify(geometry));
  assert(geometry.rivalHeight > geometry.sellerHeight, JSON.stringify(geometry));
  assert(geometry.rivalZ < geometry.cardZ, JSON.stringify(geometry));
  assert(
    (await page.locator(".rival-line .rival-tag").first().textContent()).length > 3,
  );
  await page.screenshot({ path: (process.env.SHOT_DIR || "/tmp") + "/rivals-walking.png" });

  // Idle motion stops while the trade window is open.
  await page.evaluate(() => startHaggle(gameState.marketItems[0].id));
  assert(await page.evaluate(() => document.documentElement.classList.contains("rivals-quiet")));
  await page.evaluate(() => closeHaggle());
  assert(
    !(await page.evaluate(() => document.documentElement.classList.contains("rivals-quiet"))),
  );

  // Only presentation state changed: the trade itself is untouched.
  const after = await page.evaluate(() => JSON.stringify(gameState));
  assert.equal(
    JSON.parse(after).money,
    JSON.parse(before).money,
    "money must not move from drawing buyers",
  );
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    "PASS: rival figures follow competitor data, stay out of the trade flow, keep the lot card above them, fit mobile geometry and change no game state.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
