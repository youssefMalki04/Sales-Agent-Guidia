# Doc5 Documentation Technique Guidia

Source PDF: doc5-documentation-technique-guidia.pdf

## Page 1

Guidia — Documentation technique
Doc  5  —  Documentation  technique  du
projet
Guides /docs/* + docs internes FR + SDK skills
Sources extraites du dépôt support-ia :
  • frontend/src/lib/i18n/fr/docsPayload.ts
  • docs/CSP-REQUIREMENTS.fr.md
  • docs/DEPLOY-HARDENING.fr.md
  • docs/EMBEDDED_APP_USER_IDENTITY.fr.md
  • docs/GUIDIA-FONCTIONNALITES.fr.md
  • docs/GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md
  • docs/USER-TOKEN.fr.md
  • sdk/skills/README.md
  • sdk/skills/SKILL.md
Document généré automatiquement — contenu strictement issu des pages marketing, de la documentation
développeur et des migrations de référence. Rien n'est inventé.
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.1

## Page 2

Guidia — Documentation technique
Index documentation publique — /docs
Tout ce qu'il faut pour intégrer le widget Guidia dans votre produit en moins de 15 minutes.
  • /docs/install — Installation : Snippet HTML, paramètres data-*, vérification console.
  • /docs/native-actions — Actions natives : Actions métier JavaScript côté page hôte.
  • /docs/user-token — Auth utilisateur (JWT) : Utilisateur connecté et actions sensibles.
  • /docs/csp — Content-Security-Policy : Domaines et directives CSP.
  •  /docs/tour-studio-bundle  —  Import  /  Export  workflows  :  Bundles  JSON,  meta.coverage,
@guidia/skills.
Contenu docsPayload.ts — pages /docs (résumé)
Le  détail  complet  de  chaque  page  (snippets  code,  listes  paramètres)  est  dans  docsPayload.ts  et
reproduit dans les fichiers .fr.md correspondants ci-dessous.
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.2

## Page 3

Guidia — Documentation technique
CSP-REQUIREMENTS.fr.md
Directives CSP requises par le widget Guidia
Si votre site applique une **Content-Security-Policy** stricte, ajoutez les
directives suivantes pour permettre au widget Guidia de fonctionner.
Référence actuelle du déploiement public :
  • chargeur : `https://share.guidia.dev`
  • API : `https://guidia.dev`
Adaptez ces hôtes si votre instance utilise d'autres noms (staging, auto-hébergement).
Directives minimales
| Directive | Valeur à ajouter | Pourquoi |
|---|---|---|
|  `script-src`  |  `https://share.guidia.dev`  `'unsafe-inline'`  |  Charger  `loader.js`  et  les  bundles.
`unsafe-inline`  peut  être  requis  pour  le  bootstrap  inline  `window.GuidiaConfig`.  Sinon  utilisez  un
nonce (voir plus bas). |
| `style-src` | `'unsafe-inline'` | Le widget injecte ses styles dans son **Shadow DOM** (encapsulé)
via balise `<style>`. Aucune fuite vers la page hôte. |
| `connect-src` | `https://guidia.dev` `https://share.guidia.dev` | Appels REST et assets chargés par
le widget. |
|  `img-src`  |  `'self'`  `data:`  `blob:`  `https://guidia.dev`  `https://share.guidia.dev`  |  Images  et
captures servies par le widget. |
| `media-src` | `blob:` | Lecture audio côté navigateur. |
| `worker-src` | `'self'` `blob:` | Le rendu 3D peut utiliser un worker. |
| `font-src` | `data:` | Polices inline. |
Exemple complet (en-tête HTTP)
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://share.guidia.dev 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://guidia.dev https://share.guidia.dev;
  font-src 'self' data:;
  connect-src 'self' https://guidia.dev https://share.guidia.dev;
  media-src 'self' blob:;
  worker-src 'self' blob:;
  object-src 'none';
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.3

## Page 4

Guidia — Documentation technique
Variante avec nonce (sans `'unsafe-inline'`)
Si votre politique sécurité interdit `'unsafe-inline'` :
  • 1. Générez un nonce par requête (`abc123`)
  • 2. Mettez le nonce dans la CSP : `script-src 'self' https://share.guidia.dev 'nonce-abc123'`
  • 3. Ajoutez `nonce="abc123"` au `<script src="loader.js">`
  • 4. Le bundle widget propage automatiquement le nonce aux scripts qu'il injecte.
Domaines à prévoir
| Service | Origine | Quand |
|---|---|---|
| Chargeur widget | `https://share.guidia.dev` | Toujours |
| API | `https://guidia.dev` | Toujours |
Côté API Guidia (CORS)
Le widget envoie ses requêtes depuis votre domaine vers l'API Guidia. L'API vérifie votre domaine
via  le  champ  `apps.allowed_domains`  (configurable  dans  l'admin  Guidia).  Si  vous  obtenez  une
**erreur 403 `origin_not_allowed`** :
  • 1. Ouvrez l'admin Guidia → Apps → votre app → "Domaines autorisés"
  • 2. Ajoutez votre domaine sans le `https://`, par exemple `app.acme.com`
  • 3. Wildcard supporté : `*.acme.com`
  • 4. Le cache se rafraîchit automatiquement sous 60 s
Diagnostic des erreurs courantes
| Erreur console | Cause | Fix |
|---|---|---|
|  `Refused  to  load  script  'https://share.guidia.dev/loader.js'`  |  `script-src`  manque
`https://share.guidia.dev` | Ajouter à la CSP |
| `403 origin_not_allowed` | Domaine non listé côté Guidia | Liste dans l'admin |
|  `Refused  to  apply  inline  style`  |  `style-src`  n'a  pas  `'unsafe-inline'`  |  Ajouter  (le  Shadow  DOM
isole) |
| `WebGL unavailable, voice-only fallback` | Pas WebGL dispo | Comportement attendu, le widget
peut continuer en voix seule |
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.4

## Page 5

Guidia — Documentation technique
DEPLOY-HARDENING.fr.md
Guide  de  durcissement  deploiement  —  Guidia  10k
clients
> Ce guide reprend les actions infra qui ne sont pas du code applicatif mais
> qui doivent etre realisees avant de claim "10k clients, zero fuite,
> isolation 100%". Pour le statut detaille de chaque chantier (code applicatif,
> migrations SQL, env vars), voir aussi `docs/SECURITY-CHECKLIST.fr.md`.
---
1. Variables d'environnement obligatoires en production
Sans ces variables, plusieurs garde-fous applicatifs tombent en no-op
silencieux ou crashent au boot.
| Variable | Effet si absente | Comment generer |
|---|---|---|
| `APP_ENCRYPTION_KEYS` | `RuntimeError` au premier `seal_string` (boot crash) | `python -c "from
cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"` |
| `SENTRY_DSN` | `capture_exception` ne fait que logger localement | Projet Sentry -> Settings ->
Client Keys (DSN) |
|  `TURNSTILE_SECRET_KEY`  +  `TURNSTILE_SITE_KEY`  |  CAPTCHA  en  mode  no-op  :  tous  les  bots
avec score 80-100 passent | Cloudflare Turnstile dashboard |
|  `S3_KMS_KEY_ID`  |  SSE  retombe  sur  AES256  S3-managed  (acceptable  mais  sans  CloudTrail
rotation) | KMS console |
Apres deploiement, executer **UNE FOIS** :
cd backend
APP_ENCRYPTION_KEYS=<fernet-key> ./.venv/bin/python scripts/encrypt_existing_secrets.py
Ce script chiffre les lignes existantes dans `tool_credentials`,
`tool_oauth_connections.access_token`, `tool_oauth_connections.refresh_token`
et `apps.user_token_secret` (chantier 10).
---
2. Sticky sessions pour la WebSocket Gemini Live
Le WebSocket `/api/live/ws` maintient un etat applicatif en memoire pendant
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.5

## Page 6

Guidia — Documentation technique
toute la duree de la session (locks asyncio, `pending_client_requests`, dedup
`emitted_model_texts`). Si on scale horizontalement et qu'un client se
reconnecte sur un autre pod, l'etat est perdu et la session est cassee.
Solution la plus simple : **sticky sessions cote LB**.
Snippet Nginx (cookie-based)
upstream guidia_api {
    # ip_hash garantit la stabilite mais bloque le re-balance ;
    # on prefere le cookie route persistant.
    hash $cookie_GUIDIA_ROUTE consistent;
    server api-pod-1:8111;
    server api-pod-2:8111;
    server api-pod-3:8111;
    server api-pod-4:8111;
}
server {
    listen 443 ssl http2;
    server_name api.guidia.dev;
    # ----------------------------------------------------------
    # WebSocket : DESACTIVER tous les buffering / proxy_buffering
    # Sans ca, latence audio bidir = +500ms a +2s par tour.
    # ----------------------------------------------------------
    location /api/live/ws {
        proxy_pass http://guidia_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_buffering off;
        proxy_request_buffering off;
        # Pose le cookie de routage la premiere fois.
        add_header Set-Cookie "GUIDIA_ROUTE=$remote_addr; Path=/; HttpOnly; SameSite=Lax" always;
    }
    # ----------------------------------------------------------
    # HTTP normal : on n'a pas besoin de sticky.
    # ----------------------------------------------------------
    location / {
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.6

## Page 7

Guidia — Documentation technique
        proxy_pass http://guidia_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
Alternative : ALB AWS
Activer "Stickiness" sur le target group avec un cookie applicatif
`GUIDIA_ROUTE` et une duree de 8h (= `SESSION_TTL_SECONDS` cote backend).
Alternative stateless (long terme)
Migrer l'etat WS vers Redis pub-sub (canaux `ws:<session_id>`) pour permettre
le re-balance sans sticky. Boulot d'1-2 jours, a faire quand > 8 pods.
---
3. PgBouncer en mode transaction
A 10k clients avec WS persistants, Supabase epuise rapidement son pool par
defaut (60-100 connexions). On met PgBouncer devant en mode `transaction`
pour partager le pool entre tous les pods.
Configuration `pgbouncer.ini`
[databases]
postgres = host=db.<projet>.supabase.co port=5432 dbname=postgres
[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_user = pgbouncer
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
# 10k clients * 2 connexions average / 200 backend conns = 100x multiplexing
max_client_conn = 10000
default_pool_size = 50          ; par (db, user) actif
reserve_pool_size = 10
reserve_pool_timeout = 3
# Timeouts : on coupe vite les connexions zombies.
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.7

## Page 8

Guidia — Documentation technique
server_idle_timeout = 60
client_idle_timeout = 0          ; geo par les WS applicatives
# Logs / stats : utile pour Datadog/Grafana.
stats_users = monitor
log_connections = 1
log_disconnections = 1
Cote backend FastAPI
Dans `core/supabase_service.py`, pointer sur le port PgBouncer (`6432`)
plutot que directement sur Supabase. Si vous utilisez le SDK Supabase, le
`postgres-meta` reste sur le port direct (DDL incompatible avec
transaction-mode), mais toutes les queries CRUD passent par PgBouncer.
**Important** : `pool_mode=transaction` interdit `SET LOCAL`, advisory locks
qui survivent a la transaction et certaines features prepare statements
implicites (asyncpg les genere par defaut). Pour `asyncpg`/`psycopg`, set
`statement_cache_size=0`.
Sizing recommande pour 10k clients
| Element | Valeur |
|---|---|
| FastAPI pods | 4 a 8 |
| Connexions par pod | 50 |
| PgBouncer `default_pool_size` | 50 |
| `max_client_conn` | 10000 |
| Supabase pool backend | 200 (cote Supabase via support) |
| Reserve | 25% |
---
4. CSP frontend Next.js avec nonces
Le `next.config.js` actuel autorise `script-src 'unsafe-inline' 'unsafe-eval'`
pour rester compatible avec le runtime Next.js par defaut. C'est une
porte ouverte au XSS.
Solution propre : generer un nonce par requete via un middleware Next.js et
ne whiter que ce nonce.
`frontend/middleware.ts`
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.8

## Page 9

Guidia — Documentation technique
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  // Nonce aleatoire base64, 16 bytes = 22 chars b64.
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("base64");
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`,
    `style-src 'self' 'unsafe-inline'`, // styled-components / tailwind JIT
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' https://*.guidia.dev wss://*.guidia.dev https://*.supabase.co`,
    `frame-src https://challenges.cloudflare.com`,
    `worker-src 'self' blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
Cote layout
Recuperer le nonce et le forwarder a `<Script nonce={...}>` et aux balises
inline qu'on ne peut pas eliminer (preload data injecte par Next.js) :
import { headers } from "next/headers";
export default async function RootLayout({ children }) {
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.9

## Page 10

Guidia — Documentation technique
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html>
      <head>{nonce && <meta name="csp-nonce" content={nonce} />}</head>
      <body>{children}</body>
    </html>
  );
}
Garder `'unsafe-inline'` sur `style-src` uniquement (Tailwind JIT en a besoin
pour les classes dynamiques). Tout le reste passe par nonces.
---
5. Cloudflare devant Nginx
Recommande pour 10k clients : on a Cloudflare en proxy (orange-cloud) qui
filtre 80% des bots a l'edge avant qu'ils ne consomment du CPU/IO sur les
pods.
Reglages a appliquer :
| Section | Reglage | Valeur |
|---|---|---|
| Security -> WAF | Managed Rules | Activer Cloudflare Managed Ruleset |
| Security -> Bots | Bot Fight Mode | ON (gratuit) ou Super Bot Fight Mode (Pro) |
| Security -> Rate Limiting | `/widget/message` | 60 req/min/IP |
| Security -> Rate Limiting | `/widget/lead-capture` | 5 req/min/IP |
| Security -> Rate Limiting | `/oauth/*` | 20 req/min/IP |
| Rules -> Page Rules | Cache Level | Bypass sur `/api/*`, Standard sinon |
| Network | WebSockets | ON |
| SSL/TLS | Mode | Full (Strict) |
---
6. Checklist pre-prod
  • [ ] `APP_ENCRYPTION_KEYS` pose en prod (multi-keys si rotation)
  • [ ] `SENTRY_DSN` pose et test ping recu
  • [ ] `TURNSTILE_SECRET_KEY` + `TURNSTILE_SITE_KEY` poses
  • [ ] Script `encrypt_existing_secrets.py` execute (verifier les compteurs `encrypted` > 0)
  • [ ] Migrations SQL `00102 / 00103 / 00104` appliquees
  • [ ] Nginx config avec sticky cookie sur `/api/live/ws`
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.10

## Page 11

Guidia — Documentation technique
  • [ ] PgBouncer en transaction-mode (port 6432) entre l'API et Supabase
  • [ ] CSP nonces sur Next.js (middleware.ts en place)
  • [ ] Cloudflare en proxy + WAF + rate-limit
  • [ ] `GEMINI_LIVE_MAX_SESSION_SECONDS` ajuste si necessaire (defaut 3600s)
  • [ ] Watchdog credits actif (test : invalider un credit en BDD pendant une session live et verifier la
fermeture WS)
  •  [  ]  Tests  pytest  verts  :  `cd  backend  &&  .venv/bin/python  -m  pytest  tests/test_crypto.py
tests/test_url_safety.py tests/test_agent_isolation.py tests/test_captcha_guard.py`
---
7. Tests de charge (a faire avant 10k)
# Locust : 1000 utilisateurs simultanes sur /widget/message
locust -f load/widget_message.py --users 1000 --spawn-rate 50 --host https://api.guidia.dev
# k6 : burst WS Gemini Live
k6 run load/ws_live.js --vus 200 --duration 5m
Cibles a verifier sous charge :
  • P95 `/widget/message` < 800ms
  • P95 `/knowledge/search` < 400ms
  • 0 erreurs 5xx sur 5 minutes
  • Memoire pod stable sur 30 min (pas de leak)
  • PgBouncer `cl_active` < `max_client_conn * 0.7`
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.11

## Page 12

Guidia — Documentation technique
EMBEDDED_APP_USER_IDENTITY.fr.md
Identifier  le  user  connecté  dans  l'app  SaaS  —  guide
intégrateur
> Comment passer automatiquement `id`, `nom`, `prénom`, `email`, `rôle` du user
> déjà connecté dans **votre** app à Guidia, sans formulaire pré-chat ?
>
> Réponse : un JWT court signé côté votre backend, propagé au widget en une
> ligne. C'est générique (n'importe quel stack), sécurisé, et automatique.
TL;DR
Le widget Guidia tourne dans **deux modes** :
| Mode | Public visé | Identité utilisateur |
|---|---|---|
| `showcase` | Visiteur anonyme sur site vitrine | Formulaire pré-chat (email/nom saisis) |
| `embedded_app` | User connecté de votre SaaS | `user_token` JWT signé par votre backend |
En mode `embedded_app`, l'intégrateur (vous) doit développer **2 petites
choses** :
  • 1. **Backend** — un endpoint qui signe un JWT avec `apps.user_token_secret`.
  • 2. **Frontend** — un appel à cet endpoint pour injecter le token dans le
widget via `data-user-token` ou `window.guidia.setUserToken(token)`.
Le SDK Guidia fournit la primitive de signature ; pour les stacks non
couverts, c'est un JWT HS256 standard de ~10 lignes.
À la première interaction, Guidia upserte automatiquement un
`visitor_profile` indexé sur `(tenant_id, app_id, external_user_id)`. Toutes
les conversations / sessions / statistiques sont rattachées à ce profil.
Schéma de flux
sequenceDiagram
    participant U as User connecté (browser)
    participant CF as Frontend client
    participant CB as Backend client
    participant W as Widget Guidia (loader.js)
    participant G as Guidia API
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.12

## Page 13

Guidia — Documentation technique
    U->>CF: Ouvre votre app SaaS
    CF->>CB: GET /api/guidia/token (cookie session)
    CB->>CB: issue_user_token(sub=user.id, name, email, role)
    CB-->>CF: { user_token, expires_in }
    CF->>W: <script data-user-token="...">
    W->>G: POST /api/widget/bootstrap?user_token=...
    G->>G: verify_user_token + upsert visitor_profile
    G-->>W: { session_id, user: { id, verified: true }, ... }
    Note over G: /admin/conversations affiche maintenant<br/>name + email + role du user
Étape 1 — Récupérer `user_token_secret`
Côté admin Guidia (UI), section App → **User token secret**. Ou en CLI :
curl https://guidia.dev/api/widget/apps/{APP_ID}/user-token-secret \
  -H "Authorization: Bearer $ADMIN_TOKEN"
Stockez le secret côté backend (`GUIDIA_USER_TOKEN_SECRET`). **Jamais dans
le navigateur.**
Étape 2 — Signer un user_token côté backend
Le payload JWT attendu :
{
  "kind": "guidia.user.v1",
  "iss": "guidia-client-sdk",
  "app_id": "<uuid>",
  "tenant_id": "<uuid>",
  "sub": "<id user dans votre SaaS>",
  "email": "user@client.com",
  "name": "Jean Dupont",
  "role": "manager",
  "locale": "fr",
  "iat": 1700000000,
  "exp": 1700000900
}
`sub` est obligatoire — c'est lui qui sert de clé d'identité forte
(`external_user_id`) côté Guidia. Tous les autres champs sont optionnels
mais recommandés pour que l'admin voie tout de suite à qui il parle.
Node.js / Express
npm install file:./sdk/node  # ou copier sdk/node/guidia-sdk.js
const { issueUserToken } = require("@guidia/sdk");
app.get("/api/guidia/token", requireAuth, (req, res) => {
  const token = issueUserToken({
    secret:   process.env.GUIDIA_USER_TOKEN_SECRET,
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.13

## Page 14

Guidia — Documentation technique
    appId:    process.env.GUIDIA_APP_ID,
    tenantId: process.env.GUIDIA_TENANT_ID,
    sub:      req.user.id,
    name:     `${req.user.firstName} ${req.user.lastName}`,
    email:    req.user.email,
    role:     req.user.role,
    locale:   req.user.locale || "fr",
    ttlSeconds: 900,
  });
  res.json({ user_token: token, expires_in: 900 });
});
Python / FastAPI
from guidia_sdk import GuidiaTokenIssuer
issuer = GuidiaTokenIssuer(
    secret=settings.GUIDIA_USER_TOKEN_SECRET,
    app_id=settings.GUIDIA_APP_ID,
    tenant_id=settings.GUIDIA_TENANT_ID,
)
@app.get("/api/guidia/token")
def guidia_token(user=Depends(current_user)):
    return issuer.for_user(
        user.id,
        name=f"{user.first_name} {user.last_name}",
        email=user.email,
        role=user.role,
        locale=user.locale or "fr",
    )
Python / Django
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from guidia_sdk import issue_user_token
@login_required
def guidia_token(request):
    token = issue_user_token(
        secret=settings.GUIDIA_USER_TOKEN_SECRET,
        app_id=settings.GUIDIA_APP_ID,
        tenant_id=settings.GUIDIA_TENANT_ID,
        sub=str(request.user.id),
        name=request.user.get_full_name(),
        email=request.user.email,
        role=request.user.groups.first().name if request.user.groups.exists() else None,
    )
    return JsonResponse({"user_token": token, "expires_in": 900})
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.14

## Page 15

Guidia — Documentation technique
PHP / Laravel (pas de SDK, JWT direct)
// app/Http/Controllers/GuidiaController.php
use Illuminate\Support\Facades\Auth;
public function token() {
    $user = Auth::user();
    $now = time();
    $payload = [
        'kind'      => 'guidia.user.v1',
        'iss'       => 'guidia-client-sdk',
        'app_id'    => env('GUIDIA_APP_ID'),
        'tenant_id' => env('GUIDIA_TENANT_ID'),
        'sub'       => (string) $user->id,
        'name'      => $user->name,
        'email'     => $user->email,
        'role'      => $user->role,
        'locale'    => $user->locale ?? 'fr',
        'iat'       => $now,
        'exp'       => $now + 900,
    ];
    $b64 = fn($d) => rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
    $h = $b64(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $p = $b64(json_encode($payload));
    $s = $b64(hash_hmac('sha256', "$h.$p", env('GUIDIA_USER_TOKEN_SECRET'), true));
    return response()->json(['user_token' => "$h.$p.$s", 'expires_in' => 900]);
}
Ruby on Rails
# Gemfile : gem 'jwt'
class GuidiaController < ApplicationController
  before_action :authenticate_user!
  def token
    payload = {
      kind:      'guidia.user.v1',
      iss:       'guidia-client-sdk',
      app_id:    ENV['GUIDIA_APP_ID'],
      tenant_id: ENV['GUIDIA_TENANT_ID'],
      sub:       current_user.id.to_s,
      name:      current_user.full_name,
      email:     current_user.email,
      role:      current_user.role,
      locale:    I18n.locale.to_s,
      iat:       Time.now.to_i,
      exp:       Time.now.to_i + 900,
    }
    token = JWT.encode(payload, ENV['GUIDIA_USER_TOKEN_SECRET'], 'HS256')
    render json: { user_token: token, expires_in: 900 }
  end
end
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.15

## Page 16

Guidia — Documentation technique
Autres stacks (Go, Java, .NET, ...)
C'est un JWT HS256 standard avec les claims listés plus haut. Toutes les
libs JWT du marché conviennent :
  • Go : `github.com/golang-jwt/jwt/v5`
  • Java : `com.auth0:java-jwt`
  • .NET : `System.IdentityModel.Tokens.Jwt`
  • Rust : `jsonwebtoken`
Étape 3 — Injecter le token côté frontend
Option A — Injection avant chargement du widget (recommandé)
<script>
  // Fetch le token AVANT de charger le widget pour qu'il parte avec le
  // bootstrap initial. Cookie de session envoyé automatiquement.
  fetch("/api/guidia/token", { credentials: "same-origin" })
    .then((r) => r.json())
    .then(({ user_token }) => {
      const s = document.createElement("script");
      s.src = "https://share.guidia.dev/loader.js";
      s.async = true;
      s.dataset.appId = "VOTRE_APP_ID";
      s.dataset.token = "VOTRE_WIDGET_TOKEN";
      s.dataset.userToken = user_token;
      s.dataset.deploymentMode = "embedded_app";
      document.head.appendChild(s);
    });
</script>
Option B — Widget déjà chargé, refresh à chaud
Le widget expose `window.guidia.setUserToken(...)` pour un refresh sans
rechargement de page :
setInterval(async () => {
  const { user_token } = await (await fetch("/api/guidia/token")).json();
  window.guidia.setUserToken(user_token);
}, 14 * 60 * 1000); // refresh 1 min avant expiration
Côté framework SPA
// React / Next.js — hook une seule fois après login
useEffect(() => {
  if (!session?.user) return;
  fetch("/api/guidia/token")
    .then((r) => r.json())
    .then(({ user_token }) => window.guidia?.setUserToken(user_token));
}, [session?.user?.id]);
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.16

## Page 17

Guidia — Documentation technique
Étape 4 — Vérification dans l'admin Guidia
Aller dans `/admin/conversations`, sélectionner votre app :
  • Chaque conversation affiche maintenant `name` et `email` du user connecté.
  • Le `role` est stocké et utilisable pour filtrer / segmenter.
  • Le profil visiteur (clic sur la conversation) montre `external_user_id`.
Si vous voyez « Unknown » → vérifier dans la console réseau que le widget
appelle bien `/api/widget/bootstrap?...&user_token=eyJhbGciOi...`. Si le
paramètre `user_token` est absent, c'est que `data-user-token` n'a pas été
posé sur le script loader.
Cycle de vie & sécurité
  • **TTL court** (15 min par défaut, configurable via `ttl_seconds`).
Refresh côté front via `setUserToken(...)`.
  • **Le secret ne quitte jamais votre backend**. Si fuite, rotation
instantanée via `POST /api/widget/apps/{id}/user-token-secret/regenerate`
— tous les tokens en circulation deviennent invalides.
  • **Aucun appel à Guidia pour signer**. La signature est 100 % locale, vous
pouvez émettre autant de tokens que vous voulez, sans rate-limit.
  • **Origines** : le `allowed_domains` de l'app reste actif. Le user_token ne
contourne pas le CSP des origines.
Différence avec le mode `showcase`
| | `showcase` | `embedded_app` |
|---|---|---|
| Quand l'utiliser | Site vitrine public | App SaaS authentifiée |
| Identité visiteur | Form pré-chat (email/nom) | `user_token` JWT |
| Clé `visitor_profiles` | `fingerprint` browser | `(tenant_id, app_id, external_user_id)` |
| Anonyme possible ? | Oui (peut refuser de remplir) | Non (token obligatoire pour identifier) |
| Actions sensibles | Non (pas de garantie d'identité) | Oui (token JWT vérifié) |
Note : un widget peut être déployé dans les deux modes simultanément (même
app, embeds différents). Le `data-deployment-mode` du loader permet de
forcer un mode quand `widget_configs.deployment_mode` ne suffit pas.
Voir aussi
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.17

## Page 18

Guidia — Documentation technique
  • [USER-TOKEN.fr.md](USER-TOKEN.fr.md) — référence détaillée du protocole.
  • [sdk/node/README.md](../sdk/node/README.md) — SDK Node.
  • [sdk/python/README.md](../sdk/python/README.md) — SDK Python.
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.18

## Page 19

Guidia — Documentation technique
USER-TOKEN.fr.md
user_token Guidia — guide d'intégration FR
Pourquoi un user_token ?
Le `widget_token` (dans `data-token`) est **public** : il identifie votre app
mais pas l'utilisateur final. Pour les actions sensibles (créer une facture,
exporter des données, modifier des paramètres), Guidia a besoin de savoir
QUI déclenche l'action et qu'il est authentifié chez vous.
C'est le rôle du `user_token` : un JWT HS256 court (15 min) signé par votre
backend avec un secret partagé avec Guidia.
Architecture
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│ Browser user │────▶│ Backend client  │────▶│ Guidia API   │
│  (votre SaaS)│     │  signe JWT avec │     │  vérifie JWT │
│              │     │  user_token_    │     │  avec même   │
│              │     │  secret         │     │  secret      │
└──────────────┘     └─────────────────┘     └──────────────┘
       ▲                                              │
       │     Widget Guidia (propage le token dans     │
       └────────  data-user-token vers Guidia)  ◀─────┘
Étape 1 — Récupérer le secret (une seule fois)
Côté admin Guidia :
curl https://guidia.dev/api/widget/apps/{APP_ID}/user-token-secret \
  -H "Authorization: Bearer $ADMIN_TOKEN"
Réponse :
{
  "app_id": "...",
  "user_token_secret": "abc123...",
  "algorithm": "HS256",
  "default_ttl_seconds": 900
}
Stockez ce secret en variable d'environnement de votre backend
(`GUIDIA_USER_TOKEN_SECRET`). **JAMAIS dans le browser.**
Étape 2 — Signer un token côté backend
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.19

## Page 20

Guidia — Documentation technique
Node.js
const { issueUserToken } = require("@guidia/sdk");
app.get("/api/guidia/token", requireAuth, (req, res) => {
  const token = issueUserToken({
    secret: process.env.GUIDIA_USER_TOKEN_SECRET,
    appId: process.env.GUIDIA_APP_ID,
    tenantId: process.env.GUIDIA_TENANT_ID,
    sub: req.user.id,
    role: req.user.role,
    email: req.user.email,
    locale: req.user.locale,
  });
  res.json({ user_token: token, expires_in: 900 });
});
Python (FastAPI)
from guidia_sdk import GuidiaTokenIssuer
issuer = GuidiaTokenIssuer(
    secret=settings.GUIDIA_USER_TOKEN_SECRET,
    app_id=settings.GUIDIA_APP_ID,
    tenant_id=settings.GUIDIA_TENANT_ID,
)
@app.get("/api/guidia/token")
def guidia_token(user=Depends(current_user)):
    return issuer.for_user(user.id, role=user.role, email=user.email)
Étape 3 — Propager au widget côté front
<script>
  fetch("/api/guidia/token")
    .then((r) => r.json())
    .then(({ user_token }) => {
      // Le widget peut être chargé après — on injecte juste avant.
      const s = document.querySelector('script[src*="loader.js"]');
      if (s) s.setAttribute("data-user-token", user_token);
      // Refresh toutes les 14 min (token expire en 15 min)
      setTimeout(() => window.location.reload(), 14 * 60 * 1000);
    });
</script>
<script
  src="https://share.guidia.dev/loader.js"
  data-app-id="..."
  data-token="..."
  defer
></script>
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.20

## Page 21

Guidia — Documentation technique
Étape 4 — Marquer une action native comme "sensible"
Dans l'admin Guidia → Actions natives → édit → cocher
**"Requires user_token"**.
Désormais, tout appel `call_native_action(my_action, ...)` sera refusé si
le user_token n'est pas valide.
Rotation du secret
En cas de fuite :
curl -X POST https://guidia.dev/api/widget/apps/{APP_ID}/user-token-secret/regenerate \
  -H "Authorization: Bearer $ADMIN_TOKEN"
Tous les user_tokens en circulation deviennent invalides immédiatement.
Updatez `GUIDIA_USER_TOKEN_SECRET` dans votre backend et redéployez.
Format du JWT
{
  "kind": "guidia.user.v1",
  "iss": "guidia-client-sdk",
  "app_id": "uuid",
  "tenant_id": "uuid",
  "sub": "user-id-cote-client",
  "role": "admin",
  "email": "user@example.com",
  "locale": "fr",
  "iat": 1700000000,
  "exp": 1700000900
}
FAQ
**Pourquoi pas un OAuth standard ?**
HMAC partagé suffit pour l'identification widget : pas de revocation à
distance nécessaire (TTL court), pas de complexité OAuth client.
**Le secret expire-t-il ?**
Non, mais vous pouvez (et devriez) le rotater régulièrement en prod.
**Combien de tokens puis-je émettre ?**
Illimité, sans appel à Guidia. La signature est locale.
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.21

## Page 22

Guidia — Documentation technique
README.md
@guidia/skills
Authoring kit for [Guidia](https://guidia.dev) Tour Studio workflows.
Use it from any AI coding agent (Cursor, Claude, Codex, OpenAI Agents…)
or your own scripts to **scaffold, validate, and push** pages, actions and
guided flows to a live Guidia app.
The same JSON document this package produces is what the admin UI imports
when you click **Import JSON** on `/admin/tours`. Export → tweak → re-import
is fully round-trip safe.
npm i @guidia/skills
# or, as a global CLI :
npm i -g @guidia/skills
---
TL;DR — three ways to author
1. The fluent builder (recommended for agents)
import { workflow, GuidiaClient } from "@guidia/skills";
const wb = workflow({ meta: { generated_by: "my-agent" } });
wb.addPage({ title: "Dashboard" }).type("dashboard").url("/dashboard");
wb.addAction({ label: "Open settings", on: "dashboard" })
  .kind("click")
  .selector("[data-test=open-settings]");
wb.addFlow({ title: "Onboarding tour" })
  .entryAt("dashboard")
  .doAction({ action_key: "open-settings", title: "Open settings" });
const bundle = wb.build();
const client = new GuidiaClient({
  baseUrl: process.env.GUIDIA_API_URL!,        // e.g. https://guidia.dev/api
  accessToken: process.env.GUIDIA_ACCESS_TOKEN!,
});
const result = await client.importBundle(process.env.GUIDIA_APP_ID!, bundle);
console.log(result.import_id, "rollback with `guidia rollback --id ...`");
2. The CLI
guidia init my-bundle.json --locale fr
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.22

## Page 23

Guidia — Documentation technique
# Edit the file…
guidia validate my-bundle.json
guidia push     --app $GUIDIA_APP_ID --in my-bundle.json --strategy merge
guidia export   --app $GUIDIA_APP_ID --out current.json --with-coverage --scope admin
guidia coverage examples/guidia-admin-console.bundle.json
guidia rollback --app $GUIDIA_APP_ID --id <import_id>
The CLI reads `GUIDIA_API_URL`, `GUIDIA_ACCESS_TOKEN`, and `GUIDIA_APP_ID`
from the environment or a `.env` file in the current directory.
3. Hand-write the JSON
{
  "bundle_version": 1,
  "kind": "guidia.tour_studio.bundle",
  "meta": { "generated_by": "my-agent" },
  "guided_pages": [
    { "key": "dashboard", "title": "Dashboard", "page_type": "dashboard", "url": "/dashboard" }
  ],
  "guided_actions": [
    {
      "key": "open-settings",
      "label": "Open settings",
      "page_key": "dashboard",
      "action_type": "click",
      "target_mode": "selector",
      "target_selector": "[data-test=open-settings]"
    }
  ],
  "guided_flows": [
    {
      "key": "onboarding",
      "title": "Onboarding tour",
      "entry_page_keys": ["dashboard"],
      "steps": [
        { "title": "Open settings", "action_key": "open-settings", "page_key": "dashboard", "ui_mode":
"highlight" }
      ]
    }
  ]
}
A complete JSON Schema lives at `node_modules/@guidia/skills/schemas/workflow.schema.json`
(also reachable via `import schema from "@guidia/skills/schema.json"`).
---
API
`workflow(opts?)` → `WorkflowBuilder`
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.23

## Page 24

Guidia — Documentation technique
Top-level factory.
const wb = workflow({ meta: { name: "Pro upgrade", generated_by: "claude" } });
#### `WorkflowBuilder` methods
| Method            | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| `addPage(init)`   | Append a `PageBuilder`. `init.key` is auto-slugified.    |
| `addAction(init)` | Append an `ActionBuilder` (`init.on` shortcuts `page_key`). |
| `addFlow(init)`   | Append a `FlowBuilder`.                                  |
| `setMeta(patch)`  | Merge into `meta`.                                       |
| `forApp(appId)`   | Set the target app id on the bundle (optional metadata). |
| `build()`         | Compile to `TourStudioBundle`.                           |
| `toJSON(indent?)` | Compile + pretty-print as string.                        |
`PageBuilder` exposes `.url()`, `.urlPattern()`, `.type()`, `.detect()`,
`.tag()`, `.translate()`, `.inactive()`.
`ActionBuilder` exposes `.on()`, `.kind()`, `.selector()`, `.hint()`,
`.url()`, `.native()`, `.safety()`, `.parameter()`, `.translate()`,
`.tag()`, `.inactive()`.
`FlowBuilder` exposes `.goal()`, `.describe()`, `.entryAt()`, `.tag()`,
`.safety()`, `.translate()`, `.step()`, `.doAction()`, `.inactive()`.
`validateBundle(input)` → `ValidationResult`
Two-pass check : Zod schema first, cross-references second.
const result = validateBundle(JSON.parse(raw));
if (!result.ok) {
  console.error(formatIssues(result.issues));
  process.exit(1);
}
`ValidationResult.issues[]` carries `{ level, code, path, message }` so the
CLI (and your agent) can surface errors with precise JSON-paths.
`GuidiaClient`
const client = new GuidiaClient({
  baseUrl: "https://guidia.dev/api",
  accessToken: "<supabase access token>",
});
await client.exportBundle(appId);
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.24

## Page 25

Guidia — Documentation technique
await client.importBundle(appId, bundle, { strategy: "merge" });
await client.rollbackImport(appId, importId);
Throws `GuidiaApiError` on non-2xx responses (with `status`, `path`, `detail`).
---
Couverture des routes (`meta.coverage`)
**Important :** chaque application Guidia a ses propres routes (`base_url`, pages
métier, SPA client…). Elles ne viennent **pas** de `frontend/src/app/` sauf pour
le site Guidia lui-même.
| Mode | Quand l'utiliser |
|------|------------------|
|  `bundle`  (défaut  pour  apps  clientes)  |  Routes  =  `guided_pages[].url`  /  `url_pattern`  du  bundle.
Vérifie l'intégrité (actions orphelines, pages sans action…). |
|  `repo`  |  Uniquement  bundles  de  référence  `guidia-home-vitrine`  /  `guidia-admin-console`  vs
inventaire statique du repo. |
|  `custom`  +  `--inventory  routes.json`  |  Compare  le  bundle  à  **votre**  liste  de  routes  (crawl,
OpenAPI, export précédent). |
# App cliente (recommandé)
guidia coverage mon-app.json --mode bundle
guidia export --app $GUIDIA_APP_ID --out live.json --with-coverage --mode bundle
# Bundles de référence Guidia uniquement
guidia coverage examples/guidia-admin-console.bundle.json --mode repo
# Inventaire externe (routes qui changent par app / par version)
guidia coverage mon-app.json --mode custom --inventory ./routes-decouvertes.json
Format `--inventory` :
{
  "routes": [
    { "path": "/dashboard", "label": "Tableau de bord" },
    { "path": "/settings/billing", "label": "Facturation" }
  ]
}
Fichiers générés en paire : `*.bundle.json` + `*.coverage.json`.
Inventaire repo Guidia : `src/coverage/route-inventory.ts` (marketing + admin Guidia seulement).
---
Tagging & rollback
Every entity created via the API is tagged with :
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.25

## Page 26

Guidia — Documentation technique
  • `imported-json` (constant marker)
  • `import:<import_id>` (per-import, returned in the import response)
Use these to audit what an agent pushed and to revert it :
guidia rollback --app $APP --id 8a7b...
# DELETE /api/tour-studio/apps/{app}/imports/{import_id}
---
Companion : `@guidia/sdk`
`@guidia/sdk` signs **user tokens** (JWT HS256) used by the browser widget.
`@guidia/skills` ships **studio content** (pages/actions/flows). The two
packages are independent ; install whichever you need.
---
Versioning
`bundle_version` follows independent semantic versioning. The server
accepts any version ≤ its own. Bump the major number whenever a field is
renamed or removed; older agents will fall back to a meaningful error
(`Unsupported bundle_version=N`).
---
License
MIT
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.26

## Page 27

Guidia — Documentation technique
SKILL.md
---
name: guidia-skills
description: Authoring kit for Guidia Tour Studio workflows. Use this skill when an AI agent needs to
scaffold, validate, or push pages, actions and guided flows to a Guidia app (`/admin/tours`). Covers
the import/export JSON bundle format ("n8n-style"), the fluent builder API, the validator, the REST
client, and the `guidia` CLI.
---
Guidia Skills
Build and ship **Guidia Tour Studio** workflows from any AI coding agent. A
workflow is a self-contained JSON document carrying three layers :
| Layer  | Purpose                                                              | Linked by    |
| ------ | -------------------------------------------------------------------- | ------------ |
| Pages  | Stable views the widget can recognize (`/dashboard`, `/settings`…).  | `key`        |
| Actions| Things a user can do on a page (`click`, `fill`, `submit`…).         | `page_key`   |
| Flows  | Ordered tours that string actions into a guided experience.          | `entry_page_keys`,
`steps[].action_key` |
The same JSON shape powers the **Export / Import** buttons on `/admin/tours`
and the `@guidia/skills` npm package — agents and humans share one schema.
---
When to use this skill
Trigger this skill whenever the user asks you to :
  • Add a **guided tour** / onboarding flow to a Guidia-instrumented app.
  • Generate a `*.workflow.json` bundle that the admin can import.
  • Push pages/actions/flows to a live app from a script or agent.
  • Round-trip an export → modification → re-import workflow (n8n-style).
  • Mass-edit, refactor, or rename keys across a Tour Studio.
Do **not** use this skill for : authoring the widget runtime itself, editing
the admin React UI, or running the live tour player. Use the existing
`@guidia/sdk` package for user-token signing.
---
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.27

## Page 28

Guidia — Documentation technique
Quickstart (3 ways to author a bundle)
1. CLI scaffold + edit JSON
npx @guidia/skills init my-bundle.json --locale fr
# Edit my-bundle.json — every field is documented in schemas/workflow.schema.json.
npx @guidia/skills validate my-bundle.json
GUIDIA_API_URL=https://guidia.dev/api \
GUIDIA_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN \
npx @guidia/skills push --app <app-uuid> --in my-bundle.json --strategy merge
2. Fluent builder (recommended for agents)
import { workflow, GuidiaClient } from "@guidia/skills";
const wb = workflow({ meta: { generated_by: "claude-agent" } });
wb.addPage({ title: "Dashboard" }).type("dashboard").url("/dashboard");
wb.addPage({ title: "Billing" }).type("settings").urlPattern("^/settings/billing");
wb.addAction({ label: "Open billing", on: "dashboard" })
  .kind("click")
  .selector("[data-test=open-billing]");
wb.addAction({ label: "Upgrade plan", on: "billing" })
  .kind("submit")
  .selector("[data-test=upgrade-submit]")
  .safety("confirm");
wb.addFlow({ title: "Upgrade tour", goal: "Move free users to Pro" })
  .entryAt("dashboard")
  .doAction({ action_key: "open-billing", title: "Open billing" })
  .doAction({
    action_key: "upgrade-plan",
    title: "Confirm the upgrade",
    requires_confirmation: true,
  });
const bundle = wb.build();
const client = new GuidiaClient({
  baseUrl: process.env.GUIDIA_API_URL!,
  accessToken: process.env.GUIDIA_ACCESS_TOKEN!,
});
const result = await client.importBundle(process.env.GUIDIA_APP_ID!, bundle, {
  strategy: "merge",
});
console.log("import_id =", result.import_id);
3. Validate a hand-written bundle
import { validateBundle, formatIssues } from "@guidia/skills";
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.28

## Page 29

Guidia — Documentation technique
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("bundle.json", "utf8"));
const result = validateBundle(data);
if (!result.ok) {
  console.error(formatIssues(result.issues));
  process.exit(1);
}
---
Bundle schema (essentials)
A bundle is a JSON object with `bundle_version=1`, `kind="guidia.tour_studio.bundle"`,
plus three arrays. **Keys must be lowercase, kebab/snake, max 80 chars,
unique within their array.**
{
  "bundle_version": 1,
  "kind": "guidia.tour_studio.bundle",
  "meta": { "generated_by": "<your agent name>" },
  "guided_pages":  [{ "key": "dashboard", "title": "Dashboard", "page_type": "dashboard", "url": "/dashboard"
}],
  "guided_actions": [{ "key": "open-billing", "label": "Open billing", "page_key": "dashboard", "action_type":
"click", "target_mode": "selector", "target_selector": "[data-test=open-billing]" }],
  "guided_flows": [{
    "key": "upgrade-tour",
    "title": "Upgrade tour",
    "entry_page_keys": ["dashboard"],
    "steps": [
      { "title": "Open billing", "action_key": "open-billing", "page_key": "dashboard", "ui_mode": "highlight"
}
    ]
  }]
}
Full enums for `page_type`, `action_type`, `target_mode`, `safety_mode`,
`ui_mode`, and `input_type` live in
[`schemas/workflow.schema.json`](./schemas/workflow.schema.json) and
[`src/schemas/types.ts`](./src/schemas/types.ts).
---
Authoring rules for AI agents
When generating a bundle, an agent **must** :
  • 1. **Pick stable keys.** Use the same `key` across imports so re-running
doesn't create duplicates. Slugify titles to `lower-kebab`.
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.29

## Page 30

Guidia — Documentation technique
  • 2. **Always link by `key`.** Actions reference pages by `page_key`. Flow
steps reference actions by `action_key` and (optionally) pages by
`page_key`. Flow `entry_page_keys` must exist in `guided_pages`.
  • 3. **Validate before pushing.** Run `validateBundle` or `guidia validate`;
fix every `error`-level issue. Warnings (dangling refs) are OK if they
are intentional placeholders for later.
  • 4. **Default to `strategy: "merge"`.** Use `"replace"` only when the user
explicitly asks to wipe the app first. `merge` upserts by key — safe to
re-run.
  • 5. **Tag your work.** Add a `tags: ["agent:<your-name>"]` entry on every
page/action/flow you create so the user can audit and roll back.
  • 6. **Localize when possible.** Set `default_locale` and include
`title_translations` / `description_translations` for `fr` and `en` if
the source content supports both.
---
CLI reference
guidia init       [out.json]                Scaffold a sample bundle (--locale fr|en, --force).
guidia validate   <file.json>               Validate schema + cross-refs (exit 1 on errors).
guidia export     --app <id> --out <file>   Pull the live studio as JSON.
guidia push       --app <id> --in  <file>   Push a bundle (--strategy merge|replace, --skip-validate, --yes
for replace).
guidia rollback   --app <id> --id  <import> Delete every entity tagged with that import_id.
guidia schema                               Print the JSON Schema (pipe into your editor).
Environment :
  • `GUIDIA_API_URL` — defaults to `https://guidia.dev/api`.
  • `GUIDIA_ACCESS_TOKEN` — admin Supabase access token, required for
`export`, `push`, `rollback`.
  • `GUIDIA_APP_ID` — default value for `--app`.
The CLI also reads a `.env` file from the current working directory.
---
REST endpoints used under the hood
  • `GET    /api/tour-studio/apps/{app_id}/bundle/export` → `TourStudioBundle`
  • `POST   /api/tour-studio/apps/{app_id}/bundle/import` → `TourStudioBundleImportResponse`
  • `POST   /api/tour-studio/apps/{app_id}/bundle/import-file` (multipart, used by the UI)
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.30

## Page 31

Guidia — Documentation technique
  • `DELETE /api/tour-studio/apps/{app_id}/imports/{import_id}` (rollback by tag)
These same endpoints back the **Import / Export** buttons in the admin UI
(`/admin/tours`). Importing the same bundle via the CLI or the UI produces
identical results.
---
Troubleshooting
  • **`ERROR duplicate.key`** — two entities share a `key`. Pick distinct,
human-readable identifiers (e.g. `upgrade-tour-step-1`).
  • **`warn ref.unknown_action`** — a flow step points to an `action_key`
not present in `guided_actions`. Add the action or remove the step.
  • **`API 401`** — the access token is missing or expired. Generate a new
one from the Guidia admin or your Supabase session.
  • **`API 422 Bundle schema invalid`** — the server's Pydantic models found
a stricter issue than the JS validator. Run `guidia validate` with the
latest version of the package, or inspect the `detail` field.
---
Where things live in the monorepo
| Asset                                 | Path                                                                |
| ------------------------------------- | ------------------------------------------------------------------- |
| Authoring kit (this skill)            | `sdk/skills/`                                                       |
| Backend models                        | `backend/models/tour_studio.py`                                     |
| Backend service (export/import)       | `backend/services/tour_studio_service.py` (`export_bundle`,
`import_bundle`) |
| Backend router endpoints              | `backend/routers/tour_studio_router.py`                             |
| Frontend admin UI buttons             | `frontend/src/app/admin/tours/page.tsx`                             |
| Frontend API client                   | `frontend/src/lib/tour-studio/api.ts`                               |
| JSON Schema (editor integration)      | `sdk/skills/schemas/workflow.schema.json`                          
|
Stay in sync : whenever `bundle_version` is bumped, update both
`backend/models/tour_studio.py` (`TOUR_STUDIO_BUNDLE_VERSION`) and
`sdk/skills/src/schemas/types.ts`.
Source : docs/*.fr.md + docsPayload + sdk/skills · guidia.dev · 2026-05-20 · p.31
