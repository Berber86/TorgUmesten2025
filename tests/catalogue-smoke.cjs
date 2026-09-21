// Visual edition: responsive composition and read-only behaviour.
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
  await page.evaluate(() => document.fonts.ready);
  const before = await page.evaluate(() => JSON.stringify(gameState));
  assert(
    (
      await page
        .locator(".studio-masthead h1")
        .evaluate((el) => getComputedStyle(el).fontFamily)
    ).includes("Georgia"),
  );
  const shot = async (name) => {
    await page.waitForTimeout(250);
    await page.screenshot({
      path: (process.env.SHOT_DIR || "/tmp") + "/" + name + ".png",
    });
  };
  for (const width of [360, 390, 520, 700, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const tab of ["atelier", "market", "selling", "stats"]) {
      await page.evaluate((tab) => switchTab(tab), tab);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${tab} overflow at ${width}`,
      );
    }
    await page.evaluate(() => switchTab("market"));
    if (width <= 520) {
      const cards = page.locator(".find-card");
      if ((await cards.count()) > 1) {
        const a = await cards.nth(0).boundingBox(),
          b = await cards.nth(1).boundingBox();
        assert(Math.abs(a.x - b.x) < 1);
        assert(b.y > a.y + a.height);
      }
    }
    if (width === 390) {
      await page.evaluate(() => scrollTo(0, 0));
      await shot("catalogue-market-mobile");
      await page.locator(".find-open").first().click();
      await shot("catalogue-preview-mobile");
      assert(
        await page
          .locator("#item-inspector")
          .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      );
      await page.keyboard.press("Escape");
    }
  }
  assert(
    (
      await page
        .locator(".market-hero")
        .evaluate((el) => getComputedStyle(el).backgroundImage)
    ).includes("catalogue-hero.jpg"),
  );
  const image = await page.request.get(
    new URL("/assets/catalogue-hero.jpg", page.url()).href,
  );
  assert(image.ok());
  await page.evaluate(() => {
    switchTab("market");
    scrollTo(0, 0);
  });
  await shot("catalogue-market-desktop");
  await page.evaluate(() => {
    switchTab("atelier");
    scrollTo(0, 0);
  });
  await shot("catalogue-home-desktop");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".studio-scene>img")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "0s",
  );
  assert.equal(await page.evaluate(() => JSON.stringify(gameState)), before);
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    "PASS: catalogue typography, new local artwork, single-column mobile, 360–1440px layouts, preview, reduced motion, unchanged game state, no JS errors.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
