// Click (or Enter/Space on) a screenshot to see it large. Arrow keys step through the page's screenshots,
// Escape, the × button or a click outside the image closes it. No dependencies; a native <dialog>.
(() => {
  const SELECTOR = ".sl-markdown-content figure.shot img, .family-grid figure.app img";

  function setup() {
    const images = [...document.querySelectorAll(SELECTOR)];
    if (!images.length) return;

    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", "Screenshot");
    dialog.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close">×</button>
      <button type="button" class="lightbox-step prev" aria-label="Previous screenshot">‹</button>
      <figure>
        <img alt="" />
        <figcaption></figcaption>
      </figure>
      <button type="button" class="lightbox-step next" aria-label="Next screenshot">›</button>
      <p class="lightbox-count" aria-live="polite"></p>`;
    document.body.append(dialog);

    const big = dialog.querySelector("img");
    const caption = dialog.querySelector("figcaption");
    const count = dialog.querySelector(".lightbox-count");
    const prev = dialog.querySelector(".prev");
    const next = dialog.querySelector(".next");
    let index = 0;
    let opener = null;

    function captionOf(img) {
      const cap = img.closest("figure")?.querySelector("figcaption");
      return cap ? cap.textContent.trim() : img.alt;
    }

    function show(i) {
      index = (i + images.length) % images.length;
      const img = images[index];
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      caption.textContent = captionOf(img);
      count.textContent = images.length > 1 ? `${index + 1} of ${images.length}` : "";
      prev.hidden = next.hidden = images.length < 2;
    }

    function open(i) {
      opener = images[i];
      show(i);
      dialog.showModal();
      document.documentElement.classList.add("lightbox-open");
    }

    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("lightbox-open");
      // Back to the screenshot last shown, scrolled into view, so stepping through them moves the reader too.
      const last = images[index] ?? opener;
      last?.focus({ preventScroll: true });
      last?.scrollIntoView({ block: "center" });
    });
    dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
    prev.addEventListener("click", () => show(index - 1));
    next.addEventListener("click", () => show(index + 1));
    // A click on the backdrop (the dialog itself, outside its content) closes it.
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog || e.target === dialog.querySelector("figure")) dialog.close();
    });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
    });

    images.forEach((img, i) => {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `Enlarge screenshot: ${img.alt}`);
      img.classList.add("zoomable");
      img.addEventListener("click", () => open(i));
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
