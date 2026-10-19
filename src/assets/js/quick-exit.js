// Quick exit: leaves the page and replaces it in the tab's history, so pressing
// Back doesn't return here. Press Escape twice quickly to trigger it too.
// This does not clear browsing history. The help pages explain how to do that.
(function () {
  var link = document.querySelector("[data-quick-exit]");
  if (!link) return;
  function leave(e) {
    if (e) e.preventDefault();
    try { document.body.style.display = "none"; } catch (err) { /* ignore */ }
    window.location.replace(link.href);
  }
  link.addEventListener("click", leave);
  var last = 0;
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var now = Date.now();
    if (now - last < 600) leave();
    last = now;
  });
})();
