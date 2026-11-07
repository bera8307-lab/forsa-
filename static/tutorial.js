/*
 * Tutoriel guidé de Forsa.
 *
 * Disponible pour tous les utilisateurs (nouveaux et anciens) via le bouton « Tutoriel » de la barre
 * du haut et l'entrée du menu latéral. Rien n'est lié au compte : le tutoriel peut être relancé à tout moment.
 * Chargé après app.js (utilise showPage, openSidebar, closeMenu et uiLang définis dans app.js).
 */
(function () {
  "use strict";

  const SEEN_KEY = "forsa_tutorial_seen";

  const STR = {
    fr: {
      skip: "Passer",
      back: "Précédent",
      next: "Suivant",
      finish: "Terminer",
      step: (n, total) => `Étape ${n} sur ${total}`,
      close: "Fermer le tutoriel",
      steps: {
        welcome: {
          title: "Bienvenue sur Forsa",
          text: "Forsa t'aide à trouver des entreprises qui peuvent recruter, puis à leur envoyer ta candidature. Ce tour rapide te montre où se trouve chaque chose.",
        },
        keywords: {
          title: "Écris tes mots-clés",
          text: "Une ligne correspond à une recherche, par exemple « agence web Marrakech ». Forsa interroge Google Places pour chacune et retire les doublons.",
        },
        search: {
          title: "Lance la recherche",
          text: "Choisis la langue et le pays juste au-dessus, puis clique ici. Les résultats arrivent en quelques secondes.",
        },
        results: {
          title: "Explore les résultats",
          text: "Passe du tableau à la carte, garde seulement les entreprises qui ont un email, ou exporte tout en CSV ou Excel.",
        },
        favorites: {
          title: "Garde tes favoris",
          text: "Clique sur l'étoile d'une entreprise pour la retrouver ici à tout moment, même après une nouvelle recherche.",
        },
        cv: {
          title: "Ajoute ton CV",
          text: "Téléverse un fichier ou fais-en générer un par l'IA. Il sert à écrire tes lettres de motivation et il est joint à tes candidatures.",
        },
        apply: {
          title: "Postule en quelques clics",
          text: "Dans le tableau, clique sur « Postuler » : l'IA rédige une lettre personnalisée que tu peux modifier, puis tu l'envoies par email ou tu l'enregistres pour plus tard.",
        },
        history: {
          title: "Retrouve tes candidatures",
          text: "L'historique liste les candidatures que tu as envoyées ou enregistrées, avec la date et l'entreprise.",
        },
        dashboard: {
          title: "Suis ton activité",
          text: "Le tableau de bord résume tes résultats, tes favoris et tes candidatures avec des graphiques.",
        },
        chatbot: {
          title: "Demande de l'aide à l'assistant",
          text: "Pose tes questions sur ton CV, ta lettre de motivation, tes entretiens ou ta stratégie de recherche.",
        },
        end: {
          title: "C'est parti !",
          text: "Tu peux relancer ce tutoriel à tout moment avec ce bouton.",
        },
      },
    },
    en: {
      skip: "Skip",
      back: "Back",
      next: "Next",
      finish: "Finish",
      step: (n, total) => `Step ${n} of ${total}`,
      close: "Close the tutorial",
      steps: {
        welcome: {
          title: "Welcome to Forsa",
          text: "Forsa helps you find companies that may be hiring, then send them your application. This quick tour shows you where everything is.",
        },
        keywords: {
          title: "Write your keywords",
          text: "One line is one search, for example “web agency Marrakech”. Forsa queries Google Places for each one and removes duplicates.",
        },
        search: {
          title: "Run the search",
          text: "Pick the language and country just above, then click here. Results show up in a few seconds.",
        },
        results: {
          title: "Explore the results",
          text: "Switch between the table and the map, keep only companies that have an email, or export everything to CSV or Excel.",
        },
        favorites: {
          title: "Keep your favorites",
          text: "Click the star on a company to find it here at any time, even after a new search.",
        },
        cv: {
          title: "Add your resume",
          text: "Upload a file or have the AI generate one. It is used to write your cover letters and is attached to your applications.",
        },
        apply: {
          title: "Apply in a few clicks",
          text: "In the table, click “Apply”: the AI writes a personalized letter you can edit, then you send it by email or save it for later.",
        },
        history: {
          title: "Find your applications",
          text: "The history lists the applications you have sent or saved, with the date and the company.",
        },
        dashboard: {
          title: "Track your activity",
          text: "The dashboard sums up your results, favorites and applications with charts.",
        },
        chatbot: {
          title: "Ask the assistant",
          text: "Ask about your resume, your cover letter, interviews or your job search strategy.",
        },
        end: {
          title: "You're all set!",
          text: "You can replay this tutorial at any time with this button.",
        },
      },
    },
  };

  // `side: true` = élément du menu latéral (sur téléphone, le menu doit être ouvert pour le montrer).
  const STEPS = [
    { id: "welcome" },
    { id: "keywords", target: "#queries" },
    { id: "search", target: "#submit-btn" },
    { id: "results", target: "section.results" },
    { id: "favorites", target: '.side-item[data-page="favorites"]', side: true },
    { id: "cv", target: "#cv-nav-btn" },
    { id: "apply" },
    { id: "history", target: '.side-item[data-page="history"]', side: true },
    { id: "dashboard", target: '.side-item[data-page="dashboard"]', side: true },
    { id: "chatbot", target: '.side-item[data-page="chatbot"]', side: true },
    { id: "end", target: "#tutorial-btn" },
  ];

  const SPOT_PAD = 8;
  let active = false;
  let index = 0;
  let els = null;
  let lastFocus = null;
  let openedSidebar = false;
  let currentTarget = null;
  let raf = 0;

  const lang = () => {
    try {
      return typeof uiLang !== "undefined" && uiLang === "en" ? "en" : "fr";
    } catch {
      return "fr";
    }
  };
  const sidebar = () => document.getElementById("sidebar");

  /* ---------- construction / destruction ---------- */

  function build() {
    const shield = document.createElement("div");
    shield.className = "tour-shield";

    const spot = document.createElement("div");
    spot.className = "tour-spot";
    spot.hidden = true;

    const card = document.createElement("div");
    card.className = "tour-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "tour-title");
    card.setAttribute("aria-describedby", "tour-text");
    card.innerHTML = `
      <div class="tour-progress" aria-hidden="true"><i></i></div>
      <div class="tour-body" aria-live="polite">
        <p class="tour-step"></p>
        <h2 class="tour-title" id="tour-title"></h2>
        <p class="tour-text" id="tour-text"></p>
      </div>
      <div class="tour-actions">
        <button type="button" class="tour-skip"></button>
        <button type="button" class="tour-btn tour-back"></button>
        <button type="button" class="tour-btn primary tour-next"></button>
      </div>`;

    document.body.append(shield, spot, card);
    els = {
      shield,
      spot,
      card,
      progress: card.querySelector(".tour-progress i"),
      step: card.querySelector(".tour-step"),
      title: card.querySelector(".tour-title"),
      text: card.querySelector(".tour-text"),
      skip: card.querySelector(".tour-skip"),
      back: card.querySelector(".tour-back"),
      next: card.querySelector(".tour-next"),
    };
    els.skip.addEventListener("click", close);
    els.back.addEventListener("click", () => go(index - 1));
    els.next.addEventListener("click", () => (index === STEPS.length - 1 ? close() : go(index + 1)));
  }

  function prepareApp() {
    // Ferme les fenêtres ouvertes et revient à l'accueil : toutes les étapes s'y trouvent.
    document.querySelectorAll(".view-page:not([hidden]) [data-close]").forEach((btn) => btn.click());
    try {
      if (typeof currentPage !== "undefined" && currentPage !== "home" && typeof showPage === "function") {
        showPage("home");
      }
      if (typeof closeMenu === "function") closeMenu();
    } catch {
      /* sans gravité : le tutoriel fonctionne aussi sans ça */
    }
    openedSidebar = false;
  }

  function start() {
    if (active) return;
    active = true;
    lastFocus = document.activeElement;
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* stockage indisponible : on ignore */
    }
    const dot = document.getElementById("tutorial-dot");
    if (dot) dot.hidden = true;

    prepareApp();
    build();
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    go(0);
  }

  function close() {
    if (!active) return;
    active = false;
    cancelAnimationFrame(raf);
    document.removeEventListener("keydown", onKey, true);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("scroll", schedule, true);
    if (els) {
      els.shield.remove();
      els.spot.remove();
      els.card.remove();
      els = null;
    }
    if (openedSidebar && typeof closeMenu === "function") closeMenu();
    openedSidebar = false;
    currentTarget = null;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  /* ---------- étapes ---------- */

  function sidebarIsHidden() {
    const el = sidebar();
    return !el || el.getBoundingClientRect().right <= 5;
  }

  function go(i) {
    if (!active) return;
    index = Math.max(0, Math.min(STEPS.length - 1, i));
    const step = STEPS[index];
    const L = STR[lang()];
    const copy = L.steps[step.id];

    els.step.textContent = L.step(index + 1, STEPS.length);
    els.title.textContent = copy.title;
    els.text.textContent = copy.text;
    els.skip.textContent = L.skip;
    els.skip.setAttribute("aria-label", L.close);
    els.back.textContent = L.back;
    els.back.hidden = index === 0;
    els.next.textContent = index === STEPS.length - 1 ? L.finish : L.next;
    els.progress.style.width = `${((index + 1) / STEPS.length) * 100}%`;

    // Menu latéral : sur téléphone il est caché, on l'ouvre seulement pour les étapes qui le montrent.
    let waitForSidebar = false;
    if (step.side && sidebarIsHidden() && typeof openSidebar === "function") {
      openSidebar();
      openedSidebar = true;
      waitForSidebar = true;
    } else if (!step.side && openedSidebar && typeof closeMenu === "function") {
      closeMenu();
      openedSidebar = false;
      waitForSidebar = true;
    }

    let target = step.target ? document.querySelector(step.target) : null;
    // Défilement vertical uniquement : un défilement horizontal décalerait le menu latéral.
    // Les étapes sans cible dans le contenu (menu, barre du haut, texte seul) ramènent la page en haut.
    const inContent = target && !target.closest("#sidebar, .nav");
    if (inContent) {
      const r = target.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) {
        window.scrollBy({ top: r.top + r.height / 2 - window.innerHeight / 2 });
      }
    } else {
      window.scrollTo({ top: 0 });
    }
    currentTarget = target;

    // On attend la fin de l'animation du menu avant de mesurer la position.
    window.setTimeout(() => {
      if (!active) return;
      layout();
      els.next.focus({ preventScroll: true });
    }, waitForSidebar ? 340 : 0);
  }

  /* ---------- positionnement ---------- */

  function targetRect() {
    if (!currentTarget || !document.body.contains(currentTarget)) return null;
    const r = currentTarget.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    if (r.right <= 0 || r.bottom <= 0 || r.left >= innerWidth || r.top >= innerHeight) return null;
    return r;
  }

  function layout() {
    if (!active || !els) return;
    const rect = targetRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // La carte est mesurée d'abord : sur téléphone elle occupe le bas de l'écran,
    // et la zone mise en avant ne doit pas passer dessous.
    const cardTop = placeCard(rect, vw, vh);

    if (rect) {
      // La zone mise en avant est limitée à l'écran (utile pour les grands blocs comme les résultats).
      const left = Math.max(6, rect.left - SPOT_PAD);
      const top = Math.max(6, rect.top - SPOT_PAD);
      const right = Math.min(vw - 6, rect.right + SPOT_PAD);
      let bottom = Math.min(vh - 6, rect.bottom + SPOT_PAD);
      if (cardTop !== null && rect.top < cardTop - 40) bottom = Math.min(bottom, cardTop - 10);
      Object.assign(els.spot.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${right - left}px`,
        height: `${Math.max(bottom - top, 24)}px`,
      });
      els.spot.hidden = false;
      els.shield.classList.remove("is-dim");
    } else {
      els.spot.hidden = true;
      els.shield.classList.add("is-dim");
    }
  }

  function placeCard(rect, vw, vh) {
    const card = els.card;
    const sheet = vw <= 560;
    card.classList.toggle("is-sheet", sheet);
    if (sheet) {
      card.style.left = "";
      card.style.top = "";
      return vh - 12 - card.offsetHeight;
    }

    const m = 14;
    const gap = 16;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const clampX = (x) => Math.max(m, Math.min(x, vw - cw - m));
    const clampY = (y) => Math.max(m, Math.min(y, vh - ch - m));
    let left;
    let top;

    if (!rect) {
      left = (vw - cw) / 2;
      top = (vh - ch) / 2;
    } else {
      const below = { left: clampX(rect.left + rect.width / 2 - cw / 2), top: rect.bottom + SPOT_PAD + gap };
      const above = { left: below.left, top: rect.top - SPOT_PAD - gap - ch };
      const right = { left: rect.right + SPOT_PAD + gap, top: clampY(rect.top + rect.height / 2 - ch / 2) };
      const leftSide = { left: rect.left - SPOT_PAD - gap - cw, top: right.top };
      const fits = {
        below: below.top + ch <= vh - m,
        above: above.top >= m,
        right: right.left + cw <= vw - m,
        left: leftSide.left >= m,
      };
      const order = STEPS[index].side ? ["right", "below", "above", "left"] : ["below", "above", "right", "left"];
      const pos = { below, above, right, left: leftSide };
      const pick = order.find((k) => fits[k]);
      if (pick) {
        left = pos[pick].left;
        top = pos[pick].top;
      } else {
        // Cible trop grande : la carte se pose en bas de l'écran.
        left = vw - cw - m;
        top = vh - ch - m;
      }
    }
    card.style.left = `${clampX(left)}px`;
    card.style.top = `${clampY(top)}px`;
    return null;
  }

  function schedule() {
    if (!active) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(layout);
  }

  /* ---------- clavier ---------- */

  function onKey(event) {
    if (!active) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      index === STEPS.length - 1 ? close() : go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "Tab") {
      // Le focus reste dans la carte du tutoriel.
      const items = [...els.card.querySelectorAll("button")].filter((b) => !b.hidden);
      const first = items[0];
      const last = items[items.length - 1];
      if (!els.card.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  /* ---------- initialisation ---------- */

  function init() {
    ["tutorial-btn", "menu-tutorial-btn"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", start);
    });

    // Petit point pulsé tant que l'utilisateur n'a jamais ouvert le tutoriel (utile pour les anciens comptes).
    const dot = document.getElementById("tutorial-dot");
    let seen = false;
    try {
      seen = !!localStorage.getItem(SEEN_KEY);
    } catch {
      seen = true;
    }
    if (dot && !seen) dot.hidden = false;
  }

  init();
  window.ForsaTutorial = { start, close };
})();
