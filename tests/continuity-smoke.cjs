/* Run with the same Playwright / browser environment as atelier-smoke.cjs. */
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
  const url = process.env.GAME_URL || "http://127.0.0.1:3000";
  const ready = async () => {
    await page.waitForFunction(
      () => document.documentElement.dataset.atelierReady === "true",
    );
    await page.waitForTimeout(350);
  };
  const reload = async () => {
    await page.reload();
    await ready();
  };
  const shot = async (name) => {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);
    await page.screenshot({
      path: (process.env.SHOT_DIR || "/tmp") + "/" + name + ".png",
    });
  };
  await page.goto(url);
  await ready();
  assert.equal(
    await page.evaluate(() => TorgContinuity.getStatus().status),
    "saved",
  );
  const original = await page.evaluate(() =>
    JSON.parse(JSON.stringify(gameState)),
  );
  // Unchanged saves must not rotate the backup.
  await page.evaluate(() => {
    saveGame();
    window.backupBefore = localStorage.getItem("udelka_save_backup");
    saveGame();
  });
  assert.equal(
    await page.evaluate(
      () => localStorage.getItem("udelka_save_backup") === backupBefore,
    ),
    true,
  );
  // Capture a real generated state as a fixture for pure schema roundtrips.
  const schema = require("../save-schema.js");
  assert.deepEqual(
    schema.parse(schema.serialize(original), { external: true }),
    original,
  );
  // Deterministic tactic success, pause, reload, resume and no second use.
  const id = await page.evaluate(() => {
    gameState.unlockedTactics = ["silent_treatment", "point_defects"];
    gameState.successfulPurchases = 2;
    gameState.money = 100000;
    const item = gameState.marketItems[0];
    item.sellerPortrait = JSON.parse(JSON.stringify(item.sellerPortrait));
    item.sellerPortrait.critical = "not_this";
    item.sellerPortrait.patience = 4;
    startHaggle(item.id);
    const random = Math.random;
    Math.random = () => 0.1;
    try {
      useTactic("silent_treatment");
    } finally {
      Math.random = random;
    }
    return item.id;
  });
  assert.deepEqual(
    await page.evaluate(
      (id) =>
        JSON.parse(localStorage.getItem("udelka_save")).marketItems.find(
          (i) => i.id === id,
        ).haggleState.usedTactics,
      id,
    ),
    ["silent_treatment"],
  );
  const paused = await page.evaluate((id) => {
    closeHaggle();
    return JSON.parse(
      JSON.stringify(
        gameState.marketItems.find((i) => i.id === id).haggleState,
      ),
    );
  }, id);
  assert.deepEqual(paused.usedTactics, ["silent_treatment"]);
  assert.equal(await page.locator(".paused-badge").count(), 1);
  await reload();
  await page.evaluate((id) => startHaggle(id), id);
  assert.deepEqual(
    await page.evaluate(() => ({
      currentPrice: currentHaggle.currentPrice,
      patience: currentHaggle.patience,
      maxPatience: currentHaggle.maxPatience,
      usedTactics: currentHaggle.usedTactics,
      competitors: currentHaggle.competitors,
      currentQuote: currentHaggle.currentQuote,
    })),
    paused,
  );
  await page.evaluate(() => useTactic("silent_treatment"));
  assert.equal(
    await page.evaluate(() => currentHaggle.currentPrice),
    paused.currentPrice,
  );
  // Purchase is durable before the seller's three-second closing quote.
  const purchase = await page.evaluate(() => {
    const before = gameState.money,
      price = currentHaggle.currentPrice;
    acceptCurrentPrice();
    acceptCurrentPrice();
    const saved = JSON.parse(localStorage.getItem("udelka_save"));
    return {
      before,
      price,
      money: saved.money,
      bought: saved.stats.bought,
      items: saved.inventory.length,
      market: saved.marketItems.map((i) => i.id),
    };
  });
  assert.equal(purchase.money, purchase.before - purchase.price);
  assert.equal(purchase.items, 1);
  assert.equal(purchase.bought, 1);
  assert(!purchase.market.includes(id));
  await reload();
  assert.equal(await page.evaluate(() => gameState.money), purchase.money);
  assert.equal(await page.evaluate(() => gameState.inventory.length), 1);
  // Critical failure must not temporarily change the account balance or allow purchase.
  const failure = await page.evaluate(() => {
    const item = gameState.marketItems[0];
    item.sellerPortrait = JSON.parse(JSON.stringify(item.sellerPortrait));
    item.sellerPortrait.critical = "silent_treatment";
    startHaggle(item.id);
    const before = gameState.money,
      count = gameState.inventory.length;
    useTactic("silent_treatment");
    acceptCurrentPrice();
    const result = {
      before,
      after: gameState.money,
      count,
      afterCount: gameState.inventory.length,
      finished: currentHaggle.finished,
      savedMoney: JSON.parse(localStorage.getItem("udelka_save")).money,
    };
    closeHaggle();
    const next = gameState.marketItems[0];
    startHaggle(next.id);
    result.next = next.id;
    return result;
  });
  assert.equal(failure.after, failure.before);
  assert.equal(failure.savedMoney, failure.before);
  assert.equal(failure.count, failure.afterCount);
  assert(failure.finished);
  await page.waitForTimeout(2200);
  assert.equal(await page.evaluate(() => currentHaggle?.item.id), failure.next);
  await page.evaluate(() => closeHaggle());
  // Both exhaustion branches and competitive interception preserve money.
  for (const branch of ["silent_treatment", "point_defects", "interception"]) {
    const outcome = await page.evaluate(
      ({ fixture, branch }) => {
        const item = JSON.parse(JSON.stringify(fixture));
        gameState.marketItems = [item];
        item.sellerPortrait.critical = "never";
        item.sellerPortrait.patience = 1;
        startHaggle(item.id);
        const before = gameState.money;
        const random = Math.random,
          intercept = checkCompetitorInterception;
        Math.random = () => (branch === "interception" ? 0.1 : 0.99);
        if (branch === "interception")
          checkCompetitorInterception = () => ({
            name: "Контрольный конкурент",
          });
        try {
          useTactic(
            branch === "point_defects" ? "point_defects" : "silent_treatment",
          );
        } finally {
          Math.random = random;
          checkCompetitorInterception = intercept;
        }
        const result = {
          before,
          after: gameState.money,
          finished: currentHaggle.finished,
          left: gameState.marketItems.length,
          disabled: document.querySelector(
            '#haggleModal [onclick="acceptCurrentPrice()"]',
          ).disabled,
        };
        acceptCurrentPrice();
        closeHaggle();
        return result;
      },
      { fixture: original.marketItems[0], branch },
    );
    assert(outcome.finished);
    assert(outcome.disabled);
    assert.equal(outcome.after, outcome.before);
    assert.equal(outcome.left, 0);
  }
  // Negative and fractional appraisals cannot complete research.
  await page.evaluate(() => startExpertise(gameState.inventory[0].id));
  const research = await page.evaluate(() => {
    const before = gameState.attention;
    clickVisualZone();
    const disk = JSON.parse(localStorage.getItem("udelka_save"));
    return {
      before,
      after: gameState.attention,
      savedAttention: disk.attention,
      uses: disk.inventory[0].visualUses,
    };
  });
  assert(research.after < research.before);
  assert.equal(research.after, research.savedAttention);
  assert.equal(research.uses, 1);
  await page.evaluate(() => {
    document.getElementById("authenticityGuess").value = "true";
    document.getElementById("valueGuess").value = "-1";
    document.getElementById("ageGuess").value = "100";
    submitExpertise();
  });
  assert.equal(
    await page.evaluate(() => gameState.inventory[0].expertiseDone),
    false,
  );
  await page.evaluate(() => {
    document.getElementById("valueGuess").value = "12.5";
    submitExpertise();
  });
  assert.equal(
    await page.evaluate(() => gameState.inventory[0].expertiseDone),
    false,
  );
  await page.evaluate(() => {
    const item = gameState.inventory[0];
    document.getElementById("valueGuess").value = String(
      Math.round(item.realValue),
    );
    document.getElementById("ageGuess").value = String(
      Math.max(1, Math.round(item.age)),
    );
    submitExpertise();
  });
  await page.evaluate(() => closeExpertise());
  // Reject non-positive Avito prices without moving inventory or spending money.
  await page.evaluate(() => startSell(gameState.inventory[0].id));
  const beforeSale = await page.evaluate(() => ({
    money: gameState.money,
    inventory: gameState.inventory.length,
    selling: gameState.sellingItems.length,
  }));
  await page.evaluate(() => {
    document.getElementById("avitoPrice").value = "-100";
    selectAvitoSale();
  });
  assert.deepEqual(
    await page.evaluate(() => ({
      money: gameState.money,
      inventory: gameState.inventory.length,
      selling: gameState.sellingItems.length,
    })),
    beforeSale,
  );
  await page.evaluate(() => closeSell());
  // A double request advances once; mid-transition saves must leave the old checkpoint intact.
  const day = await page.evaluate(() => {
    const before = { day: gameState.day, money: gameState.money };
    nextDay();
    nextDay();
    saveGame();
    return {
      ...before,
      pendingSavedDay: JSON.parse(localStorage.getItem("udelka_save")).day,
    };
  });
  assert.equal(day.pendingSavedDay, day.day);
  await page.waitForTimeout(400);
  assert.equal(await page.evaluate(() => gameState.day), day.day + 1);
  assert.equal(await page.evaluate(() => gameState.money), day.money - 500);
  await page.locator("#day-report").waitFor({ state: "visible" });
  await shot("continuity-day-desktop");
  await page.setViewportSize({ width: 390, height: 900 });
  await shot("continuity-day-mobile");
  for (const width of [360, 390, 700, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    assert(
      await page.evaluate(
        () =>
          document.getElementById("day-report").scrollWidth <=
          document.getElementById("day-report").clientWidth + 1,
      ),
    );
  }
  await shot("continuity-day-tablet");
  await page.locator("[data-report-close]").click();
  // Report cashflow includes an actual completed sale, not a prediction.
  const soldDay = await page.evaluate(() => {
    const item = gameState.inventory.shift();
    gameState.sellingItems.push({
      ...item,
      channel: "regular",
      salePrice: 1500,
      daysLeft: 1,
      totalDays: 1,
    });
    const before = gameState.money;
    nextDay();
    return before;
  });
  await page.waitForTimeout(400);
  assert.equal(await page.evaluate(() => gameState.money), soldDay + 1000);
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("torg-ui-last-day-report")).other,
    ),
    1500,
  );
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("torg-ui-last-day-report")).sold,
    ),
    1,
  );
  await page.locator("[data-report-close]").click();
  // Empty market is intentional and must stay empty after a reload.
  await page.evaluate(() => {
    gameState.marketItems = [];
    saveGame();
  });
  await reload();
  assert.equal(await page.evaluate(() => gameState.marketItems.length), 0);
  // Storage quota failures are honest; primary checkpoint must survive.
  const beforeFailure = await page.evaluate(() =>
    localStorage.getItem("udelka_save"),
  );
  await page.evaluate(() => {
    window.originalSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function () {
      throw new DOMException("Full", "QuotaExceededError");
    };
    gameState.money += 123;
    saveGame();
  });
  assert.equal(
    await page.evaluate(() => TorgContinuity.getStatus().status),
    "error",
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("udelka_save")),
    beforeFailure,
  );
  await page.evaluate(() => {
    Storage.prototype.setItem = window.originalSet;
    saveGame();
  });
  assert.equal(
    await page.evaluate(() => TorgContinuity.getStatus().status),
    "saved",
  );
  // Roundtrip via actual file picker and explicit confirmation, including pagehide.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("#save-indicator").click();
  await shot("continuity-vault-desktop");
  const beforeImportMoney = await page.evaluate(() => gameState.money);
  const imported = JSON.parse(JSON.stringify(original));
  imported.day = 9;
  imported.money = 54321;
  imported.marketItems = [];
  await page
    .locator("#save-file")
    .setInputFiles({
      name: "progress.json",
      mimeType: "application/json",
      buffer: Buffer.from(schema.serialize(imported)),
    });
  await page.locator("#confirm-import").waitFor();
  assert.notEqual(await page.evaluate(() => gameState.day), 9);
  await Promise.all([
    page.waitForEvent("load"),
    page.locator("#confirm-import").click(),
  ]);
  await ready();
  assert.equal(await page.evaluate(() => gameState.day), 9);
  assert.equal(await page.evaluate(() => gameState.money), 54321);
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("udelka_save_backup")).money,
    ),
    beforeImportMoney,
  );
  // HTML and malformed files are rejected without replacing state.
  await page.locator("#save-indicator").click();
  const importedRaw = await page.evaluate(() =>
    localStorage.getItem("udelka_save"),
  );
  const malicious = JSON.parse(JSON.stringify(original));
  malicious.marketItems[0].baseName = "<img src=x onerror=alert(1)>";
  await page
    .locator("#save-file")
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(malicious)),
    });
  await page.waitForFunction(
    () =>
      document.getElementById("import-preview").className === "import-error",
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("udelka_save")),
    importedRaw,
  );
  for (const width of [360, 390, 700, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    assert(
      await page.evaluate(
        () =>
          document.getElementById("save-vault").scrollWidth <=
          document.getElementById("save-vault").clientWidth + 1,
      ),
    );
    if (width === 390) await shot("continuity-vault-mobile");
  }
  await page.locator("[data-vault-close]").click();
  // Crash recovery preserves the corrupt bytes and uses the last good checkpoint.
  const recovery = await page.evaluate(() => {
    const good = localStorage.getItem("udelka_save");
    localStorage.setItem("udelka_save_backup", good);
    localStorage.setItem("udelka_save", "{broken");
    window.dispatchEvent(new Event("pagehide"));
    return good;
  });
  // Disable pagehide save when setting up an intentional corrupt disk snapshot.
  await page.evaluate(() => {
    window.saveGame = () => false;
    localStorage.setItem("udelka_save", "{broken");
  });
  await reload();
  assert.equal(
    await page.evaluate(() => gameState.money),
    JSON.parse(recovery).money,
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("udelka_save_damaged")),
    "{broken",
  );
  assert.equal(
    await page.evaluate(() => TorgContinuity.getStatus().status),
    "saved",
  );
  // No valid backup: remain protected, never overwrite the broken primary.
  await page.evaluate(() => {
    window.saveGame = () => false;
    localStorage.removeItem("udelka_save_backup");
    localStorage.setItem("udelka_save", "{unrecoverable");
  });
  await reload();
  assert.equal(
    await page.evaluate(() => TorgContinuity.getStatus().blocked),
    true,
  );
  assert.equal(
    await page.evaluate(() => {
      saveGame();
      return localStorage.getItem("udelka_save");
    }),
    "{unrecoverable",
  );
  assert.equal(await page.locator("#save-vault").isVisible(), true);
  // Restore a valid file from protection mode.
  await page
    .locator("#save-file")
    .setInputFiles({
      name: "restore.json",
      mimeType: "application/json",
      buffer: Buffer.from(schema.serialize(imported)),
    });
  await page.locator("#confirm-import").waitFor();
  await Promise.all([
    page.waitForEvent("load"),
    page.locator("#confirm-import").click(),
  ]);
  await ready();
  assert.equal(
    await page.evaluate(() => TorgContinuity.getStatus().blocked),
    false,
  );
  // Reset must not be undone by the old page's pagehide autosave.
  page.once("dialog", (dialog) => dialog.accept());
  await Promise.all([
    page.waitForEvent("load"),
    page.evaluate(() => resetGame()),
  ]);
  await ready();
  assert.equal(await page.evaluate(() => gameState.day), 1);
  assert.equal(await page.evaluate(() => gameState.money), 10000);
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("udelka_save_backup")).day,
    ),
    9,
  );
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    "PASS: durable purchase, pause/reload/resume, terminal loss, stale timers, input guards, single day transition, daily report, empty market, storage failure, validated import, corrupt-save recovery, protected mode, reset and responsive archive; no JS errors.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
