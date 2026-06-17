# npm + Vite Example

Uses `@responsivevoice/core` installed from npm and bundled for the browser by [Vite](https://vitejs.dev/). This is the companion to `browser/basic/` — same feature set, but the library arrives via ESM `import` instead of a CDN `<script>` tag.

> [!TIP]
> **Get a free API key** at [responsivevoice.org/register](https://responsivevoice.org/register) — required to access all available voices, standard and premium.

## Why this example exists

The `basic` and `extended` examples load ResponsiveVoice from the CDN IIFE build (`https://cdn.responsivevoice.org/sdk/latest/responsivevoice.js`) and rely on the `window.responsiveVoice` global. That's useful, but most modern projects consume npm packages through a bundler — Vite, webpack, Next.js, etc. This example shows that path: `npm install @responsivevoice/core`, then `import { getResponsiveVoice } from '@responsivevoice/core'` from TypeScript.

## Install

```bash
npm install
```

## Run the dev server

```bash
npm run vite:dev
# then open http://localhost:5173
```

## Build and preview the production bundle

```bash
npm run vite:build
npm run vite:preview
```

## What to read

- `src/main.ts` — the ESM import and the full event/speak/cancel flow. Mirrors `browser/basic/index.html` line-for-line in intent, so you can diff them to see exactly what changes when you swap the CDN IIFE for an npm import.
- `index.html` — Vite's entry point. The only browser-side difference from `basic` is the `<script type="module" src="/src/main.ts">` tag at the bottom.

## Wiring your API key

Without a key, the example runs in **demo mode** — using the browser-native Web Speech API default voice only, with a "Demo Mode" badge next to the title (driven by `rv.isDemoMode()`).

Once you have a key, uncomment the `apiKey` line in `src/main.ts`:

```ts
rv.init({
  apiKey: 'YOUR_RESPONSIVEVOICE_API_KEY',
});
```

The badge will disappear on the next reload.
