# Struttura — portfolio-guidotti

Portfolio personale. Stack: Next.js + Tailwind.
Aggiornare quando si modifica la struttura (vedi CLAUDE.md root).

```
portfolio-guidotti/
├── src/
│   ├── app/                   # App Router
│   │   ├── AppShell.tsx       # shell client (transizioni, layout interno)
│   │   ├── about/             # pagina about
│   │   ├── opere/             # listing opere
│   │   ├── esposizioni/       # listing esposizioni
│   │   ├── contatti/          # form/info contatti
│   │   ├── layout.tsx / page.tsx
│   │   ├── globals.css
│   │   └── icon.png / apple-icon.png
│   ├── components/            # HomePage, OpereSection, Carousel, Lightbox, LangToggle, IntroScreen, …
│   ├── content/               # contenuti embedded (import dal markdown? vedi build-content.mjs)
│   └── lib/                   # i18n.tsx, sections.ts, format-date.ts, view-transition.ts
├── content/                   # contenuti sorgente (root-level)
│   ├── opere/                 # opere markdown/immagini
│   ├── esposizioni/
│   └── carosello/
├── scripts/
│   ├── build-content.mjs      # build dei contenuti markdown → src/content
│   ├── process-logo.mjs       # processing logo
│   └── vps-rebuild.sh         # rebuild on VPS
├── public/
├── docs/
├── .github/workflows/         # deploy GHA
├── PROVISIONING.md            # note provisioning VPS
├── ecosystem.config.js        # PM2 entry
└── package.json
```

## Note

- I contenuti vivono in `content/` (root) e vengono compilati da `scripts/build-content.mjs` prima del build
- View transitions via `lib/view-transition.ts`
- i18n client-side via `lib/i18n.tsx`
- AppShell wrap-pa tutta la nav interna (SPA-like)
