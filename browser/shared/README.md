# Shared scaffold

`api-key-scaffold.js` and `api-key-scaffold.css` provide a single piece of UI scaffolding inherited by every browser demo: an in-page acquisition callout pointing visitors at the [free API key signup](https://responsivevoice.org/register), an input to paste the key, and an optional **Advanced settings** disclosure for overriding the TTS server URL.

The scaffold persists the visitor's input in `localStorage` (one shared key reused across demos), then sets `window.rvApiKey` and `window.rvApiEndpoint` on subsequent loads — `@responsivevoice/core` reads those globals automatically, so demos do not need to wire the key into their `init()` calls.

## Adding the scaffold to a demo

In the demo's `<head>`, add two tags before the closing `</head>`:

```html
<link rel="stylesheet" href="../shared/api-key-scaffold.css" />
<script src="../shared/api-key-scaffold.js"></script>
```

That is the entire integration. The scaffold:

- self-mounts after the first `.subtitle` (or `.header`) element it finds in the page,
- restores the visitor's previously saved key/endpoint from `localStorage` on every load before the ResponsiveVoice library initializes,
- renders a confirmation banner with a **Change settings** button when a key is already set.

## Storage

| Key                       | Value                                                                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rv:examples:apiKey`      | The visitor's API key. Absent until they paste and save a key.                                                                                                                            |
| `rv:examples:apiEndpoint` | A custom TTS server URL. Absent when the default is in use — the runtime falls back to `@responsivevoice/api-client`'s built-in default of `https://texttospeech.responsivevoice.org/v2`. |

A visitor who clicks **Change settings** clears both keys and is returned to the acquisition flow.
