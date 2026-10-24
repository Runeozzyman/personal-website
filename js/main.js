const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = document.querySelectorAll(".reveal");

if (reduceMotion) {
  reveals.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach((el) => revealObserver.observe(el));
}

const nav = document.querySelector("#nav");
const hero = document.querySelector("#hero");

if (nav && hero) {
  const navObserver = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle("is-scrolled", !entry.isIntersecting);
    },
    { threshold: 0 }
  );

  navObserver.observe(hero);
}

const desktop = window.matchMedia("(min-width: 48rem)");
const snapSelector = "#hero, #skills, #work article, #about, #contact";
let snapFrame = 0;
let snapping = false;

function easeOutQuart(t) {
  return 1 - (1 - t) ** 4;
}

function scrollPadding() {
  return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
}

function snapElements() {
  return [...document.querySelectorAll(snapSelector)];
}

function positionOf(element) {
  return Math.max(0, element.getBoundingClientRect().top + window.scrollY - scrollPadding());
}

function nearestIndex(elements) {
  const y = window.scrollY;
  let index = 0;
  elements.forEach((element, i) => {
    if (positionOf(element) <= y + 2) index = i;
  });
  return index;
}

function animateTo(targetY) {
  const start = window.scrollY;
  const change = targetY - start;
  if (Math.abs(change) < 2) return;

  const token = ++snapFrame;
  snapping = true;
  const root = document.documentElement;
  root.style.scrollSnapType = "none";
  root.style.scrollBehavior = "auto";

  const duration = Math.min(1600, 700 + Math.abs(change) * 0.4);
  const started = performance.now();

  function step(now) {
    if (token !== snapFrame) return;
    const t = Math.min(1, (now - started) / duration);
    window.scrollTo(0, start + change * easeOutQuart(t));
    if (t < 1) {
      requestAnimationFrame(step);
      return;
    }
    window.scrollTo(0, targetY);
    root.style.scrollSnapType = "";
    root.style.scrollBehavior = "";
    snapping = false;
  }

  requestAnimationFrame(step);
}

const timelineTicks = [...document.querySelectorAll("[data-timeline]")];

function syncTimeline() {
  if (!timelineTicks.length) return;
  const elements = snapElements();
  const currentId = elements[nearestIndex(elements)]?.id;
  timelineTicks.forEach((tick) => {
    const tickId = tick.getAttribute("href")?.slice(1);
    if (tickId && tickId === currentId) tick.setAttribute("aria-current", "true");
    else tick.removeAttribute("aria-current");
  });
}

window.addEventListener("scroll", syncTimeline, { passive: true });
window.addEventListener("resize", syncTimeline);
syncTimeline();

function moveSections(direction) {
  const elements = snapElements();
  const next = nearestIndex(elements) + direction;
  if (next < 0 || next >= elements.length) return;
  animateTo(positionOf(elements[next]));
}

if (!reduceMotion) {
  window.addEventListener(
    "wheel",
    (event) => {
      if (!desktop.matches || event.ctrlKey) return;
      event.preventDefault();
      if (snapping || event.deltaY === 0) return;
      moveSections(event.deltaY > 0 ? 1 : -1);
    },
    { passive: false }
  );

  window.addEventListener("keydown", (event) => {
    if (!desktop.matches || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) return;

    if (event.key === "Home") {
      event.preventDefault();
      animateTo(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const elements = snapElements();
      animateTo(positionOf(elements[elements.length - 1]));
      return;
    }

    let direction = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[event.key];
    if (event.key === " " && (target === document.body || target === document.documentElement)) {
      direction = event.shiftKey ? -1 : 1;
    }
    if (!direction || snapping) {
      if (direction) event.preventDefault();
      return;
    }

    event.preventDefault();
    moveSections(direction);
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !desktop.matches) return;

    const id = link.getAttribute("href").slice(1);
    const target = id && id !== "top" ? document.getElementById(id) : document.querySelector("#hero");
    if (!target) return;

    const destination = target.matches(snapSelector) ? target : target.querySelector(snapSelector);
    if (!destination) return;

    event.preventDefault();
    history.pushState(null, "", `#${id || "top"}`);
    animateTo(positionOf(destination));
  });
}
