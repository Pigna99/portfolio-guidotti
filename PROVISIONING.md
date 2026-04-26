# Provisioning — portfolio Guidotti

Tutto quello che serve per: configurare la macchina di sviluppo, caricare contenuti, deployare. Nessun passo magico — segui in ordine.

---

## Architettura in due righe

| Cosa | Dove vive | Come arriva lì |
|------|-----------|----------------|
| Codice (gitato) | GitHub → VPS via `git pull` | `git push` → GitHub Actions → SSH → VPS |
| `/content/` (originali ~2GB, JSON, PDF) | Direttamente sul VPS, gestito dall'artista via SSH | Upload manuale (rsync, scp, sftp) |
| `/public/content/` (WebP responsive) | Generato sul VPS da `npm run content` | `npm run build` (auto-prebuild) o `vps-rebuild.sh` |
| `src/content/manifest.json` (paths) | Generato sul VPS, mai in git | Idem |

L'artista (amico) ha SSH al VPS e carica direttamente in `/opt/portfolio-guidotti/content/`. Il dev fa `bash scripts/vps-rebuild.sh` per propagare le modifiche al sito live.

Sito gira sul VPS Hetzner via PM2 (porta 3002), reverse-proxied da nginx su `https://guidotti.offerteai.it`.

---

## 1. Setup iniziale (una volta sola)

### Macchina di sviluppo

