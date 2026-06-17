<p align="center">
  <img src="https://cdn.responsivevoice.org/assets/logo-128.svg" width="128" height="128" alt="ResponsiveVoice logo">
</p>

<h1 align="center">ResponsiveVoice Examples</h1>

<p align="center">
  Browser and Node.js examples for the <code>@responsivevoice/core</code> and <code>@responsivevoice/api-client</code> packages.
</p>

<p align="center">
  <a href="https://docs.responsivevoice.org"><img src="https://img.shields.io/badge/Docs-docs.responsivevoice.org-1f6feb?logo=readthedocs&logoColor=white" alt="Documentation"></a>
  <a href="https://github.com/responsivevoice/examples"><img src="https://img.shields.io/badge/GitHub-examples-181717?logo=github&logoColor=white" alt="GitHub"></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
</p>

---

> [!TIP]
> **Get a free API key** at [responsivevoice.org/register](https://responsivevoice.org/register) — required to access all available voices (standard and premium) in browser demos, and required outright for the Node.js examples.

## Browser Examples

| Example                         | Description                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| [basic](./browser/basic/)       | Minimal TTS — speak text with default voice (loads from CDN)                             |
| [extended](./browser/extended/) | Voice selection, playback controls, and event logging (loads from CDN)                   |
| [vite](./browser/vite/)         | `@responsivevoice/core` installed from npm and bundled by Vite — the modern web-app path |

```bash
# Serve the static CDN examples locally
npm install
npm run serve
# Open http://localhost:3000/browser/basic/ or /browser/extended/
```

```bash
# Run the npm + Vite example (bundled)
npm install
npm run vite:dev
# Open http://localhost:5173
```

## Node.js Examples

```bash
npm install

# CLI example
npm run cli -- "Hello, world!"

# Server example
npm run server
# Visit http://localhost:3001
```

## In-page key entry

Every browser demo includes an in-page acquisition callout and a **Paste your API key** input — no source edits required. The pasted key persists in `localStorage` and is reused across all demos on the same site. An optional **Advanced settings** disclosure lets you override the TTS server URL when needed.

> Examples use `npm` scripts; substitute `yarn` (e.g. `yarn`, `yarn serve`) if you prefer.

## Documentation

Full documentation at [docs.responsivevoice.org](https://docs.responsivevoice.org).

## License

MIT

---

Source: [github.com/responsivevoice/examples](https://github.com/responsivevoice/examples)
