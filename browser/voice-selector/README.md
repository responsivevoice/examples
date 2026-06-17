# Voice Selector Example

A side-by-side teacher for the three forms `responsiveVoice.speak()` accepts as its second argument: a voice **name**, a **RegExp pattern**, or a **VoiceQuery** object.

Voices come in two tiers: **standard** (free, no API key) and **premium** (BYOK — bring-your-own-keys, routed through providers like Google Cloud WaveNet, Microsoft Azure Speech, or OpenAI TTS using credentials you supply). Both `voice.provider` and `voice.isByok === true` identify premium voices.

> [!TIP]
> **Get a free API key** at [responsivevoice.org/register](https://responsivevoice.org/register) — required to access all available voices, standard and premium.

## Usage

Open `index.html` in your browser, or serve it:

```bash
npx serve .
```

## The three modes

Each tab shows the same intent ("an English female voice") expressed differently, and emits the literal `speak()` call below the preview.

### By Name — string selector

Filter the catalog by language / gender / type, click the row you want, and `speak()` is called with that exact name:

```javascript
responsiveVoice.speak('Hello!', 'UK English Female');
```

Predictable and explicit. Brittle if the voice isn't on the user's platform — the resolver then walks the voice matching chain (see the Voice Selection guide on the docs site) to pick the closest alternative.

### By Pattern — RegExp selector

Type a pattern and flags; the example previews every active voice that matches and highlights the **first** one (which is what the resolver picks):

```javascript
responsiveVoice.speak('Hello!', /English.*Female/i);
```

Useful when you want any voice from a family ("any Portuguese variant", "any female English voice") rather than committing to a specific name.

### By Query — VoiceQuery selector

Build a structured filter — `lang`, `gender`, `provider`, `isByok`. Every field you set must be true for a voice to match (logical AND):

```javascript
responsiveVoice.speak('Hello!', { lang: 'en', gender: 'f' });
```

This is the same JSON-serializable shape that the SDKs in other languages (Python, Go, PHP, Java) and server-side configs use. It's the most useful form when the intent is "find me something matching these attributes" rather than "this exact name".

Both `provider` and `isByok: true` filter to **premium voices only** — the standard tier doesn't carry a provider value.

## What you'll see

- All three modes share the same preview pane. Switching tabs rewrites the code snippet to match the active mode.
- `lang` is a BCP-47 prefix match: typing `en` matches `en-GB`, `en-US`, and any other code that starts with `en-`.
- If you type an invalid regular expression in the Pattern panel, the syntax error appears below the input and Speak is disabled until you fix it.
- Deprecated voices are hidden by default in the Pattern and Query previews. The Name tab has a checkbox to show them when you need them.

## Voice Schema

Each entry returned by `getVoices()` looks like:

```typescript
{
  name: string;           // e.g. "UK English Female"
  lang: string;           // BCP-47, e.g. "en-GB"
  gender: 'f' | 'm';
  isByok?: boolean;       // true for premium voices that need user-supplied API keys
  provider?: string;      // premium voices only — e.g. "Google Cloud WaveNet"
  deprecated?: boolean;
}
```
