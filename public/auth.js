/* Helpers partagés pour la session (token + utilisateur) et les appels API authentifiés. */

const PF_TOKEN_KEY = "places_finder_token";
const PF_USER_KEY = "places_finder_user";

function pfGetToken() {
  return localStorage.getItem(PF_TOKEN_KEY);
}

function pfGetUser() {
  try {
    return JSON.parse(localStorage.getItem(PF_USER_KEY) || "null");
  } catch {
    return null;
  }
}

function pfSaveSession(token, user) {
  localStorage.setItem(PF_TOKEN_KEY, token);
  localStorage.setItem(PF_USER_KEY, JSON.stringify(user));
}

function pfClearSession() {
  localStorage.removeItem(PF_TOKEN_KEY);
  localStorage.removeItem(PF_USER_KEY);
}

function pfRequireAuth() {
  if (!pfGetToken()) {
    window.location.replace("login.html");
  }
}

async function pfLogout() {
  const token = pfGetToken();
  pfClearSession();
  if (token) {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      /* on quitte quand même */
    }
  }
  window.location.replace("login.html");
}

/* Wrapper fetch qui ajoute le token et renvoie au login si la session est invalide. */
async function pfAuthFetch(url, options = {}) {
  const token = pfGetToken();
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` };
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    pfClearSession();
    window.location.replace("login.html");
    throw new Error("Session expirée.");
  }
  return response;
}

/* Extrait un message lisible d'une réponse d'erreur FastAPI (texte simple ou liste de validation). */
function pfErrorMessage(data, fallback) {
  if (data && typeof data.detail === "string") return data.detail;
  if (data && Array.isArray(data.detail) && data.detail.length) {
    return String(data.detail[0].msg || fallback).replace(/^Value error, /, "");
  }
  return fallback;
}

/* Compte à rebours sur un bouton "Renvoyer le code" (désactivé pendant `seconds`). */
function pfStartResendCountdown(button, seconds, label) {
  let remaining = seconds;
  button.disabled = true;
  button.textContent = `${label} (${remaining}s)`;
  const timer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(timer);
      button.disabled = false;
      button.textContent = label;
    } else {
      button.textContent = `${label} (${remaining}s)`;
    }
  }, 1000);
}
