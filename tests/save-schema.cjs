const assert = require("node:assert/strict");
const { parse, serialize, validate, MAX_BYTES } = require("../save-schema.js");
const valid = {
  day: 1,
  money: 10000,
  reputation: 10,
  attention: 100,
  officeLevel: 0,
  stats: { bought: 0, sold: 0, profit: 0 },
  skills: { books: 1 },
  inventory: [],
  marketItems: [],
  sellingItems: [],
  dealsLog: [],
};
assert.deepEqual(parse(serialize(valid), { external: true }), valid);
assert.deepEqual(parse(JSON.stringify(valid)), valid);
assert.throws(() => parse("{broken"));
assert.throws(() => parse(" ".repeat(MAX_BYTES + 1)));
assert.throws(() => parse(JSON.stringify({ ...valid, money: "10000" })));
assert.throws(() => validate({ ...valid, money: NaN }));
assert.throws(() => validate({ ...valid, day: 1.5 }));
assert.throws(() => validate({ ...valid, attention: -1 }));
assert.throws(() => validate({ ...valid, marketItems: {} }));
assert.throws(() => validate({ ...valid, officeLevel: 3 }));
assert.throws(() =>
  parse(
    JSON.stringify({ format: "torg-umesten-save", version: 2, state: valid }),
  ),
);
assert.throws(() =>
  parse(JSON.stringify({ ...valid, note: "<img src=x onerror=alert(1)>" }), {
    external: true,
  }),
);
assert.throws(() =>
  parse('{"day":1,"money":10000,"reputation":10,"__proto__":{}}'),
);
const item = {
  id: "market_1",
  baseName: "Чашка",
  category: "porcelain",
  defects: [],
  marks: [],
  askingPrice: 1000,
  sellerType: "granny",
  sellerPortrait: { patience: 3 },
  sellerQuotes: {},
};
assert.doesNotThrow(() => validate({ ...valid, marketItems: [item] }));
assert.throws(() => validate({ ...valid, marketItems: [item, item] }));
assert.throws(() =>
  validate({ ...valid, marketItems: [{ ...item, id: "x');alert(1)//" }] }),
);
assert.throws(() =>
  validate({
    ...valid,
    marketItems: [
      {
        ...item,
        haggleState: {
          currentPrice: -1,
          patience: 3,
          maxPatience: 3,
          usedTactics: [],
          competitors: [],
          currentQuote: "",
        },
      },
    ],
  }),
);
let deep = {};
for (let i = 0; i < 40; i++) deep = { nested: deep };
assert.throws(() => validate({ ...valid, deep }));
console.log(
  "PASS: JSON roundtrip, legacy raw saves, size/depth bounds, finite numbers, collections, item IDs, duplicate IDs, negotiation state, version checks, HTML and prototype keys.",
);
