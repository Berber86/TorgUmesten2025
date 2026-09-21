/* Presentation lifecycle: off-screen animated portraits must not keep decoding. */
(() => {
  "use strict";
  const walking = document.getElementById("walking-market");
  const market = document.getElementById("content-market");
  const haggle = document.getElementById("haggleModal");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  function syncPortraits() {
    const visible =
      !document.hidden &&
      !reduced.matches &&
      !walking.classList.contains("hidden") &&
      !market.classList.contains("hidden") &&
      haggle.classList.contains("hidden");
    document.querySelectorAll(".seller-portrait-video").forEach((video) => {
      if (!visible) video.pause();
      else if (video.paused) video.play().catch(() => {}); // Browser may block autoplay; poster remains.
    });
  }
  const observer = new MutationObserver(syncPortraits);
  [walking, market, haggle].forEach((el) =>
    observer.observe(el, { attributes: true, attributeFilter: ["class"] }),
  );
  observer.observe(document.getElementById("new-market-view"), {
    childList: true,
    subtree: true,
  });
  document.addEventListener("visibilitychange", syncPortraits);
  reduced.addEventListener("change", syncPortraits);
})();
