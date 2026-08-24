(function () {
  "use strict";

  // Évite un double-chargement si le script est inclus plusieurs fois par erreur
  if (window.__leadiaWidgetLoaded) {
    return;
  }
  window.__leadiaWidgetLoaded = true;

  var currentScript = document.currentScript;

  if (!currentScript) {
    console.error("[Leadia widget] Impossible de détecter la balise <script>.");
    return;
  }

  var agentSlug = currentScript.getAttribute("data-agent-slug");

  if (!agentSlug) {
    console.error(
      "[Leadia widget] L'attribut data-agent-slug est requis sur la balise <script>.",
    );
    return;
  }

  // Origine déduite automatiquement depuis l'URL du script lui-même —
  // pas besoin que le client la précise à la main.
  var scriptUrl = new URL(currentScript.src);
  var origin = scriptUrl.origin;

  var LAUNCHER_SIZE = { width: "76px", height: "76px" };
  var PANEL_SIZE = { width: "410px", height: "660px" };

  var iframe = document.createElement("iframe");
  iframe.src = origin + "/embed/" + encodeURIComponent(agentSlug);
  iframe.title = "Assistant Leadia";
  iframe.setAttribute("allowtransparency", "true");
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.border = "none";
  iframe.style.background = "transparent";
  iframe.style.zIndex = "2147483000";
  iframe.style.width = LAUNCHER_SIZE.width;
  iframe.style.height = LAUNCHER_SIZE.height;
  iframe.style.colorScheme = "normal";

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    iframe.style.transition = "width 180ms ease, height 180ms ease";
  }

  document.body.appendChild(iframe);

  // Le widget (dans l'iframe) prévient quand il s'ouvre/se ferme, pour
  // qu'on redimensionne l'iframe côté site hôte en conséquence.
  window.addEventListener("message", function (event) {
    if (event.origin !== origin) {
      return;
    }

    var data = event.data;

    if (!data || data.source !== "leadia-widget" || data.type !== "resize") {
      return;
    }

    var size = data.open ? PANEL_SIZE : LAUNCHER_SIZE;
    iframe.style.width = size.width;
    iframe.style.height = size.height;
  });
})();