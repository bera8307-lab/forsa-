"""Envoi des emails de vérification et de réinitialisation de mot de passe.

Deux modes d'envoi, choisis automatiquement (fichier .env ou variables de l'hébergeur) :

1. API Brevo (HTTPS) si BREVO_API_KEY est définie. À utiliser en ligne : les hébergeurs gratuits
   (Render…) bloquent les ports SMTP, mais pas HTTPS. Il faut aussi SMTP_FROM = une adresse
   expéditeur vérifiée dans Brevo.
2. SMTP classique sinon : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD et, en option, SMTP_FROM.
   Pratique sur ton PC avec un « mot de passe d'application » Gmail.

Les candidatures (documents.py) et les codes de vérification passent par la même fonction deliver().
"""

import base64
import html
import os
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import parseaddr
from typing import Optional

import requests

BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"


class MailError(Exception):
    """Erreur d'envoi, avec un message lisible par l'utilisateur."""

    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.status_code = status_code  # 500 = configuration manquante, 502 = échec côté fournisseur


def _address(header_value: Optional[str]) -> Optional[dict]:
    name, addr = parseaddr(header_value or "")
    if not addr:
        return None
    return {"email": addr, "name": name} if name else {"email": addr}


def _send_brevo(msg: EmailMessage, api_key: str) -> None:
    """Envoi par l'API HTTPS de Brevo (300 emails/jour gratuits)."""
    sender = _address(msg["From"])
    if not sender or not sender.get("email"):
        raise MailError("Expéditeur manquant : définis SMTP_FROM (adresse vérifiée dans Brevo).", 500)

    text_part = msg.get_body(preferencelist=("plain",))
    html_part = msg.get_body(preferencelist=("html",))
    payload = {
        "sender": sender,
        "to": [a for a in (_address(msg["To"]),) if a],
        "subject": str(msg["Subject"] or ""),
        "textContent": text_part.get_content() if text_part else "",
    }
    if html_part:
        payload["htmlContent"] = html_part.get_content()
    reply_to = _address(msg["Reply-To"])
    if reply_to:
        payload["replyTo"] = reply_to

    attachments = []
    for part in msg.iter_attachments():
        data = part.get_payload(decode=True) or b""
        attachments.append({
            "name": part.get_filename() or "piece-jointe",
            "content": base64.b64encode(data).decode("ascii"),
        })
    if attachments:
        payload["attachment"] = attachments

    try:
        response = requests.post(
            BREVO_ENDPOINT,
            json=payload,
            headers={"api-key": api_key, "accept": "application/json"},
            timeout=30,
        )
    except requests.RequestException as exc:
        raise MailError(f"Échec de l'envoi de l'email : {exc}") from exc

    if response.status_code in (401, 403):
        raise MailError("Brevo a refusé la clé API (BREVO_API_KEY incorrecte ou sans droit d'envoi).")
    if not response.ok:
        try:
            detail = response.json().get("message") or response.text
        except ValueError:
            detail = response.text
        raise MailError(f"Brevo a refusé l'email ({response.status_code}) : {str(detail)[:300]}")


def _send_smtp(msg: EmailMessage) -> None:
    host = os.getenv("SMTP_HOST")
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    if not (host and user and password):
        raise MailError(
            "Envoi d'email non configuré. Ajoute BREVO_API_KEY + SMTP_FROM (en ligne) "
            "ou SMTP_HOST, SMTP_USER et SMTP_PASSWORD (sur ton PC) dans le fichier .env.",
            500,
        )
    port = int(os.getenv("SMTP_PORT", "587"))
    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context(), timeout=30) as server:
                server.login(user, password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(host, port, timeout=30) as server:
                server.starttls(context=ssl.create_default_context())
                server.login(user, password)
                server.send_message(msg)
    except smtplib.SMTPAuthenticationError as exc:
        raise MailError(
            "Connexion SMTP refusée (identifiants incorrects). Avec Gmail, utilise un « mot de passe d'application »."
        ) from exc
    except (smtplib.SMTPException, OSError) as exc:
        raise MailError(f"Échec de l'envoi de l'email : {exc}") from exc


def deliver(msg: EmailMessage) -> None:
    """Envoie un message déjà construit : API Brevo si BREVO_API_KEY existe, sinon SMTP."""
    api_key = (os.getenv("BREVO_API_KEY") or "").strip()
    if api_key:
        _send_brevo(msg, api_key)
    else:
        _send_smtp(msg)


def default_from_address() -> str:
    """Adresse expéditeur : SMTP_FROM, sinon SMTP_USER."""
    return os.getenv("SMTP_FROM") or os.getenv("SMTP_USER") or ""


def send_email(to_addr: str, subject: str, text_body: str, html_body: str) -> None:
    from_addr = default_from_address()
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"Forsa <{from_addr}>"
    msg["To"] = to_addr
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")
    deliver(msg)


def _render(title: str, intro: str, code: str, minutes: int, footer: str) -> tuple[str, str]:
    """Retourne (texte brut, HTML) pour un email contenant un code à 6 chiffres."""
    text = f"{title}\n\n{intro}\n\nCode : {code}\n\nCe code expire dans {minutes} minutes.\n\n{footer}\n"
    html_body = f"""\
<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1b1f27">
  <h2 style="margin:0 0 12px">{html.escape(title)}</h2>
  <p style="line-height:1.5">{html.escape(intro)}</p>
  <p style="font-size:34px;font-weight:700;letter-spacing:8px;text-align:center;background:#f3f4f8;
            border-radius:10px;padding:16px;margin:20px 0">{html.escape(code)}</p>
  <p style="color:#555;font-size:14px">Ce code expire dans {minutes} minutes.</p>
  <p style="color:#888;font-size:13px;line-height:1.5">{html.escape(footer)}</p>
</div>"""
    return text, html_body


def send_verification_code(to_addr: str, first_name: str, code: str, minutes: int) -> None:
    title = "Vérifie ton adresse email"
    intro = f"Bonjour {first_name}, voici ton code pour activer ton compte Forsa."
    footer = "Si tu n'as pas créé de compte Forsa, ignore simplement cet email."
    text, html_body = _render(title, intro, code, minutes, footer)
    send_email(to_addr, "Ton code de vérification Forsa", text, html_body)


def send_reset_code(to_addr: str, first_name: str, code: str, minutes: int) -> None:
    title = "Réinitialisation du mot de passe"
    intro = f"Bonjour {first_name}, voici ton code pour choisir un nouveau mot de passe Forsa."
    footer = "Si tu n'as pas demandé cette réinitialisation, ignore cet email : ton mot de passe ne change pas."
    text, html_body = _render(title, intro, code, minutes, footer)
    send_email(to_addr, "Ton code de réinitialisation Forsa", text, html_body)
