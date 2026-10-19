// Site behaviour: theme, mobile menu, contents panel.
// Loaded in <head> so the theme is applied before first paint (no flash, no layout shift).
// The theme choice is kept in this browser only (localStorage), never sent anywhere.
(function () {
  var KEY = "faraday.theme";
  var root = document.documentElement;
  // Marks that JavaScript runs, so script-only controls can be shown before first paint.
  root.classList.add("js");
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  if (saved === "light") root.setAttribute("data-theme", "light");

  function syncTheme(btns) {
    var light = root.getAttribute("data-theme") === "light";
    btns.forEach(function (btn) {
      btn.setAttribute("aria-pressed", light ? "true" : "false");
      var label = btn.querySelector("[data-theme-label]");
      if (label) label.textContent = light ? "Dark mode" : "Light mode";
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", light ? "#f1f3f1" : "#0c1214");
  }

  function setupTheme() {
    var btns = Array.prototype.slice.call(document.querySelectorAll("[data-theme-toggle]"));
    if (!btns.length) return;
    syncTheme(btns);
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var light = root.getAttribute("data-theme") === "light";
        if (light) root.removeAttribute("data-theme"); else root.setAttribute("data-theme", "light");
        try { localStorage.setItem(KEY, light ? "dark" : "light"); } catch (e) { /* ignore */ }
        syncTheme(btns);
      });
    });
  }

  function setupMenu() {
    var btn = document.querySelector("[data-menu-toggle]");
    var panel = document.getElementById("site-nav");
    if (!btn || !panel) return;
    var wide = window.matchMedia("(min-width: 1120px)");

    function setOpen(open, returnFocus) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.querySelector("[data-menu-label]").textContent = open ? "Close" : "Menu";
      root.classList.toggle("menu-open", open);
      if (open) {
        var first = panel.querySelector("a");
        if (first) first.focus();
      } else if (returnFocus) {
        btn.focus();
      }
    }

    btn.addEventListener("click", function () {
      setOpen(btn.getAttribute("aria-expanded") !== "true", true);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("menu-open")) setOpen(false, true);
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false, false);
    });
    // Leaving the small-screen layout closes the menu so the page can scroll again.
    var onChange = function () { if (wide.matches) setOpen(false, false); };
    if (wide.addEventListener) wide.addEventListener("change", onChange); else wide.addListener(onChange);
  }

  // "On this page" starts open where there's room for it beside the article.
  function setupContents() {
    var toc = document.querySelector("details.toc");
    if (toc && window.matchMedia("(min-width: 1024px)").matches) toc.open = true;
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupTheme();
    setupMenu();
    setupContents();
  });
})();
