# Events & Callbacks Example

Speak one utterance and watch every public event and per-call callback fire in real time.

> [!TIP]
> **Get a free API key** at [responsivevoice.org/register](https://responsivevoice.org/register) — required to access all available voices, standard and premium.

## Usage

Open `index.html` in your browser, or serve it:

```bash
npx serve .
```

## Code Highlights

```javascript
// 1. Global events — registered once, fire across every speak() call
responsiveVoice.addEventListener('OnReady', () => {
  /* engine ready */
});
responsiveVoice.addEventListener('OnStart', () => {
  /* speech started */
});
responsiveVoice.addEventListener('OnEnd', () => {
  /* speech finished */
});
responsiveVoice.addEventListener('OnError', (e) => {
  console.warn(e.error?.message);
});

// 2. Per-call callbacks — passed to speak(), bound to that utterance
responsiveVoice.speak('Hello there.', undefined, {
  onstart: () => {
    /* this utterance started */
  },
  onend: () => {
    /* this utterance finished */
  },
  onerror: (err) => {
    /* this utterance failed */
  },
  onboundary: (charIndex, name) => {
    /* word/sentence boundary */
  },
});
```

## What This Example Demonstrates

- **Global events** registered with `responsiveVoice.addEventListener(name, handler)` —
  `OnReady`, `OnVoiceResolved`, `OnStart`, `OnEnd`, `OnPause`, `OnResume`, `OnError`,
  `OnPartStart`, `OnPartEnd`.
- **Per-call callbacks** passed inline to `responsiveVoice.speak(text, voice, params)` —
  `onstart`, `onend`, `onerror`, `onboundary`.
- The two are independent: global listeners stay registered across calls; per-call
  callbacks belong to a single utterance and reset on the next `speak()`.

## Notes

- `onboundary` only fires when synthesis runs through the browser's native Web Speech
  engine. Voices that route through the fallback HTTP audio path do not produce
  boundary events — the counter stays at zero in that case.
- `pause()` has a browser-imposed limit of about 60 seconds, after which the engine
  cancels the speech automatically. If you click Pause and wait too long before
  clicking Resume, you'll see `OnPause` followed by `OnEnd` (not `OnResume`).
- `OnPartStart` / `OnPartEnd` fire only when the input is long enough that the engine
  splits it into multiple parts. Short text fires `OnStart` and `OnEnd` only.
