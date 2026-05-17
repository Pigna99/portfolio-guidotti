# portfolio-guidotti

Portfolio personale dell'artista Luca Guidotti. Sito vetrina con opere, esposizioni, CV scaricabili. **Nessun DB**: contenuti file-based.

- **Path VPS**: `/opt/portfolio-guidotti`
- **Process**: PM2 `portfolio-guidotti` (porta 3002)
- **Domini**: `lucaguidotti.it` (canonico) + `www.lucaguidotti.it` + redirect 301 da `guidotti.offerteai.it`
- **Repo**: github.com/Pigna99/portfolio-guidotti
- **Struttura**: vedi [STRUCTURE.md](STRUCTURE.md)

## Stack

- Next.js 16 standalone, Tailwind v4
- `sharp` per ottimizzazione immagini (genera WebP responsive)

## Contenuti (importante)

I contenuti **non sono nel repo**: vivono in `/opt/portfolio-guidotti/content/` (~2GB, gitignored), caricati via SSH dall'artista.

Layout:
```
content/
├── opere/{anno}/{slug}/
│   ├── opera.json         # { title, year, technique, description, _en: {...} }
│   └── *.jpg / *.png      # immagini ad alta risoluzione
├── esposizioni/{anno}/{slug}/
│   └── esposizione.json
├── carosello/
│   └── *.jpg              # immagini home
└── *.pdf                   # 4 PDF a nomi fissi (CV IT, CV EN, Portfolio IT, Portfolio EN)
```

## Pipeline build-content

`scripts/build-content.mjs` (auto-run da `prebuild`/`predev`):
1. Legge `content/`
2. Genera WebP responsive (400 / 800 / 1600 / 2400w) in `public/content/`
3. Scrive `src/content/manifest.json` (indice opere/esposizioni con metadati)

**Quindi** in dev/build i contenuti vengono sempre rigenerati dal `content/` corrente.

## Multilingua

IT (default) + EN. Nei JSON, campi `_en` opzionali fanno override (fallback all'italiano).
Provider client-side in `src/lib/i18n.tsx`.

## Comandi

```bash
npm run dev          # predev rigenera manifest dal content/ locale
npm run build        # SEMPRE prima del push
npm run content      # solo build-content.mjs (manuale)
npm run logo         # process-logo.mjs
npm run rebuild:vps  # esegue scripts/vps-rebuild.sh sul VPS (rebuild da content/ remoto)
```

## Deploy

GitHub Actions su push `master` → SSH → `git pull` + `npm ci` + `npm run build` (prebuild rigenera manifest dal **content del VPS**) + copia static + `pm2 reload ecosystem.config.js`.

## Aggiornare contenuti senza push

```bash
# 1. Carica file in /opt/portfolio-guidotti/content/ via scp
scp file.jpg pigna-bot:/opt/portfolio-guidotti/content/opere/2024/slug/
# 2. Rebuild content + restart
ssh pigna-bot "cd /opt/portfolio-guidotti && bash scripts/vps-rebuild.sh"
```

## Gotcha

- `content/` è gitignored e **enorme** — non clonarlo in locale, lavora sul manifest generato (`src/content/manifest.json`) per logica e UI
- `predev`/`prebuild` falliscono se `content/` non esiste localmente → in dev locale serve un `content/` minimale o uno scp parziale
- Lightbox supporta YouTube embed come prima slide (campo `youtube` in `opera.json`)
- 4 PDF a nomi fissi → non rinominare in `content/`