Prerequisiti: **Node.js 20+** ([nodejs.org](https://nodejs.org)), Git, accesso SSH al VPS.

SSH config (`~/.ssh/config` su Linux/Mac, `%USERPROFILE%\.ssh\config` su Windows):

```
Host pigna-bot
    HostName 89.167.84.73
    User pigna
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
```

Verifica: `ssh pigna-bot "echo ok"` deve stampare `ok`.

```bash
git clone git@github.com:Pigna99/portfolio-guidotti.git
cd portfolio-guidotti
npm ci
npm run dev    # http://localhost:3000 (manifest vuoto se non hai content/ locale)
```

### VPS

Già configurato (vedi sezione 5). Quando l'artista carica nuovi file in `/opt/portfolio-guidotti/content/`, il dev lancia `bash scripts/vps-rebuild.sh` per aggiornare il sito.

---

## 2. Struttura del materiale (in `/content/`)

Tutta la struttura sotto sta in `content/` sul VPS. L'artista deve replicare questo layout:

```
content/
├── CV-ITALIANO.pdf                 ← nomi fissi, copiati come sono
├── CV-INGLESE.pdf
├── Portfolio-ITALIANO.pdf
├── Portfolio-INGLESE.pdf
│
├── carosello/                       ← foto del carosello in homepage
│   ├── carosello.json               (opzionale: ordine + alt)
│   ├── 01-vernissage.jpg
│   ├── 02-allestimento.jpg
│   └── 03-studio.jpg
│
├── opere/{anno}/{slug-opera}/       ← una cartella per opera
│   ├── opera.json                   (REQUIRED — vedi schema sotto)
│   ├── 00-cover.jpg                 (opzionale, immagine di copertina)
│   ├── 01-frontale.jpg              (immagini mostrate nel lightbox)
│   └── 02-dettaglio.jpg
│
└── esposizioni/{anno}/{slug-mostra}/
    ├── esposizione.json             (REQUIRED — vedi schema sotto)
    ├── 01-allestimento.jpg          (opzionali)
    └── 02-vernissage.jpg
```

### opera.json

```json
{
  "title": "Studio #01",
  "title_en": "Study #01",
  "description": "Olio su tela.",
  "description_en": "Oil on canvas.",
  "date": "2026-01",
  "cover": "00-cover.jpg",
  "video": "https://www.youtube.com/watch?v=ABC123XYZ45",
  "images": [
    {
      "file": "01-frontale.jpg",
      "alt": "Vista frontale",
      "alt_en": "Front view",
      "caption": "Olio su tela, 50×40 cm"
    },
    { "file": "02-dettaglio.jpg", "caption": "Dettaglio centrale" }
  ]
}
```

- **`title`** (richiesto), **`title_en`** (fallback all'italiano se manca).
- **`description`**, **`description_en`** (free text).
- **`date`**: `YYYY-MM` — usato per ordinamento nell'anno.
- **`cover`** (opzionale): nome del file da usare come thumbnail. Può **anche non essere** in `images` — è separata. Se omesso, viene usata la prima immagine di `images`.
- **`video`** (opzionale): URL YouTube (qualsiasi formato — watch, youtu.be, embed, shorts). Se presente, appare come **prima slide nel lightbox** con player embedded.
- **`images`**: ordine delle foto nel lightbox. `file` deve corrispondere al nome del file nella stessa cartella. Ogni immagine accetta `alt`, `alt_en`, `caption`, `caption_en`.

### esposizione.json

```json
{
  "title": "Mostra Personale",
  "title_en": "Solo show",
  "description": "Testo descrittivo.",
  "venue": "Galleria Esempio, Milano",
  "venue_en": "Example Gallery, Milan",
  "start_date": "2026-01",
  "end_date": "2026-03",
  "video": "https://youtu.be/XYZ789",
  "images": [
    { "file": "01-allestimento.jpg", "caption": "Sala principale" }
  ]
}
```

- **`start_date`** / **`end_date`**: `YYYY-MM`. Renderizzati come "Gen — Mar 2026", "Gen 2026" (stesso mese), "Nov 2025 — Feb 2026" (a cavallo di anni).
- **`video`** (opzionale): YouTube URL — embed nel lightbox.
- **`images`** (opzionale): se presenti (o c'è `video`), il **titolo diventa cliccabile** e apre il lightbox a schermo intero. Senza media è solo testo.

### carosello.json (opzionale)

```json
{
  "images": [
    { "file": "01.jpg", "alt": "Studio del 2026" },
    { "file": "02.jpg", "alt": "Allestimento Galleria X" }
  ]
}
```

### PDF CV / Portfolio

I 4 file PDF stanno nella radice di `content/` con questi **nomi esatti**:
- `CV-ITALIANO.pdf`, `CV-INGLESE.pdf`
- `Portfolio-ITALIANO.pdf`, `Portfolio-INGLESE.pdf`

Lo script li copia come-sono in `/public/content/` e l'About Section usa il file ITA o ENG in base alla lingua selezionata. Se un file manca, il rispettivo link semplicemente non appare.

### Convenzioni

- **Slug folder** (`studio-01`, `milano-galleria-x`): lowercase + dashes only.
- **Formati immagine**: `.jpg`, `.jpeg`, `.png`, `.webp`. Convertiti automaticamente in WebP responsive a 4 dimensioni (400/800/1600/2400w) + originale.
- **Ordine**: `images[]` nel JSON definisce l'ordine. Se assente, ordine alfabetico dei file.

---

## 3. Aggiornare il sito dopo che l'artista carica nuovo materiale

### Workflow standard (la cosa che farai 99% delle volte)

L'artista ha caricato roba in `/opt/portfolio-guidotti/content/` sul VPS. Tu lanci:

```bash
ssh pigna-bot "cd /opt/portfolio-guidotti && bash scripts/vps-rebuild.sh"
```

Cosa fa lo script ([scripts/vps-rebuild.sh](scripts/vps-rebuild.sh)):
1. `npm run build` (auto-runs `prebuild` = `node scripts/build-content.mjs`):
   - Processa `content/` → genera WebP responsive in `public/content/`
   - Copia PDF in `public/content/`
   - Scrive `src/content/manifest.json`
2. Copia static + public dentro `.next/standalone/`
3. `pm2 reload portfolio-guidotti --update-env` (zero-downtime)

Tempo medio: 30-60s (incrementale, solo file cambiati). Prima volta con 2GB: 5-15 min.

### Quando pushi codice

GitHub Actions su push a `master`:
1. SSH al VPS, `git fetch && git reset --hard origin/master` (NON tocca `content/` né `public/content/` perché gitignored)
2. `npm ci && npm run build` ← prebuild rigenera il manifest dal `content/` corrente del VPS
3. Copia static + public, `pm2 reload`

Quindi anche un semplice `git push` aggiorna il sito con il contenuto attuale. Non serve fare niente di esplicito sul content.

---

## 4. Comandi utili

```bash
# locale
npm run dev           # dev server (predev rigenera manifest da content/ locale, vuoto se non c'è)
npm run build         # build prod (prebuild idem)
npm run content       # solo rigenera manifest + WebP, senza build

# sul VPS (via SSH)
npm run rebuild:vps   # equivalente di bash scripts/vps-rebuild.sh
```

### Troubleshooting

**Le nuove opere non appaiono dopo che l'artista ha caricato**
Lancia `bash scripts/vps-rebuild.sh` sul VPS. La build si rigenera con il manifest aggiornato.

**Voglio testare contenuto reale in locale**
Sincronizza la cartella `/content/` dal VPS al tuo PC:
```bash
rsync -avz pigna-bot:/opt/portfolio-guidotti/content/ ./content/
npm run dev
```

**Il PDF non si scarica / link non c'è**
Verifica che il file abbia il nome esatto richiesto (case-insensitive ma struttura `CV-ITALIANO.pdf`). Lo script logga un warning se trova PDF con nomi non riconosciuti.

**Reset completo del materiale ottimizzato sul VPS**
```bash
ssh pigna-bot
cd /opt/portfolio-guidotti
rm -rf public/content/
bash scripts/vps-rebuild.sh
```

**Vedere i log del processo PM2 in tempo reale**
```bash
ssh pigna-bot "pm2 logs portfolio-guidotti --lines 50"
```

**Forzare un deploy senza aver cambiato codice**
```bash
git commit --allow-empty -m "Trigger deploy"
git push
# La pipeline fa girare anche prebuild → rigenera content
```

**YouTube URL non viene riconosciuto**
Il parser supporta: `youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/embed/...`, `youtube.com/shorts/...`. Verifica nei log dello script se vedi `Could not parse YouTube URL: ...`.

---

## 5. Riferimenti rapidi

- **Repo GitHub**: https://github.com/Pigna99/portfolio-guidotti
- **Sito**: https://guidotti.offerteai.it
- **VPS**: `pigna@89.167.84.73:2222` (alias SSH `pigna-bot`)
- **Path VPS app**: `/opt/portfolio-guidotti`
- **Path VPS content** (artista carica qui): `/opt/portfolio-guidotti/content/`
- **PM2 process**: `portfolio-guidotti` (port 3002)
- **Reverse proxy**: nginx, config in `/etc/nginx/sites-available/guidotti.conf`
- **SSL**: Let's Encrypt via certbot, auto-rinnovo
- **Workflow CI**: `.github/workflows/deploy.yml`
