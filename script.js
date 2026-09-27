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
