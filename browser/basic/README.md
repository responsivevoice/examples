# Basic Example

The simplest ResponsiveVoice implementation - just text input and a speak button.

> [!TIP]
> **Get a free API key** at [responsivevoice.org/register](https://responsivevoice.org/register) — required to access all available voices, standard and premium.

## Usage

Open `index.html` in your browser, or serve it:

```bash
npx serve .
```

## Code Highlights

```javascript
// 1. Initialize ResponsiveVoice
//    Without an apiKey the library runs in demo mode (browser-native voices only).
//    Get a free API key at https://responsivevoice.org/register
responsiveVoice.init({
  // apiKey: 'YOUR_KEY',
});

// 2. Speak text
responsiveVoice.speak('Hello, world!');

// 3. Cancel speech
responsiveVoice.cancel();

// 4. Check whether you're in demo mode (reactive to init/re-init)
if (responsiveVoice.isDemoMode()) {
  // ...surface a Demo Mode indicator in your UI
}
```

## What This Example Demonstrates

- Basic initialization
- Speaking text with default voice
- Cancelling speech
- Event handling (OnReady, OnStart, OnEnd, OnError)
- Demo Mode indicator — an amber pill next to the title appears when `rv.isDemoMode()` is true (no API key)
