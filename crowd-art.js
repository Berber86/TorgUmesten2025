/* ============================================================
   Общий подбор фигур конкурентов (толпы): используется и сценой
   торга (crowd.js), и рынком в режиме прогулки (market.js).
   Знаковым именам — своя фигура (поле for у записи arts),
   остальным — устойчивый подбор по хешу имени из набора группы,
   чтобы у каждого покупателя был один облик от торга к торгу.
   ============================================================ */
(function () {
  "use strict";

  const ART_DIR = "competitor_portraits/";

  function crowdGroupFor(comp) {
    if (typeof competitorGroups === "undefined") return null;
    return (
      competitorGroups.find((g) => g.name === comp.group) ||
      competitorGroups.find((g) => g.members.includes(comp.name)) ||
      null
    );
  }

  function hashName(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h;
  }

  function crowdArtFor(comp) {
    const group = crowdGroupFor(comp);
    if (!group) return null;
    const arts = group.arts || (group.art ? [{ file: group.art }] : []);
    if (!arts.length) return null;
    const named = arts.find((a) => a.for && a.for.includes(comp.name));
    const pool = arts.map((a) => a.file);
    const file = named ? named.file : pool[hashName(comp.name) % pool.length];
    return ART_DIR + file;
  }

  window.crowdGroupFor = crowdGroupFor;
  window.crowdArtFor = crowdArtFor;
})();
