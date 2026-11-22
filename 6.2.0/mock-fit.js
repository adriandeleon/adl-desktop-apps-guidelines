// Template mockups are drawn at the apps' real pixel sizes. Where the text column is narrower than a mockup
// (a laptop with the "On this page" column, a phone), scale the mockup down to fit instead of clipping its right
// edge, and say so in the corner. Never below half size: past that the stage scrolls sideways as before.
(() => {
  const MIN = 0.5;

  function fit(stage) {
    const kids = [...stage.children];
    kids.forEach((k) => (k.style.zoom = ""));
    const style = getComputedStyle(stage);
    const pad = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const room = stage.clientWidth - pad;
    const need = stage.scrollWidth - pad;
    if (need <= room + 1) {
      delete stage.dataset.scale;
      return;
    }
    const zoom = Math.max(MIN, Math.floor((room / need) * 100) / 100);
    kids.forEach((k) => (k.style.zoom = String(zoom)));
    stage.dataset.scale = `${Math.round(zoom * 100)} %`;
  }

  function setup() {
    const stages = document.querySelectorAll(".mock-stage");
    if (!stages.length || !("zoom" in document.documentElement.style)) return;
    const observer = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target)));
    stages.forEach((s) => observer.observe(s));
    document.fonts?.ready.then(() => stages.forEach(fit));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
