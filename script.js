"use strict";

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const desktopQuery = window.matchMedia("(min-width: 1181px)");

function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  mobileMenu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => setMenu(mobileMenu.hidden));
mobileMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
desktopQuery.addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileMenu.hidden) setMenu(false, true);
});
document.addEventListener("click", (event) => {
  if (!mobileMenu.hidden && !header.contains(event.target)) setMenu(false);
});

let scheduled = false;
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 12);
  scheduled = false;
}
window.addEventListener("scroll", () => {
  if (!scheduled) {
    requestAnimationFrame(updateHeader);
    scheduled = true;
  }
}, { passive: true });
updateHeader();

document.querySelector("#year").textContent = new Date().getFullYear();

const faqItems = [...document.querySelectorAll(".faq-list details")];
faqItems.forEach((item) => {
  item.querySelector("summary").addEventListener("click", () => {
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});


// Mobile composition keeps the content in the DOM while placing the quiz earlier on small screens.
const mobileLayoutQuery = window.matchMedia("(max-width: 768px)");
const catalogSection = document.querySelector("#catalog");
const worksSection = document.querySelector("#works");
const estimateSection = document.querySelector("#estimate");
const heroSection = document.querySelector("#top");
const footer = document.querySelector(".site-footer");
const mobileStickyCta = document.querySelector(".mobile-sticky-cta");
let mobileCtaScheduled = false;

function updateMobileStickyCta() {
  mobileCtaScheduled = false;
  if (!mobileLayoutQuery.matches || !mobileMenu.hidden) {
    mobileStickyCta.hidden = true;
    return;
  }

  const headerHeight = header.getBoundingClientRect().height;
  const heroPassed = heroSection.getBoundingClientRect().bottom < headerHeight;
  const estimateBox = estimateSection.getBoundingClientRect();
  const quizVisible = estimateBox.top < window.innerHeight && estimateBox.bottom > headerHeight;
  const footerVisible = footer.getBoundingClientRect().top < window.innerHeight;
  mobileStickyCta.hidden = !heroPassed || quizVisible || footerVisible;
}

function scheduleMobileStickyCta() {
  if (mobileCtaScheduled) return;
  mobileCtaScheduled = true;
  requestAnimationFrame(updateMobileStickyCta);
}

function syncMobileLayout() {
  if (mobileLayoutQuery.matches) {
    if (estimateSection.nextElementSibling !== worksSection) estimateSection.after(worksSection);
  } else if (catalogSection.nextElementSibling !== worksSection) {
    catalogSection.after(worksSection);
  }
  scheduleMobileStickyCta();
}

mobileLayoutQuery.addEventListener("change", syncMobileLayout);
window.addEventListener("scroll", scheduleMobileStickyCta, { passive: true });
window.addEventListener("resize", scheduleMobileStickyCta);
menuButton.addEventListener("click", scheduleMobileStickyCta);
mobileStickyCta.querySelector("a").addEventListener("click", () => {
  requestAnimationFrame(() => {
    const heading = estimateSection.querySelector("h2");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  });
});
syncMobileLayout();

