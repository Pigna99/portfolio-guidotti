# Provisioning — portfolio Guidotti

Tutto quello che serve per: configurare la macchina di sviluppo, caricare contenuti, deployare. Nessun passo magico — segui in ordine.

---

## Architettura in due righe

| Cosa | Dove vive | Come arriva lì |
|------|-----------|----------------|
| Codice + `manifest.json` (paths immagini) | GitHub → VPS via `git pull` | `git push` → GitHub Actions → SSH → VPS |
| WebP ottimizzate (`public/content/`) | VPS direttamente, **non** in git | `npm run sync-content` (rsync da locale → VPS) |
| Originali (`content/`, ~2GB) | Solo macchina locale | Mai su git, mai sul VPS |

Il sito gira sul VPS Hetzner via PM2 (porta 3002), reverse-proxied da nginx su `https://guidotti.offerteai.it`.

---

## 1. Setup iniziale (una volta sola, su una nuova macchina)

### Prerequisiti

- **Node.js 20+** ([nodejs.org](https://nodejs.org))
- **rsync**:
  - Linux/macOS: già installato
  - Windows: installa **Git for Windows** + **cwRsync**, oppure usa **WSL2** con Ubuntu
- **SSH** con accesso al VPS

### SSH config

Aggiungi al tuo `~/.ssh/config` (Windows: `%USERPROFILE%\.ssh\config`):

```
Host pigna-bot
    HostName 89.167.84.73
    User pigna
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
```

Verifica: `ssh pigna-bot "echo ok"` deve stampare `ok`.

### Clonare e installare

```bash
git clone git@github.com:Pigna99/portfolio-guidotti.git
cd portfolio-guidotti
npm ci
```

### Generare il manifest e (opzionale) avviare

```bash
npm run content        # genera manifest.json + public/content/ dal materiale in content/
npm run dev            # apre http://localhost:3000
```

Se non hai ancora messo niente in `content/`, il manifest è vuoto e il sito mostra placeholder.

---

## 2. Aggiungere materiale

### Carosello

```
content/carosello/
├── 01-vernissage.jpg
├── 02-allestimento.jpg
└── 03-studio.jpg
```

(Opzionale) crea `content/carosello/carosello.json` per ordinare e mettere alt:

```json
{
  "images": [
    { "file": "01-vernissage.jpg", "alt": "Vernissage galleria X, 2026" },
    { "file": "02-allestimento.jpg", "alt": "Allestimento — sala 2" }
  ]
}
```

### Opera

```
content/opere/2026/studio-01/
├── opera.json
├── 01-frontale.jpg
├── 02-dettaglio.jpg
└── 03-laterale.jpg
```

`opera.json`:

```json
{
  "title": "Studio #01",
  "title_en": "Study #01",
  "description": "Olio su tela, prova di studio.",
  "description_en": "Oil on canvas, study piece.",
  "date": "2026-01",
  "images": [
    {
      "file": "01-frontale.jpg",
      "alt": "Vista frontale",
      "caption": "Olio su tela, 50×40 cm"
    },
    { "file": "02-dettaglio.jpg", "caption": "Dettaglio centrale" }
  ]
}
```

### Esposizione

```
content/esposizioni/2026/milano-galleria-x/
├── esposizione.json
├── 01-allestimento.jpg
└── 02-vernissage.jpg
```

`esposizione.json`:

```json
{
  "title": "Mostra Personale",
  "title_en": "Solo show",
  "description": "Testo descrittivo.",
  "venue": "Galleria Esempio, Milano",
  "venue_en": "Example Gallery, Milan",
  "start_date": "2026-01",
  "end_date": "2026-03",
  "images": [
    { "file": "01-allestimento.jpg", "caption": "Sala principale" }
  ]
}
```

Se non metti immagini, l'esposizione appare solo come testo. Se ne metti, il titolo diventa cliccabile e apre la galleria.

### Convenzioni

- **Slug folder** (`studio-01`, `milano-galleria-x`): solo lettere minuscole, numeri e `-`. Diventa l'id stabile dell'opera/mostra.
- **Date**: formato `YYYY-MM` (mese sufficiente).
- **Lingua**: ogni testo accetta il suffisso `_en` (es. `title_en`, `caption_en`). Se manca, fallback all'italiano.
- **Ordine immagini**: l'array `images` nel JSON dice l'ordine. Se assente, ordine alfabetico dei file.
- **Formati supportati**: `.jpg`, `.jpeg`, `.png`, `.webp`. Lo script li converte tutti in WebP responsive.

Vedi anche [content/README.md](content/README.md) per i dettagli completi degli schemi JSON.

---

## 3. Pubblicare gli aggiornamenti

Dopo aver aggiunto/modificato cose in `content/`:

```bash
# 1. Genera WebP responsive + manifest
npm run content

# 2. Carica le WebP sul VPS (rsync incrementale, solo i file cambiati)
npm run sync-content

# 3. Commit del manifest e codice eventualmente cambiato
git add src/content/manifest.json
git commit -m "Aggiunte 3 opere 2026"
git push

# GitHub Actions parte automaticamente, deploy in ~30s
```

**Importante: in questo ordine**. Sync prima del push significa: quando GH Actions fa `git pull` sul VPS e usa il nuovo manifest, le immagini referenziate sono già lì.

Se inverti l'ordine: c'è una finestra di ~10 secondi in cui il manifest punta a immagini non ancora caricate → immagini rotte temporaneamente.

### Cosa fa il deploy automatico

GitHub Actions su push a `master`:
1. SSH al VPS (`pigna@89.167.84.73:2222`)
2. `cd /opt/portfolio-guidotti`
3. `git fetch + git reset --hard origin/master` (NON tocca `public/content/` perché gitignored)
4. `npm ci && npm run build` (legge il manifest)
5. Copia static + public (incluso il rsynced `public/content/`) nello standalone Next.js
6. `pm2 reload portfolio-guidotti` (zero-downtime)

---

## 4. Comandi utili

```bash
npm run dev           # dev server con hot reload
npm run build         # build produzione (verifica TS + bundle)
npm run content       # rigenera WebP + manifest da content/
npm run sync-content  # rsync public/content/ → VPS
npm run logo          # rigenera skull.png + favicon da docs/logo.png
npm run lint          # ESLint
```

### Troubleshooting

**`npm run sync-content` fallisce con "rsync: command not found"**
Su Windows: installa rsync via Git for Windows (versione MinGW) o usa WSL2.
Su macOS: `brew install rsync` (la versione di sistema funziona ma è vecchia).

**Connessione SSH rifiutata**
Verifica che `ssh pigna-bot` funzioni standalone. Se no, controlla:
- `~/.ssh/config` ha l'host `pigna-bot`
- La tua chiave pubblica è in `/home/pigna/.ssh/authorized_keys` sul VPS

**Immagini rotte sul sito dopo il deploy**
Probabile: hai pushato il manifest senza prima fare `sync-content`. Lancia `npm run sync-content` e ricontrolla.

**Reset completo del materiale sul VPS**
```bash
# Locale: rebuild pulito
rm -rf public/content/
npm run content

# Sul VPS: pulisci la dir
ssh pigna-bot "rm -rf /opt/portfolio-guidotti/public/content/*"

# Locale: re-upload
npm run sync-content
```

**Vedere i log del bot in tempo reale**
```bash
ssh pigna-bot "pm2 logs portfolio-guidotti --lines 50"
```

**Forzare un deploy senza aver cambiato codice**
```bash
git commit --allow-empty -m "Trigger deploy"
git push
```

---

## 5. Riferimenti rapidi

- **Repo GitHub**: https://github.com/Pigna99/portfolio-guidotti
- **Sito**: https://guidotti.offerteai.it
- **VPS**: `pigna@89.167.84.73:2222` (alias SSH `pigna-bot`)
- **Path VPS**: `/opt/portfolio-guidotti`
- **Service manager**: PM2 (`pm2 status portfolio-guidotti`)
- **Reverse proxy**: nginx, config in `/etc/nginx/sites-available/guidotti.conf`
- **SSL**: Let's Encrypt via certbot, auto-rinnovo
- **Workflow CI**: `.github/workflows/deploy.yml`
