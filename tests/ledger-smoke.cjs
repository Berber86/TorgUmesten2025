const assert = require("node:assert/strict");
const fs = require("node:fs");
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
  const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.GAME_URL || "http://127.0.0.1:3000");
  await page.waitForFunction(
    () => document.documentElement.dataset.atelierReady === "true",
  );
  await page.waitForTimeout(400);
  await page.evaluate(() => switchTab("stats"));
  assert(await page.locator(".ledger-empty").isVisible());
  const before = await page.evaluate(() => {
    gameState.dealsLog = Array.from({ length: 27 }, (_, i) => ({
      displayName:
        i === 0
          ? '=HYPERLINK("x")'
          : i === 1
            ? "<img src=x onerror=alert(1)>"
            : "Чашка " + i,
      trueName: "SECRET TRUE NAME",
      realValue: 999999,
      day: i === 0 ? undefined : i + 1,
      channel: i % 2 ? "Авито" : "Аукцион",
      purchasePrice: 1000,
      expertiseCost: 100,
      salePrice: i % 3 ? 1800 : 500,
      defects: [],
    }));
    renderStats();
    return JSON.stringify(gameState);
  });
  assert.equal(await page.locator(".ledger-row").count(), 12);
  await page.locator("#ledger-next").click();
  assert.equal(await page.locator("#ledger-page").textContent(), "2 / 3");
  await page.locator("#ledger-search").fill("Чашка 26");
  assert.equal(await page.locator(".ledger-row").count(), 1);
  await page.locator(".ledger-row").click();
  assert(
    !(await page
      .locator("#ledger-detail")
      .textContent()
      .then((s) => s.includes("SECRET"))),
  );
  await page.keyboard.press("Escape");
  await page.locator("#ledger-search").fill("nothing");
  assert(await page.locator(".ledger-empty").isVisible());
  await page.locator("#ledger-empty-action").click();
  await page.locator("#ledger-channel").selectOption("Авито");
  assert.equal(await page.locator(".ledger-row").count(), 12);
  assert.equal(
    await page.locator("#ledger-summary strong").first().textContent(),
    "13",
  );
  await page.locator("#ledger-channel").selectOption("");
  await page.locator("#ledger-result").selectOption("negative");
  assert.equal(await page.locator(".ledger-row").count(), 9);
  await page.locator("#ledger-result").selectOption("");
  await page.locator("#ledger-sort").selectOption("worst");
  const download = page.waitForEvent("download");
  await page.locator("#ledger-export").click();
  const file = await download;
  const csv = fs.readFileSync(await file.path(), "utf8");
  assert(csv.includes("'="));
  assert(!csv.includes("SECRET"));
  assert.equal(csv.split("\r\n").length, 28);
  assert.equal(await page.evaluate(() => JSON.stringify(gameState)), before);
  await page.locator("#ledger-search").fill("<img");
  assert.equal(await page.locator("#ledger-list img").count(), 0);
  await page.locator(".ledger-row").click();
  assert.equal(await page.locator("#ledger-detail img").count(), 0);
  await page.keyboard.press("Escape");
  await page.locator("#ledger-search").fill("");
  for (const width of [360, 390, 700, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
  }
  await page.screenshot({
    path: (process.env.SHOT_DIR || "/tmp") + "/ledger-desktop.png",
    fullPage: true,
  });
  const salesBefore = await page.evaluate(() => {
    const item = JSON.parse(JSON.stringify(gameState.marketItems[0]));
    gameState.sellingItems = [
      {
        ...item,
        id: "sale_one",
        channel: "avito",
        daysLeft: 5,
        totalDays: 15,
        playerPrice: 3000,
        offers: [{ price: 2300, percent: 77 }],
      },
      {
        ...item,
        id: "sale_two",
        channel: "avito",
        daysLeft: 4,
        totalDays: 15,
        playerPrice: 4000,
        offers: [],
      },
    ];
    switchTab("selling");
    return JSON.stringify(gameState);
  });
  await page.locator("#inbox-only").check();
  assert.equal(await page.locator("#sellingItems > :visible").count(), 1);
  await page.locator("#inbox-first").click();
  assert(
    await page
      .locator("#sellingItems > :visible")
      .evaluate((el) => el === document.activeElement),
  );
  assert.equal(
    await page.evaluate(() => JSON.stringify(gameState)),
    salesBefore,
  );
  await page.evaluate(() => {
    gameState.sellingItems[0].offers = [];
    renderSellingTab();
  });
  assert(await page.locator("#inbox-empty").isVisible());
  await page.locator("#inbox-only").uncheck();
  assert.equal(await page.locator("#sellingItems > :visible").count(), 2);
  for (const width of [360, 390, 700, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
  }
  const recorded = await page.evaluate(() => {
    logDeal({ ...gameState.marketItems[0], purchasePrice: 500 }, 900, "Авито");
    return gameState.dealsLog.at(-1).day;
  });
  assert.equal(recorded, await page.evaluate(() => gameState.day));
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    "PASS: ledger empty/search/filter/sort/pagination/details/CSV, formula escaping, hidden-truth exclusion, HTML escaping, responsive widths, offer inbox, read-only state and day metadata.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
