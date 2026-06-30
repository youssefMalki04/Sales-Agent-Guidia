# Sales-Agent-Guidia

Agent IA capable de discuter avec un visiteur, comprendre son besoin, qualifier son niveau d'intérêt, détecter son budget, son secteur, son urgence, puis transmettre un lead structuré à un CRM.

---

## Stack technique

- **Next.js 15** (App Router) + **TypeScript**
- **Google Gemini** (via `@google/generative-ai`)
- **Supabase** (base de données + vecteurs RAG)

---

## Installation

```bash
pnpm install
```

---

## Configuration

1. Copier le fichier d'exemple :

   ```bash
   cp .env.example .env.local
   ```

2. Renseigner la clé API Gemini dans `.env.local` :

   ```env
   GOOGLE_API_KEY=ta_cle_api_ici
   ```

   > ⚠️ `.env.local` est dans `.gitignore` — ne jamais committer de clé API.

---

## Smoke Test — Validation de l'intégration Gemini

Avant de démarrer le module RAG, valide que la connexion à l'API Gemini fonctionne :

```bash
pnpm smoke-test
```

### Résultat attendu

```
🔍 Smoke test Gemini — démarrage…
   Modèle : gemini-1.5-flash
   Prompt : "Réponds uniquement par OK si tu reçois ce message."

✅ Réponse reçue avec succès !
─────────────────────────────────────────
   Statut    : OK (200)
   Modèle    : gemini-1.5-flash
   Réponse   : "OK"
─────────────────────────────────────────

🎉 Le modèle a validé le message — intégration fonctionnelle.
```

### En cas d'erreur

| Message d'erreur | Cause probable | Solution |
|---|---|---|
| `GOOGLE_API_KEY est absente ou vide` | `.env.local` non configuré | Ajouter la clé dans `.env.local` |
| `Clé API invalide ou révoquée` | Clé incorrecte | Vérifier sur [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `Quota API dépassé` | Limite d'appels atteinte | Attendre ou vérifier la facturation |
| `Modèle introuvable` | Nom de modèle incorrect | Vérifier `MODEL_NAME` dans le script |

---

## Lancer le serveur de développement

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.
